platon-truffle is a development environment, testing framework and asset pipeline for PlatON, aiming to make life as an developer easier. With platon-truffle, you get:

* Built-in smart contract compilation, linking, deployment and binary management.
* Automated contract testing with Mocha and Chai.
* Configurable build pipeline with support for custom build processes.
* Scriptable deployment & migrations framework.
* Interactive console for direct contract communication.
* External script runner that executes scripts within a Truffle environment.

### Install

```
$ npm install -g platon-truffle
```

### Quick Usage

For a default set of contracts and tests, run the following within an empty project directory:

```
$ platon-truffle init
```

From there, you can run `platon-truffle compile`, `platon-truffle migrate` and `platon-truffle test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

### Documentation

Please see the [Official platon-truffle Documentation](https://platon-truffle.readthedocs.io/en/v0.1.0/) for guides, tips, and examples.

### Development

We welcome pull requests. To get started, just fork this repo, clone it locally, and run:

```shell
# Install
npm install -g lerna@3.4.3
npm install -g yarn
yarn bootstrap

# Test
yarn test

# Adding dependencies to a package
cd packages/<truffle-package>
yarn add <npm-package> [--dev] # Use yarn
```

### License

MIT
