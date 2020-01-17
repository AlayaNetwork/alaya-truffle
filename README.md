
Truffle is a development environment, testing framework and asset pipeline for Ethereum, aiming to make life as an Ethereum developer easier. With Truffle, you get:

* Built-in smart contract compilation, linking, deployment and binary management.
* Automated contract testing with Mocha and Chai.
* Configurable build pipeline with support for custom build processes.
* Scriptable deployment & migrations framework.
* Network management for deploying to many public & private networks.
* Interactive console for direct contract communication.
* Instant rebuilding of assets during development.
* External script runner that executes scripts within a Truffle environment.

### Install

+ install nodejs

```shell
wget https://nodejs.org/download/release/v10.9.0/node-v10.9.0-linux-x64.tar.gz
tar -zxvf node-v10.9.0-linux-x64.tar.gz -C /usr/local
sudo ln -s /usr/local/node-v10.9.0-linux-x64/bin/* /usr/bin/
node -v
```

+ install truffle

```shell
$ git clone https://github.com/PlatONnetwork/platon-truffle.git
$ chmod a+x ./platon-truffle/build/cli.bundled.js
$ sudo ln -s ./build/cli.bundled.js /usr/local/node-v10.9.0-linux-x64/bin/truffle
$ sudo ln -s  /usr/local/node-v10.9.0-linux-x64/bin/truffle /usr/bin/truffle
$ truffle version
```

### Quick Create local Single Node dev enviroment
```
cd ./scripts/node/
sudo ./start.sh
sudo docker logs -f platon-witch-01
``` 

### Quick Usage

For a default set of contracts and tests, run the following within an empty project directory:

```
$ truffle init
```

From there, you can run `truffle compile`, `truffle migrate` and `truffle test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

Truffle comes bundled with a local development blockchain server that launches automatically when you invoke the commands  above. If you'd like to [configure a more advanced development environment](http://truffleframework.com/docs/advanced/configuration) we recommend you install the blockchain server separately by running `npm install -g ganache-cli` at the command line.

+  [ganache-cli](https://github.com/trufflesuite/ganache-cli): a command-line version of Truffle's blockchain server.
+  [ganache](http://truffleframework.com/ganache/): A GUI for the server that displays your transaction history and chain state.


### Documentation

Please see the [Official Truffle Documentation](http://truffleframework.com/docs/) for guides, tips, and examples.

### Contributing

This package is a distribution package of the Truffle command line tool. Please see [@truffle/core](https://github.com/trufflesuite/truffle/tree/develop/packages/core) to contribute to the main core code.

### License

MIT
