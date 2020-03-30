# Writing solidity contract tests in javascript

Truffle uses the [Mocha](https://mochajs.org/) testing framework and [Chai](http://chaijs.com/) for assertions to provide you with a solid framework from which to write your JavaScript tests. Let's dive in and see how Truffle builds on top of Mocha to make testing your contracts a breeze.

Note: If you're unfamiliar with writing unit tests in Mocha, please see [Mocha's documentation](https://mochajs.org/) before continuing.

## Use contract() instead of describe()

Structurally, your tests should remain largely unchanged from that of Mocha: Your tests should exist in the `./test` directory, they should end with a `.js` extension, and they should contain code that Mocha will recognize as an automated test. What makes Truffle tests different from that of Mocha is the `contract()` function: This function works exactly like `describe()` except it enables Truffle's [clean-room features](../testing/testing-your-contracts#clean-room-environment). It works like this:

* Before each `contract()` function is run, your contracts are redeployed to the running PlatON client so the tests within it run with a clean contract state.
* The `contract()` function provides a list of accounts made available by your PlatON client which you can use to write tests.

Since Truffle uses Mocha under the hood, you can still use `describe()` to run normal Mocha tests whenever Truffle clean-room features are unnecessary.

## Use contract abstractions within your tests

Contract abstractions are the basis for making contract interaction possible from JavaScript (they're basically our [flux capacitor](https://www.youtube.com/watch?v=EhU862ONFys)). Because Truffle has no way of detecting which contracts you'll need to interact with within your tests, you'll need to ask for those contracts explicitly. You do this by using the `artifacts.require()` method, a method provided by Truffle that allows you to request a usable contract abstraction for a specific Solidity contract. As you'll see in the example below, you can then use this abstraction to make sure your contracts are working properly.

For more information on using contract abstractions, see the [Interacting With Your Contracts](../getting-started/interacting-with-your-contracts) section.

## Using artifacts.require()

Using `artifacts.require()` within your tests works the same way as using it within your migrations; you just need to pass the name of the contract. See the [artifacts.require() documentation](../getting-started/running-migrations#artifacts-require-) in the Migrations section for detailed usage.

## Using web3

A `web3` instance is available in each test file, configured to the correct provider. So calling `web3.platon.getBalance` just works!

## Examples

### Using `.then`

Here's an example test provided in the `MetaCoin Truffle Box`. Note the use of the `contract()` function, the `accounts` array for specifying available PlatON accounts, and our use of `artifacts.require()` for interacting directly with our contracts.

File: `./test/metacoin.js`

```javascript
const MetaCoin = artifacts.require("MetaCoin");

contract("MetaCoin", accounts => {
  it("should put 10000 MetaCoin in the first account", () =>
    MetaCoin.deployed()
      .then(instance => instance.getBalance.call(accounts[0]))
      .then(balance => {
        assert.equal(
          balance.valueOf(),
          10000,
          "10000 wasn't in the first account"
        );
      }));

  it("should call a function that depends on a linked library", () => {
    let meta;
    let metaCoinBalance;
    let metaCoinLatBalance;

    return MetaCoin.deployed()
      .then(instance => {
        meta = instance;
        return meta.getBalance.call(accounts[0]);
      })
      .then(outCoinBalance => {
        metaCoinBalance = outCoinBalance.toNumber();
        return meta.getBalanceInLat.call(accounts[0]);
      })
      .then(outCoinBalanceLat => {
        metaCoinLatBalance = outCoinBalanceLat.toNumber();
      })
      .then(() => {
        assert.equal(
          metaCoinLatBalance,
          2 * metaCoinBalance,
          "Library function returned unexpected function, linkage may be broken"
        );
      });
  });

  it("should send coin correctly", () => {
    let meta;

    // Get initial balances of first and second account.
    const account_one = accounts[0];
    const account_two = accounts[1];

    let account_one_starting_balance;
    let account_two_starting_balance;
    let account_one_ending_balance;
    let account_two_ending_balance;

    const amount = 10;

    return MetaCoin.deployed()
      .then(instance => {
        meta = instance;
        return meta.getBalance.call(account_one);
      })
      .then(balance => {
        account_one_starting_balance = balance.toNumber();
        return meta.getBalance.call(account_two);
      })
      .then(balance => {
        account_two_starting_balance = balance.toNumber();
        return meta.sendCoin(account_two, amount, { from: account_one });
      })
      .then(() => meta.getBalance.call(account_one))
      .then(balance => {
        account_one_ending_balance = balance.toNumber();
        return meta.getBalance.call(account_two);
      })
      .then(balance => {
        account_two_ending_balance = balance.toNumber();

        assert.equal(
          account_one_ending_balance,
          account_one_starting_balance - amount,
          "Amount wasn't correctly taken from the sender"
        );
        assert.equal(
          account_two_ending_balance,
          account_two_starting_balance + amount,
          "Amount wasn't correctly sent to the receiver"
        );
      });
  });
});
```


This test will produce the following output:

```
  Contract: MetaCoin
    √ should put 10000 MetaCoin in the first account (83ms)
    √ should call a function that depends on a linked library (43ms)
    √ should send coin correctly (122ms)


  3 passing (293ms)
```

### Using async/await

Here is a similar example, but using [async/await](https://javascript.info/async-await) notation: 

```javascript
const MetaCoin = artifacts.require("MetaCoin");

contract("2nd MetaCoin test", async accounts => {
  it("should put 10000 MetaCoin in the first account", async () => {
    let instance = await MetaCoin.deployed();
    let balance = await instance.getBalance.call(accounts[0]);
    assert.equal(balance.valueOf(), 10000);
  });

  it("should call a function that depends on a linked library", async () => {
    let meta = await MetaCoin.deployed();
    let outCoinBalance = await meta.getBalance.call(accounts[0]);
    let metaCoinBalance = outCoinBalance.toNumber();
    let outCoinBalanceLat = await meta.getBalanceInLat.call(accounts[0]);
    let metaCoinLatBalance = outCoinBalanceLat.toNumber();
    assert.equal(metaCoinLatBalance, 2 * metaCoinBalance);
  });

  it("should send coin correctly", async () => {
    // Get initial balances of first and second account.
    let account_one = accounts[0];
    let account_two = accounts[1];

    let amount = 10;

    let instance = await MetaCoin.deployed();
    let meta = instance;

    let balance = await meta.getBalance.call(account_one);
    let account_one_starting_balance = balance.toNumber();

    balance = await meta.getBalance.call(account_two);
    let account_two_starting_balance = balance.toNumber();
    await meta.sendCoin(account_two, amount, { from: account_one });

    balance = await meta.getBalance.call(account_one);
    let account_one_ending_balance = balance.toNumber();

    balance = await meta.getBalance.call(account_two);
    let account_two_ending_balance = balance.toNumber();

    assert.equal(
      account_one_ending_balance,
      account_one_starting_balance - amount,
      "Amount wasn't correctly taken from the sender"
    );
    assert.equal(
      account_two_ending_balance,
      account_two_starting_balance + amount,
      "Amount wasn't correctly sent to the receiver"
    );
  });
});
```

This test will produce identical output to the previous example.

## Specifying tests

You can limit the tests being executed to a specific file as follows:

```
truffle test ./test/metacoin.js
```

See the full [command reference](../reference/truffle-commands#test) for more information.

## TypeScript File Support

Truffle now supports tests saved as a `.ts` [TypeScript](https://www.typescriptlang.org/) file. Please see the [Writing Tests in JavaScript](#writing-tests-in-javascript) guide for more information.


# Writing wasm contract tests in javascript

## Use contract() instead of describe()

Structurally, your tests should remain unchanged from that of Mocha: Your tests should exist in the `./test/wasm` directory, they should end with a `.js` extension

## Using global contract object

The contract object uses the contract name as the key, and the contract object value contains the abi required for the deployment contract and the parameters for calling the sendTransaction deployment contract, so you can deploy the contract based on this. After the deployment contract is successful, you can obtain the transaction receipt, which contains the contract Address to initialize the contract object

```note::
The contract name is the file name with the .wasm suffix after the contract is compiled
if you have a wasm contract file with name js_contracttest.cpp in `./contracts` directory, the compiled file js_contracttest.wasm and js_contracttest.abi.json file will be located in `./build/contracts` directory
and the contract name will be js_contraccttest
```

## Using web3

A `web3` instance is available in each test file, configured to the correct provider. So calling `web3.platon.getBalance` just works!

## Examples

Here's an example wasm test:

```javascript
const waitTime = 10000;
let contract = undefined;

describe("wasm unit test (you must update config before run this test)", function () {
    before("deploy contract", async function () {
	    this.timeout(waitTime);
        const receipt = await web3.platon.sendTransaction(js_contracttest.deployParams);
	    contract = await new web3.platon.Contract(js_contracttest.abi,receipt.contractAddress,{vmType:1});
    });

    it("call get method", async function () {
        this.timeout(waitTime);
        var result = await contract.methods.getUint64().call();
        assert.equal(result, 0, "getUint64 method should return 0");
    });
});
```

If you have already deployed a smart contract and do not want to redeploy, you can specify contract address in test file.

```javascript
const waitTime = 10000;
let contract = undefined;
let contractAddress = "0x3F212ec13eAD7D409eba24a84c286dD1A527EeFD";

describe("wasm unit test (you must update config before run this test)", function () {
    before("deploy contract", async function () {
	    contract = await new web3.platon.Contract(js_contracttest.abi, contractAddress,{vmType:1});
    });

    it("call get method", async function () {
        this.timeout(waitTime);
        var result = await contract.methods.getUint64().call();
        assert.equal(result, 0, "getUint64 method should return 0");
    });
});
```

This test will produce the following output:

```
  Contract: js_contracttest
    √ wasm unit test (you must update config before run this test) call get method: 9ms

  1 passing (4s)
```

## Specifying contract

You can specify a specific wasm contract to run the test

```shell script
$ truffle test --wasm --contract-name ${ContractName} --param ${InitParamsString}
```