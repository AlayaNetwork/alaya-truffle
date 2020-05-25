# Using platon-truffle console

Sometimes it's nice to work with your contracts interactively for testing and debugging purposes, or for executing transactions by hand. platon truffle provides you one easy way to do this via an interactive console, with your contracts available and ready to use.

* **platon-truffle console**: A basic interactive console connecting to any PlatON client

## Why console?

Reasons to use **platon-truffle console**:

* You have a client you're already using, such as platon
* You want to migrate to a testnet (or the main PlatON network)
* You want to use a specific mnemonic or account list


## Commands

All commands require that you be in your project folder. You do not need to be at the root.

### Console

To launch the console:

```shell
platon-truffle console
```


This will look for a network definition called `development` in the configuration, and connect to it, if available. You can override this using the `--network <name>` option or [customize](../reference/configuration.md#networks) the `development` network settings. See more details in the [Networks](../reference/truffle-commands.md#networks) section as well as the [command reference](../reference/truffle-commands.md).

When you load the console, you'll immediately see the following prompt:

```shell
truffle(development)>
```

This tells you you're running within a platon truffle console using the `development` network.


## Features

Both platon truffle Develop and the console provide most of the features available in the platon truffle command line tool. For instance, you can type `migrate --reset` within the console, and it will be interpreted the same as if you ran `platon-truffle migrate --reset` on the command line.

Additionally, both platon truffle Develop and the console have the following features:

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

If a platon truffle command is not available, it is because it is not relevant for an existing project (for example, `init`) or wouldn't make sense (for example, `console`).

See full [command reference](../reference/truffle-commands.md) for more information.
