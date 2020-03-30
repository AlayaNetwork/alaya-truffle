# Testing your contracts

## Framework

Truffle comes standard with an automated testing framework to make testing your contracts a breeze. This framework lets you write simple and manageable tests in two different ways:

* In `Javascript` and `TypeScript`, for exercising your contracts from the outside world, just like your application.
* In `Solidity`, for exercising your contracts in advanced, bare-to-the-metal scenarios.

Both styles of tests have their advantages and drawbacks. See the next two sections for a discussion of each one.

## Location

All solidity contract test files should be located in the `./test` directory. Truffle will only run test files with the following file extensions: `.js`, `.ts`, `.es`, `.es6`, and `.jsx`, and `.sol`. All other files are ignored.

```note::
All wasm contract test files should be located in the `./test/wasm` directory
```

## Command

To run all tests, simply run:

```
$ truffle test
```

Alternatively, you can specify a path to a specific file you want to run, e.g.,

```none
$ truffle test ./path/to/test/file.js
```

You can also specify tests to run wasm contracts(contracts with null params to init)

```
$ truffle test --wasm
```

You Can also specify specific wasm contracts to run test, If contract initialization parameters are not empty

```
$ truffle test --wasm --contract-name ${ContractName} --params "[[], ]"
```

