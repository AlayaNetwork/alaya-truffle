Platon-truffle is a development environment, testing framework and asset pipeline for PlatON, aiming to make life as an PlatON developer easier. With Platon-truffle, you get:

* Built-in smart contract compilation, linking, deployment and binary management.
* Automated contract testing with Mocha and Chai.
* Configurable build pipeline with support for custom build processes.
* Scriptable deployment & migrations framework.
* Interactive console for direct contract communication.
* Instant rebuilding of assets during development.
* External script runner that executes scripts within a Truffle environment.

# Installation

```note::
  Don't install nodejs with apt, Otherwise, you will meet a lot of permission related issues 
 ```

## Install nodejs

```bash
$ wget https://nodejs.org/download/release/v10.12.0/node-v10.12.0-linux-x64.tar.gz
$ sudo tar -zxvf node-v10.12.0-linux-x64.tar.gz -C /usr/local
$ sudo ln -s /usr/local/node-v10.12.0-linux-x64/bin/* /usr/bin/
$ node -v
$ sudo chmod -R 777 /usr/local/node-v10.12.0-linux-x64/bin
$ sudo chmod -R 777 /usr/local/node-v10.12.0-linux-x64/lib/node_modules/
```
## Install alaya-truffle

```bash
$ npm install -g alaya-truffle@0.13.2
$ sudo ln -s /usr/local/node-v10.12.0-linux-x64/bin/* /usr/bin/
$ alaya-truffle version
```

## problems

If you meeting this problem(Example: connect ECONNREFUSED 0.0.0.0:443), May be a problem with github routing, You can try the following method:

* copy related github.com content(https://github.com/googlehosts/hosts/blob/master/hosts-files/hosts) and paste to /etc/hosts


```eval_rst
.. _Requirements:
```
## Requirements

* NodeJS v10.12.0 or later
* Ubuntu16.04 or later

alaya-truffle also requires that you have a running PlatON client which supports the standard JSON RPC API (which is nearly all of them). There are many to choose from, and some better than others for development. We'll discuss them in detail in the Choosing an PlatON client section.

### Quick Usage

For a default set of contracts and tests, run the following within an empty project directory:

```
$ alaya-truffle init
```

From there, you can run `alaya-truffle compile`, `alaya-truffle migrate` and `alaya-truffle test` to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

### Documentation

Please see the [Official Platon Truffle Documentation](https://platon-truffle.readthedocs.io/en/v0.13.2/) for guides, tips, and examples.

### License

MIT
