# Truffle commands

This section will describe every command available in the Truffle application.

## Usage

All commands are in the following form:

```shell
truffle <command> [options]
```

Passing no arguments is equivalent to `truffle help`, which will display a list of all commands and then exit.

## Available commands

```eval_rst
.. _compile:
```

### compile

Compile contract source files.

```shell
truffle compile [--list <filter>] [--all] [--network <name>] [--quiet]
```

This will only compile contracts that have changed since the last compile, unless otherwise specified.

Options:

* `--list <filter>`: List all recent stable releases from solc-bin. If filter is specified then it will display only that type of release or docker tags. The filter parameter must be one of the following: prereleases, releases, latestRelease or docker.
* `--all`: Compile all contracts instead of only the contracts changed since last compile.
* `--network <name>`: Specify the network to use, saving artifacts specific to that network. Network name must exist in the configuration.
* `--quiet`: Suppress all compilation output.

```eval_rst
.. _config:
```

### config

Display whether analytics are enabled or disabled and prompt whether to toggle the setting.

```shell
truffle config [--enable-analytics|--disable-analytics]
```

Options:

* `--enable-analytics|--disable-analytics`: Enable or disable analytics.

```eval_rst
.. _console:
```

### console

Run a console with contract abstractions and commands available.

```shell
truffle console [--network <name>] [--verbose-rpc]
```

Spawns an interface to interact with contracts via the command line. Additionally, many Truffle commands are available within the console (without the `truffle` prefix).

See the `Using the console` section for more details.

Options:

* `--network <name>`: Specify the network to use. Network name must exist in the configuration.

```eval_rst
.. _create:
```

### create

Helper to create new contracts, migrations and tests.

```shell
truffle create <artifact_type> <ArtifactName>
```

Options:

* `<artifact_type>`:  Create a new artifact where artifact_type is one of the following: contract, migration or test. The new artifact is created along with one of the following files: `contracts/ArtifactName.sol`, `migrations/####_artifact_name.js` or `tests/artifact_name.js`. (required)
* `<ArtifactName>`: Name of new artifact. (required)

Camel case names of artifacts will be converted to underscore-separated file names for the migrations and tests. Number prefixes for migrations are automatically generated.

```eval_rst
.. _deploy:
```

### deploy

 `migrate` alias. reference [migrate](#migrate) 。

```eval_rst
.. _exec:
```

### exec

Execute a JS module within the Truffle environment.

```shell
truffle exec <script.js> [--network <name>] [--compile]
```

This will include `web3`, set the default provider based on the network specified (if any), and include your contracts as global objects while executing the script. Your script must export a function that Truffle can run.

See the [Writing external scripts](../getting-started/writing-external-scripts.md) section for more details.

Options：

* `<script.js>`: JavaScript file to be executed. Can include path information if the script does not exist in the current directory. (required)
* `--network <name>`:  Specify the network to use, using artifacts specific to that network. Network name must exist in the configuration.
* `--compile`: Compile contracts before executing the script.

```eval_rst
.. _help:
```

### help

Display a list of all commands or information about a specific command.

```shell
truffle help [<command>]
```

Options：

* `<command>`: Display usage information about the specified command.

```eval_rst
.. _init:
```

### init

Initialize new and empty PlatON project

```shell
truffle init [--force]
```

Creates a new and empty Truffle project within the current working directory.

 ```note::
   **警告**: Older versions of Truffle used `truffle init bare` to create an empty project. This usage has been deprecated. Those looking for the MetaCoin example that used to be available through `truffle init` should use `truffle unbox MetaCoin` instead.
 ```

Options：

* `--force`: Initialize project regardless of the current working directory's state. Be careful, this could overwrite existing files that have name conflicts.

```eval_rst
.. _migrate:
```

### migrate

Run migrations to deploy contracts.

```shell
truffle migrate [--reset] [--wasm] [--f <number>] [--to <number>] [--network <name>] [--compile-all] [--contract-name] [--verbose-rpc] [--dry-run] [--interactive]
```


Unless specified, this will run from the last completed migration. See the [Migrations](../getting-started/running-migrations.md) section for more details.

Options：

* `--reset`: Run all migrations from the beginning, instead of running from the last completed migration.
* `--wasm`: migration for all wasm contract.
* `--f <number>`: Run contracts from a specific migration. The number refers to the prefix of the migration file.
* `--to <number>`: Run contracts to a specific migration. The number refers to the prefix of the migration file.
* `--network <name>`: Specify the network to use, saving artifacts specific to that network. Network name must exist in the configuration.
* `--compile-all`: Compile all contracts instead of intelligently choosing which contracts need to be compiled.
* `--contract-name`: migration for specific name wasm contract.
* `--verbose-rpc`: Log communication between Truffle and the PlatON client.
* `--dry-run`: Fork the network specified and only perform a test migration.
* `--interactive`: Prompt to confirm that the user wants to proceed after the dry run.

### networks

Show addresses for deployed contracts on each network.

```shell
truffle networks [--clean]
```

Use this command before publishing your package to see if there are any extraneous network artifacts you don't want published. With no options specified, this package will simply output the current artifact state.

Options：

* `--clean`: Remove all network artifacts that aren't associated with a named network.

```eval_rst
.. _opcode:
```

### opcode

Print the compiled opcodes for a given contract.

```shell
truffle opcode <contract_name>
```

Options：

* `<contract_name>`: Name of the contract to print opcodes for. Must be a contract name, not a file name. (required)

```eval_rst
.. _test:
```

### test

Run JavaScript and Solidity tests.

```shell
truffle test [<test_file>] [--compile-all] [--network <name>] [--verbose-rpc] [--show-events]
```

Runs some or all tests within the `test/` directory as specified. See the section on Testing your contracts for more information.

Options：

* `<test_file>`: Name of the test file to be run. Can include path information if the file does not exist in the current directory.
* `--compile-all`: Compile all contracts instead of intelligently choosing which contracts need to be compiled.
* `--network <name>`: Specify the network to use, using artifacts specific to that network. Network name must exist in the configuration.
* `--verbose-rpc`: Log communication between Truffle and the PlatON client.
* `--show-events`: Log all contract events.

```eval_rst
.. _version:
```

### version

Show version number and exit.

```shell
truffle version
```


