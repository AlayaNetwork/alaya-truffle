import { parsedUriObject } from "typings";
import { Callback, JsonRpcResponse, Provider } from "@truffle/provider";

const Blockchain = {
  getBlockByNumber(
    blockNumber: string,
    provider: Provider,
    callback: Callback<JsonRpcResponse>
  ) {
    const params = [blockNumber, true];
    provider.send(
      {
        jsonrpc: "2.0",
        method: "platon_getBlockByNumber",
        params,
        id: Date.now()
      },
      callback
    );
  },

  getBlockByHash(
    blockHash: string,
    provider: Provider,
    callback: Callback<JsonRpcResponse>
  ) {
    const params = [blockHash, true];
    provider.send(
      {
        jsonrpc: "2.0",
        method: "platon_getBlockByHash",
        params,
        id: Date.now()
      },
      callback
    );
  },

  parse(uri: string) {
    const parsed: parsedUriObject = {};
    if (uri.indexOf("blockchain://") !== 0) return parsed;

    const cleanUri = uri.replace("blockchain://", "");

    const pieces = cleanUri.split("/block/");

    parsed.genesis_hash = `0x${pieces[0]}`;
    parsed.block_hash = `0x${pieces[1]}`;

    return parsed;
  },

  asURI(provider: Provider, callback: Callback<any>) {
    let genesis: any, latest;

    this.getBlockByNumber(
      "0x0",
      provider,
      (err: Error, { result }: JsonRpcResponse) => {
        if (err) return callback(err);
        genesis = result;

        this.getBlockByNumber(
          "latest",
          provider,
          (err: Error, { result }: JsonRpcResponse) => {
            if (err) return callback(err);
            latest = result;
            const url = `blockchain://${genesis.hash.replace(
              "0x",
              ""
            )}/block/${latest.hash.replace("0x", "")}`;
            callback(null, url);
          }
        );
      }
    );
  },

  matches(uri: string, provider: Provider, callback: Callback<any>) {
    const parsedUri = this.parse(uri);

    const expected_genesis = parsedUri.genesis_hash;
    const expected_block = parsedUri.block_hash;

    this.getBlockByNumber(
      "0x0",
      provider,
      (err: Error, { result }: JsonRpcResponse) => {
        if (err) return callback(err);
        const block = result;
        if (block.hash !== expected_genesis) return callback(null, false);

        this.getBlockByHash(
          expected_block,
          provider,
          (err: Error, { result }: JsonRpcResponse) => {
            // Treat an error as if the block didn't exist. This is because
            // some clients respond differently.
            const block = result;
            if (err || block == null) {
              return callback(null, false);
            }

            callback(null, true);
          }
        );
      }
    );
  }
};

export = Blockchain;
