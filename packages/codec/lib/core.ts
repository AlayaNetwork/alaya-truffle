import debugModule from "debug";
const debug = debugModule("codec:core");

import * as Ast from "@truffle/codec/ast";
import * as AbiData from "@truffle/codec/abi-data";
import * as Topic from "@truffle/codec/topic";
import * as Bytes from "@truffle/codec/bytes";
import * as Pointer from "@truffle/codec/pointer";
import {
  DecoderRequest,
  CalldataDecoding,
  ReturndataDecoding,
  BytecodeDecoding,
  DecodingMode,
  AbiArgument,
  LogDecoding,
  DecoderOptions
} from "@truffle/codec/types";
import * as Evm from "@truffle/codec/evm";
import * as Contexts from "@truffle/codec/contexts";
import { abifyType, abifyResult } from "@truffle/codec/abify";
import * as Conversion from "@truffle/codec/conversion";
import * as Format from "@truffle/codec/format";
import { StopDecodingError } from "@truffle/codec/errors";
import read from "@truffle/codec/read";
import decode from "@truffle/codec/decode";
import Web3Utils from "@platonnetwork/web3-utils";

/**
 * @Category Decoding
 */
export function* decodeVariable(
  definition: Ast.AstNode,
  pointer: Pointer.DataPointer,
  info: Evm.EvmInfo
): Generator<DecoderRequest, Format.Values.Result, Uint8Array> {
  let compiler = info.currentContext.compiler;
  let dataType = Ast.Import.definitionToType(definition, compiler);
  return yield* decode(dataType, pointer, info); //no need to pass an offset
}

/**
 * @Category Decoding
 */
export function* decodeCalldata(
  info: Evm.EvmInfo,
  isConstructor?: boolean //ignored if context! trust context instead if have
): Generator<DecoderRequest, CalldataDecoding, Uint8Array> {
  const context = info.currentContext;
  if (context === null) {
    //if we don't know the contract ID, we can't decode
    if (isConstructor) {
      return {
        kind: "create" as const,
        decodingMode: "full" as const,
        bytecode: Conversion.toHexString(info.state.calldata)
      };
    } else {
      return {
        kind: "unknown" as const,
        decodingMode: "full" as const,
        data: Conversion.toHexString(info.state.calldata)
      };
    }
  }
  const compiler = context.compiler;
  const contextHash = context.context;
  const contractType = Contexts.Import.contextToType(context);
  isConstructor = context.isConstructor;
  const allocations = info.allocations.calldata;
  let allocation: AbiData.Allocate.CalldataAllocation;
  let selector: string;
  //first: is this a creation call?
  if (isConstructor) {
    allocation = allocations.constructorAllocations[contextHash].input;
  } else {
    //skipping any error-handling on this read, as a calldata read can't throw anyway
    let rawSelector = yield* read(
      {
        location: "calldata",
        start: 0,
        length: Evm.Utils.SELECTOR_SIZE
      },
      info.state
    );
    selector = Conversion.toHexString(rawSelector);
    allocation = allocations.functionAllocations[contextHash][selector].input;
  }
  if (allocation === undefined) {
    return {
      kind: "message" as const,
      class: contractType,
      abi: context.hasFallback
        ? AbiData.Utils.fallbackAbiForPayability(context.payable)
        : null,
      data: Conversion.toHexString(info.state.calldata),
      decodingMode: "full" as const
    };
  }
  let decodingMode: DecodingMode = allocation.allocationMode; //starts out this way, degrades to ABI if necessary
  //you can't map with a generator, so we have to do this map manually
  let decodedArguments: AbiArgument[] = [];
  for (const argumentAllocation of allocation.arguments) {
    let value: Format.Values.Result;
    let dataType =
      decodingMode === "full"
        ? argumentAllocation.type
        : abifyType(argumentAllocation.type);
    try {
      value = yield* decode(dataType, argumentAllocation.pointer, info, {
        abiPointerBase: allocation.offset, //note the use of the offset for decoding pointers!
        allowRetry: decodingMode === "full"
      });
    } catch (error) {
      if (
        error instanceof StopDecodingError &&
        error.allowRetry &&
        decodingMode === "full"
      ) {
        //if a retry happens, we've got to do several things in order to switch to ABI mode:
        //1. mark that we're switching to ABI mode;
        decodingMode = "abi";
        //2. abify all previously decoded values;
        decodedArguments = decodedArguments.map(argumentDecoding => ({
          ...argumentDecoding,
          value: abifyResult(argumentDecoding.value, info.userDefinedTypes)
        }));
        //3. retry this particular decode in ABI mode.
        //(no try/catch on this one because we can't actually handle errors here!
        //not that they should be occurring)
        value = yield* decode(
          abifyType(argumentAllocation.type), //type is now abified!
          argumentAllocation.pointer,
          info,
          {
            abiPointerBase: allocation.offset
          }
        );
        //4. the remaining parameters will then automatically be decoded in ABI mode due to (1),
        //so we don't need to do anything special there.
      } else {
        //we shouldn't be getting other exceptions, but if we do, we don't know
        //how to handle them, so uhhhh just rethrow I guess??
        throw error;
      }
    }
    const name = argumentAllocation.name;
    decodedArguments.push(
      name //deliberate general falsiness test
        ? { name, value }
        : { value }
    );
  }
  if (isConstructor) {
    return {
      kind: "constructor" as const,
      class: contractType,
      arguments: decodedArguments,
      abi: <AbiData.ConstructorAbiEntry>allocation.abi, //we know it's a constructor, but typescript doesn't
      bytecode: Conversion.toHexString(
        info.state.calldata.slice(0, allocation.offset)
      ),
      decodingMode
    };
  } else {
    return {
      kind: "function" as const,
      class: contractType,
      abi: <AbiData.FunctionAbiEntry>allocation.abi, //we know it's a function, but typescript doesn't
      arguments: decodedArguments,
      selector,
      decodingMode
    };
  }
}

//note: this will likely change in the future to take options rather than targetName, but I'm
//leaving it alone for now, as I'm not sure what form those options will take
//(and this is something we're a bit more OK with breaking since it's primarily
//for internal use :) )
/**
 * @Category Decoding
 */
export function* decodeEvent(
  info: Evm.EvmInfo,
  address: string,
  targetName?: string
): Generator<DecoderRequest, LogDecoding[], Uint8Array> {
  const allocations = info.allocations.event;
  let rawSelector: Uint8Array;
  let selector: string;
  let contractAllocations: {
    [contextHash: string]: AbiData.Allocate.EventAllocation;
  }; //for non-anonymous events
  let libraryAllocations: {
    [contextHash: string]: AbiData.Allocate.EventAllocation;
  }; //similar
  const topicsCount = info.state.eventtopics.length;
  //yeah, it's not great to read directly from the state like this (bypassing read), but what are you gonna do?
  if (topicsCount > 0) {
    rawSelector = yield* read(
      {
        location: "eventtopic",
        topic: 0
      },
      info.state
    );
    selector = Conversion.toHexString(rawSelector);
    ({
      contract: contractAllocations,
      library: libraryAllocations
    } = allocations[topicsCount].bySelector[selector] || {
      contract: {},
      library: {}
    });
  } else {
    //if we don't have a selector, it means we don't have any non-anonymous events
    contractAllocations = {};
    libraryAllocations = {};
  }
  //now: let's get our allocations for anonymous events
  //note: these ones map contract IDs to *arrays* of event allocations, not individual allocations!
  const {
    contract: contractAnonymousAllocations,
    library: libraryAnonymousAllocations
  } = allocations[topicsCount].anonymous;
  //now: what contract are we (probably) dealing with? let's get its code to find out
  const codeBytes: Uint8Array = yield {
    type: "code",
    address
  };
  const codeAsHex = Conversion.toHexString(codeBytes);
  const contractContext = Contexts.Utils.findDecoderContext(
    info.contexts,
    codeAsHex
  );
  let possibleContractAllocations: AbiData.Allocate.EventAllocation[]; //excludes anonymous events
  let possibleContractAnonymousAllocations: AbiData.Allocate.EventAllocation[];
  if (contractContext) {
    //if we found the contract, maybe it's from that contract
    const contextHash = contractContext.context;
    const contractAllocation = contractAllocations[contextHash];
    const contractAnonymousAllocation =
      contractAnonymousAllocations[contextHash];
    possibleContractAllocations = contractAllocation
      ? [contractAllocation]
      : [];
    possibleContractAnonymousAllocations = contractAnonymousAllocation || [];
  } else {
    //if we couldn't determine the contract, well, we have to assume it's from a library
    possibleContractAllocations = [];
    possibleContractAnonymousAllocations = [];
  }
  //now we get all the library allocations!
  const possibleLibraryAllocations = Object.values(libraryAllocations);
  const possibleLibraryAnonymousAllocations = [].concat(
    ...Object.values(libraryAnonymousAllocations)
  );
  //now we put it all together!
  const possibleAllocations = possibleContractAllocations.concat(
    possibleLibraryAllocations
  );
  const possibleAnonymousAllocations = possibleContractAnonymousAllocations.concat(
    possibleLibraryAnonymousAllocations
  );
  const possibleAllocationsTotal = possibleAllocations.concat(
    possibleAnonymousAllocations
  );
  let decodings: LogDecoding[] = [];
  allocationAttempts: for (const allocation of possibleAllocationsTotal) {
    //first: do a name check so we can skip decoding if name is wrong
    debug("trying allocation: %O", allocation);
    if (targetName !== undefined && allocation.abi.name !== targetName) {
      continue;
    }
    let decodingMode: DecodingMode = allocation.allocationMode; //starts out here; degrades to abi if necessary
    const contextHash = allocation.contextHash;
    const attemptContext = info.contexts[contextHash];
    const contractType = Contexts.Import.contextToType(attemptContext);
    //you can't map with a generator, so we have to do this map manually
    let decodedArguments: AbiArgument[] = [];
    for (const argumentAllocation of allocation.arguments) {
      let value: Format.Values.Result;
      //if in full mode, use the allocation's listed data type.
      //if in ABI mode, abify it before use.
      let dataType =
        decodingMode === "full"
          ? argumentAllocation.type
          : abifyType(argumentAllocation.type);
      try {
        value = yield* decode(dataType, argumentAllocation.pointer, info, {
          strictAbiMode: true, //turns on STRICT MODE to cause more errors to be thrown
          allowRetry: decodingMode === "full" //this option is unnecessary but including for clarity
        });
      } catch (error) {
        if (
          error instanceof StopDecodingError &&
          error.allowRetry &&
          decodingMode === "full"
        ) {
          //if a retry happens, we've got to do several things in order to switch to ABI mode:
          //1. mark that we're switching to ABI mode;
          decodingMode = "abi";
          //2. abify all previously decoded values;
          decodedArguments = decodedArguments.map(argumentDecoding => ({
            ...argumentDecoding,
            value: abifyResult(argumentDecoding.value, info.userDefinedTypes)
          }));
          //3. retry this particular decode in ABI mode.
          try {
            value = yield* decode(
              abifyType(argumentAllocation.type), //type is now abified!
              argumentAllocation.pointer,
              info,
              {
                strictAbiMode: true //turns on STRICT MODE to cause more errors to be thrown
                //retries no longer allowed, not that this has an effect
              }
            );
          } catch (_) {
            //if an error occurred on the retry, this isn't a valid decoding!
            debug("rejected due to exception on retry");
            continue allocationAttempts;
          }
          //4. the remaining parameters will then automatically be decoded in ABI mode due to (1),
          //so we don't need to do anything special there.
        } else {
          //if any other sort of error occurred, this isn't a valid decoding!
          debug("rejected due to exception on first try: %O", error);
          continue allocationAttempts;
        }
      }
      const name = argumentAllocation.name;
      const indexed = argumentAllocation.pointer.location === "eventtopic";
      decodedArguments.push(
        name //deliberate general falsiness test
          ? { name, indexed, value }
          : { indexed, value }
      );
    }
    //OK, so, having decoded the result, the question is: does it reencode to the original?
    //first, we have to filter out the indexed arguments, and also get rid of the name information
    const nonIndexedValues = decodedArguments
      .filter(argument => !argument.indexed)
      .map(argument => argument.value);
    //now, we can encode!
    const reEncodedData = AbiData.Encode.encodeTupleAbi(
      nonIndexedValues,
      info.allocations.abi
    );
    const encodedData = info.state.eventdata; //again, not great to read this directly, but oh well
    //are they equal?
    if (!Evm.Utils.equalData(reEncodedData, encodedData)) {
      //if not, this allocation doesn't work
      debug("rejected due to [non-indexed] mismatch");
      continue;
    }
    //one last check -- let's check that the indexed arguments match up, too
    const indexedValues = decodedArguments
      .filter(argument => argument.indexed)
      .map(argument => argument.value);
    debug("indexedValues: %O", indexedValues);
    const reEncodedTopics = indexedValues.map(Topic.Encode.encodeTopic);
    const encodedTopics = info.state.eventtopics;
    //now: do *these* match?
    const selectorAdjustment = allocation.anonymous ? 0 : 1;
    for (let i = 0; i < reEncodedTopics.length; i++) {
      debug("encodedTopics[i]: %O", encodedTopics[i]);
      if (
        !Evm.Utils.equalData(
          reEncodedTopics[i],
          encodedTopics[i + selectorAdjustment]
        )
      ) {
        debug("rejected due to indexed mismatch");
        continue allocationAttempts;
      }
    }
    //if we've made it here, the allocation works!  hooray!
    debug("allocation accepted!");
    if (allocation.abi.anonymous) {
      decodings.push({
        kind: "anonymous",
        class: contractType,
        abi: allocation.abi,
        arguments: decodedArguments,
        decodingMode
      });
    } else {
      decodings.push({
        kind: "event",
        class: contractType,
        abi: allocation.abi,
        arguments: decodedArguments,
        selector,
        decodingMode
      });
    }
  }
  return decodings;
}

const errorSelector: Uint8Array = Conversion.toBytes(
  Web3Utils.soliditySha3({
    type: "string",
    value: "Error(string)"
  })
).subarray(0, Evm.Utils.SELECTOR_SIZE);

const defaultReturnAllocations: AbiData.Allocate.ReturndataAllocation[] = [
  {
    kind: "revert" as const,
    allocationMode: "full" as const,
    selector: errorSelector,
    arguments: [
      {
        name: "",
        pointer: {
          location: "returndata" as const,
          start: errorSelector.length,
          length: Evm.Utils.WORD_SIZE
        },
        type: {
          typeClass: "string" as const,
          typeHint: "string"
        }
      }
    ]
  },
  {
    kind: "failure" as const,
    allocationMode: "full" as const,
    selector: new Uint8Array(), //empty by default
    arguments: []
  },
  {
    kind: "selfdestruct" as const,
    allocationMode: "full" as const,
    selector: new Uint8Array(), //empty by default
    arguments: []
  }
];

/**
 * If there are multiple possibilities, they're always returned in
 * the order: return, revert, failure, empty, bytecode, unknownbytecode
 * @Category Decoding
 */
export function* decodeReturndata(
  info: Evm.EvmInfo,
  successAllocation: AbiData.Allocate.ReturndataAllocation | null, //null here must be explicit
  status?: boolean //you can pass this to indicate that you know the status
): Generator<DecoderRequest, ReturndataDecoding[], Uint8Array> {
  let possibleAllocations: AbiData.Allocate.ReturndataAllocation[];
  if (successAllocation === null) {
    possibleAllocations = defaultReturnAllocations;
  } else {
    switch (successAllocation.kind) {
      case "return":
        possibleAllocations = [successAllocation, ...defaultReturnAllocations];
        break;
      case "bytecode":
        possibleAllocations = [...defaultReturnAllocations, successAllocation];
        break;
      //Other cases shouldn't happen so I'm leaving them to cause errors!
    }
  }
  let decodings: ReturndataDecoding[] = [];
  allocationAttempts: for (const allocation of possibleAllocations) {
    debug("trying allocation: %O", allocation);
    //before we attempt to use this allocation, we check: does the selector match?
    let encodedData = info.state.returndata; //again, not great to read this directly, but oh well
    const encodedPrefix = encodedData.subarray(0, allocation.selector.length);
    if (!Evm.Utils.equalData(encodedPrefix, allocation.selector)) {
      continue;
    }
    encodedData = encodedData.subarray(allocation.selector.length); //slice off the selector for later
    //also we check, does the status match?
    if (status !== undefined) {
      const successKinds = ["return", "selfdestruct", "bytecode"];
      const failKinds = ["failure", "revert"];
      if (status) {
        if (!successKinds.includes(allocation.kind)) {
          continue;
        }
      } else {
        if (!failKinds.includes(allocation.kind)) {
          continue;
        }
      }
    }
    let decodingMode: DecodingMode = allocation.allocationMode; //starts out here; degrades to abi if necessary
    if (allocation.kind === "bytecode") {
      //bytecode is special and can't really be integrated with the other cases.
      //so it gets its own code here.
      const bytecode = Conversion.toHexString(info.state.returndata);
      const context = Contexts.Utils.findDecoderContext(
        info.contexts,
        bytecode
      );
      if (!context) {
        decodings.push({
          kind: "unknownbytecode" as const,
          status: true as const,
          decodingMode,
          bytecode
        });
        continue; //skip the rest of the code in the allocation loop!
      }
      const contractType = Contexts.Import.contextToType(context);
      let decoding: BytecodeDecoding = {
        kind: "bytecode" as const,
        status: true as const,
        decodingMode,
        bytecode,
        class: contractType
      };
      if (contractType.contractKind === "library") {
        //note: I am relying on this being present!
        //(also this part is a bit HACKy)
        const pushAddressInstruction = (
          0x60 +
          Evm.Utils.ADDRESS_SIZE -
          1
        ).toString(16); //"73"
        const delegateCallGuardString =
          "0x" + pushAddressInstruction + "..".repeat(Evm.Utils.ADDRESS_SIZE);
        if (context.binary.startsWith(delegateCallGuardString)) {
          decoding.address = Web3Utils.toChecksumAddress(
            bytecode.slice(4, 4 + 2 * Evm.Utils.ADDRESS_SIZE) //4 = "0x73".length
          );
        }
      }
      decodings.push(decoding);
      continue; //skip the rest of the code in the allocation loop!
    }
    //you can't map with a generator, so we have to do this map manually
    let decodedArguments: AbiArgument[] = [];
    for (const argumentAllocation of allocation.arguments) {
      let value: Format.Values.Result;
      //if in full mode, use the allocation's listed data type.
      //if in ABI mode, abify it before use.
      let dataType =
        decodingMode === "full"
          ? argumentAllocation.type
          : abifyType(argumentAllocation.type);
      //now, let's decode!
      try {
        value = yield* decode(dataType, argumentAllocation.pointer, info, {
          abiPointerBase: allocation.selector.length,
          strictAbiMode: true, //turns on STRICT MODE to cause more errors to be thrown
          allowRetry: decodingMode === "full" //this option is unnecessary but including for clarity
        });
        debug("value on first try: %O", value);
      } catch (error) {
        if (
          error instanceof StopDecodingError &&
          error.allowRetry &&
          decodingMode === "full"
        ) {
          debug("retry!");
          //if a retry happens, we've got to do several things in order to switch to ABI mode:
          //1. mark that we're switching to ABI mode;
          decodingMode = "abi";
          //2. abify all previously decoded values;
          decodedArguments = decodedArguments.map(argumentDecoding => ({
            ...argumentDecoding,
            value: abifyResult(argumentDecoding.value, info.userDefinedTypes)
          }));
          //3. retry this particular decode in ABI mode.
          try {
            value = yield* decode(
              abifyType(argumentAllocation.type), //type is now abified!
              argumentAllocation.pointer,
              info,
              {
                abiPointerBase: allocation.selector.length,
                strictAbiMode: true //turns on STRICT MODE to cause more errors to be thrown
                //retries no longer allowed, not that this has an effect
              }
            );
            debug("value on retry: %O", value);
          } catch (_) {
            //if an error occurred on the retry, this isn't a valid decoding!
            debug("rejected due to exception on retry");
            continue allocationAttempts;
          }
          //4. the remaining parameters will then automatically be decoded in ABI mode due to (1),
          //so we don't need to do anything special there.
        } else {
          //if any other sort of error occurred, this isn't a valid decoding!
          debug("rejected due to exception on first try: %O", error);
          continue allocationAttempts;
        }
      }
      const name = argumentAllocation.name;
      decodedArguments.push(
        name //deliberate general falsiness test
          ? { name, value }
          : { value }
      );
    }
    //OK, so, having decoded the result, the question is: does it reencode to the original?
    //first, we have to filter out the indexed arguments, and also get rid of the name information
    debug("decodedArguments: %O", decodedArguments);
    const decodedArgumentValues = decodedArguments.map(
      argument => argument.value
    );
    const reEncodedData = AbiData.Encode.encodeTupleAbi(
      decodedArgumentValues,
      info.allocations.abi
    );
    //are they equal? note the selector has been stripped off encodedData!
    if (!Evm.Utils.equalData(reEncodedData, encodedData)) {
      //if not, this allocation doesn't work
      debug("rejected due to mismatch");
      continue;
    }
    //if we've made it here, the allocation works!  hooray!
    debug("allocation accepted!");
    let decoding: ReturndataDecoding;
    let kind = allocation.kind;
    switch (kind) {
      case "return":
        decoding = {
          kind,
          status: true as const,
          arguments: decodedArguments,
          decodingMode
        };
        break;
      case "revert":
        decoding = {
          kind,
          status: false as const,
          arguments: decodedArguments,
          decodingMode
        };
        break;
      case "selfdestruct":
        decoding = {
          kind,
          status: true as const,
          decodingMode
        };
        break;
      case "failure":
        decoding = {
          kind,
          status: false as const,
          decodingMode
        };
        break;
    }
    decodings.push(decoding);
  }
  return decodings;
}

export function decodeRevert(returndata: Uint8Array): ReturndataDecoding[] {
  //coercing because TS doesn't know it'll finish in one go
  return <ReturndataDecoding[]>decodeReturndata(
    {
      allocations: {},
      state: {
        storage: {},
        returndata
      }
    },
    null,
    false
  ).next().value;
}
