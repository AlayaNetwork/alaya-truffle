# Truffle QuickStart

This page will take you through the basics of creating a Truffle project and deploying a smart contract to a blockchain.

```eval_rst
.. _creating-a-project:
```
## Creating a project

To use most Truffle commands, you need to run them against an existing Truffle project. So the first step is to create a Truffle project.

You can create a bare project template, but for those just getting started, you can use `Truffle Boxes`, which are example applications and project templates. We'll use the `MetaCoin box`, which creates a token that can be transferred between accounts:
1. Create a new directory for your Truffle project:

   ```shell
   mkdir MetaCoin
   cd MetaCoin
   ```

2. Download ("unbox") the MetaCoin box:

   ```shell
   truffle unbox metacoin
   ```

 ```note::
  You can use the `truffle unbox <box-name>` command to download any of the other Truffle Boxes.
 ```

 ```note::
   To create a bare Truffle project with no smart contracts included, use `truffle init`.
 ```

 Once this operation is completed, you'll now have a project structure with the following items:

* `contracts/`:  Directory for [Solidity contracts](getting-started/interacting-with-your-contracts.md)
* `migrations/`: Directory for [scriptable deployment files](getting-started/running-migrations.html#id2)
* `test/`:    Directory for test files for [testing your application and contracts](testing/testing-your-contracts)
* `truffle.js`: Truffle [configuration file](reference/configuration)

```eval_rst
.. _Exploring the project:
```
## Exploring the project

 ```note::
  This page is just a quickstart, so we're not going to go into much detail here. Please see the rest of the Truffle documentation to learn more.
 ```

1. Open the `contracts/MetaCoin.sol` file in a text editor. This is a smart contract (written in Solidity) that creates a MetaCoin token. Note that this also references another Solidity file `contracts/ConvertLib.sol` in the same directory.

1. Open the `contracts/Migrations.sol` file. This is a separate Solidity file that manages and updates [the status of your deployed smart contract](getting-started/running-migrations). This file comes with every Truffle project, and is usually not edited.

1. Open the `migrations/1_initial_migration.js` file. This file is the migration (deployment) script for the `Migrations` contract found in the `Migrations.sol` file.

1. Open the `migrations/2_deploy_contracts.js` file. This file is the migration script for the `MetaCoin` contract. (Migration scripts are run in order, so the file beginning with `2` will be run after the file beginning with `1`.)

1. Open the `test/TestMetacoin.sol` file. This is a [test file written in Solidity](testing/writing-tests-in-solidity) which ensures that your contract is working as expected.

1. Open the `test/metacoin.js` file. This is a [test file written in JavaScript](testing/writing-tests-in-javascript) which performs a similar function to the Solidity test above.

1. Open the `truffle-config.js` file. This is the Truffle [configuration file](reference/configuration), for setting network information and other project-related settings. The file is blank, but this is okay, as we'll be using a Truffle command that has some defaults built-in.

```eval_rst
.. _Testing:
```
## Testing

1. On a terminal, run the Solidity test:

   ```shell
   truffle test ./test/TestMetacoin.sol
   ```

   You will see the following output

    ```
     TestMetacoin
       √ testInitialBalanceUsingDeployedContract (71ms)
       √ testInitialBalanceWithNewMetaCoin (59ms)

     2 passing (794ms)
   ```

```note::
 If you're on Windows and encountering problems running this command, please see the documentation on `resolving naming conflicts on Windows. <reference/configuration.html#resolving-naming-conflicts-on-windows>`_ 。
```

  These tree tests were run against the contract, with descriptions displayed on what the tests are supposed to do.

1. Run the JavaScript test:

   ```shell
   truffle test ./test/metacoin.js
   ```

   You will see the following output

   ```
     Contract: MetaCoin
       √ should put 10000 MetaCoin in the first account
       √ should call a function that depends on a linked library (40ms)
       √ should send coin correctly (129ms)

     3 passing (255ms)
   ```

```eval_rst
.. _Compiling:
```

## Compiling

1. Compile the smart contracts:

   ```shell
   truffle compile
   ```

   You will see the following output:

   ```
   Compiling .\contracts\ConvertLib.sol...
   Compiling .\contracts\MetaCoin.sol...
   Compiling .\contracts\Migrations.sol...

   Writing artifacts to .\build\contracts
   ```

```eval_rst
.. _Migrating with Truffle Develop:
```

## Migrating

To deploy our smart contracts, we're going to need to connect to a blockchain. Truffle has a built-in personal blockchain that can be used for testing. This blockchain is local to your system and does not interact with the main PlatON network.

You can create this blockchain and interact with it using scripts/node/start.sh shell scripts.

1. Run Truffle migrate:

   ```shell
   truffle migrate
   ```

  我们可以看到下面的信息：

   ```
   Starting migrations...
   ======================
   > Network name:    'develop'
   > Network id:      4447
   > Block gas limit: 6721975

   1_initial_migration.js
   ======================

      Deploying 'Migrations'
      ----------------------
      > transaction hash:    0x3fd222279dad48583a3320decd0a2d12e82e728ba9a0f19bdaaff98c72a030a2
      > Blocks: 0            Seconds: 0
      > contract address:    0xa0AdaB6E829C818d50c75F17CFCc2e15bfd55a63
      > account:             0x627306090abab3a6e1400e9345bc60c78a8bef57
      > balance:             99.99445076
      > gas used:            277462
      > gas price:           20 gvon
      > value sent:          0 LAT
      > total cost:          0.00554924 LAT

      > Saving migration to chain.
      > Saving artifacts
      -------------------------------------
      > Total cost:          0.00554924 LAT

   2_deploy_contracts.js
   =====================

      Deploying 'ConvertLib'
      ----------------------
      > transaction hash:    0x97e8168f1c05fc40dd8ffc529b9a2bf45cc7c55b07b6b9a5a22173235ee247b6
      > Blocks: 0            Seconds: 0
      > contract address:    0xfb39FeaeF3ac3fd46e2123768e559BCe6bD638d6
      > account:             0x627306090abab3a6e1400e9345bc60c78a8bef57
      > balance:             99.9914458
      > gas used:            108240
      > gas price:           20 gvon
      > value sent:          0 LAT
      > total cost:          0.0021648 LAT

      Linking
      -------
      * Contract: MetaCoin <--> Library: ConvertLib (at address: 0xfb39FeaeF3ac3fd46e2123768e559BCe6bD638d6)

      Deploying 'MetaCoin'
      --------------------
      > transaction hash:    0xee4994097c10e7314cc83adf899d67f51f22e08b920e95b6d3f75c5eb498bde4
      > Blocks: 0            Seconds: 0
      > contract address:    0x6891Ac4E2EF3dA9bc88C96fEDbC9eA4d6D88F768
      > account:             0x627306090abab3a6e1400e9345bc60c78a8bef57
      > balance:             99.98449716
      > gas used:            347432
      > gas price:           20 gvon
      > value sent:          0 LAT
      > total cost:          0.00694864 LAT

      > Saving migration to chain.
      > Saving artifacts
      -------------------------------------
      > Total cost:          0.00911344 LAT

   Summary
   =======
   > Total deployments:   3
   > Final cost:          0.01466268 LAT
   ```

   This shows the transaction IDs and addresses of your deployed contracts. It also includes a cost summary and real-time status updates.

 ``` note::
  Your transaction hashes, contract addresses, and accounts will be different from the above.
 ```

```note::
  To see how to interact with the contract, please skip to the next section.
```

```eval_rst
.. _Interacting with the contract:
```

## Interacting with the contract

To interact with the contract, you can use the Truffle console. The Truffle console is similar to Truffle Develop, except it connects to an existing blockchain.

   ```shell
   truffle console
   ```

   You will see the following prompt:

   ```
   truffle(development)>
   ```

``` note::
  Console prompt: truffle (development)> The brackets refer to the currently connected network.
 ```

Interact with the contract using the console in the following ways:

As of Truffle v5, the console supports async/await functions, enabling much simpler interactions with the contract.

* Begin by establishing both the deployed MetaCoin contract instance and the accounts created by either Truffle's built-in blockchain:

  ```shell
  truffle(development)> let instance = await MetaCoin.deployed()
  truffle(development)> let accounts = await web3.platon.getAccounts()
  ```

* Check the metacoin balance of the account that deployed the contract:

  ```shell
  truffle(development)> let balance = await instance.getBalance(accounts[0])
  truffle(development)> balance.toNumber()
  ```

* Transfer some metacoin from one account to another:

  ```shell
  truffle(development)> instance.sendCoin(accounts[1], 500)
  ```

* Check the balance of the account that received the metacoin:

  ```shell
  truffle(development)> let received = await instance.getBalance(accounts[1])
  truffle(development)> received.toNumber()
  ```

* Check the balance of the account that sent the metacoin:

  ```shell
  truffle(development)> let newBalance = await instance.getBalance(accounts[0])
  truffle(development)> newBalance.toNumber()
  ```

```eval_rst
.. _Continue learning:
```
## Continue learning

This quickstart showed you the basics of the Truffle project lifecycle, but there is much more to learn. Please continue on with the rest of our documentation and especially our tutorials to learn more.