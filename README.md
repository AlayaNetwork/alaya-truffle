
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
wget https://nodejs.org/download/release/v10.12.0/node-v10.12.0-linux-x64.tar.gz
tar -zxvf node-v10.12.0-linux-x64.tar.gz -C /usr/local
sudo ln -s /usr/local/node-v10.12.0-linux-x64/bin/* /usr/bin/
node -v
```

+ install truffle

```shell
$ git clone https://github.com/PlatONnetwork/platon-truffle.git
$ cd platon-truffle
$ git checkout -b wasm origin/feature/wasm
$ chmod a+x ./build/cli.bundled.js
$ sudo ln -s ${pwd}/build/cli.bundled.js /usr/bin/truffle
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

### Documentation

Please see the [Official Truffle Documentation](https://platon-truffle.readthedocs.io/en/v0.1.0/) for guides, tips, and examples.

### License

MIT
