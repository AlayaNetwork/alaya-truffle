# Using truffle develop and the console

Sometimes it's nice to work with your contracts interactively for testing and debugging purposes, or for executing transactions by hand. Truffle provides you two easy ways to do this via an interactive console, with your contracts available and ready to use.

* **Truffle console**: A basic interactive console connecting to any PlatON client
* **Truffle Develop**: An interactive console that also spawns a development blockchain

## Why two different consoles?

Having two different consoles allows you to choose the best tool for your needs.

Reasons to use **Truffle console**:

* You have a client you're already using, such as platon
* You want to migrate to a testnet (or the main PlatON network)
* You want to use a specific mnemonic or account list

Reasons to use **Truffle Develop**:

* You are testing your project with no intention of immediately deploying
* You don't need to work with specific accounts (and you're fine with using default development accounts)
* You don't want to install and manage a separate blockchain client

## Commands

All commands require that you be in your project folder. You do not need to be at the root.

### Console

To launch the console:

```shell
truffle console
```


This will look for a network definition called `development` in the configuration, and connect to it, if available. You can override this using the `--network <name>` option or [customize](../reference/configuration.md#networks) the `development` network settings. See more details in the [Networks](../reference/truffle-commands.md#networks) section as well as the [command reference](../reference/truffle-commands.md).

When you load the console, you'll immediately see the following prompt:

```shell
truffle(development)>
```

This tells you you're running within a Truffle console using the `development` network.


## Features

Both Truffle Develop and the console provide most of the features available in the Truffle command line tool. For instance, you can type `migrate --reset` within the console, and it will be interpreted the same as if you ran `truffle migrate --reset` on the command line.

Additionally, both Truffle Develop and the console have the following features:

* All of your compiled contracts are available and ready for use.
* After each command (such as `migrate --reset`) your contracts are reprovisioned so you can start using the newly assigned addresses and binaries immediately.
* The `web3` library is made available and is set to connect to your PlatON client.

### Commands available

* `init`
* `compile`
* `deploy`
* `exec`
* `help`
* `migrate`
* `networks`
* `opcode`
* `test`
* `version`

If a Truffle command is not available, it is because it is not relevant for an existing project (for example, `init`) or wouldn't make sense (for example, `console`).

See full [command reference](../reference/truffle-commands.md) for more information.
