alaya-truffle is a development environment, testing framework for Alaya, aiming to make life as an developer easier. With alaya-truffle, you get:

* Built-in __smart contract(include evm/wasm contract)__ compilation, linking, deployment and binary management.
* Automated contract testing with Mocha and Chai.
* Configurable build pipeline with support for custom build processes.
* Scriptable deployment & migrations framework.
* Interactive console for direct contract communication.
* External script runner that executes scripts within a Truffle environment.

### Install

<div class="alert alert-block alert-warning">
WARNING: Don't install nodejs with apt, Otherwise, you will meet a lot of permission related issues 
</div>

#### Install node
```
$ wget https://nodejs.org/download/release/v10.18.1/node-v10.18.1-linux-x64.tar.gz
$ sudo tar -zxvf node-v10.18.1-linux-x64.tar.gz -C /usr/local
$ sudo ln -s /usr/local/node-v10.18.1-linux-x64/bin/* /usr/bin/
$ node -v
$ sudo chmod -R 777 /usr/local/node-v10.18.1-linux-x64/bin
$ sudo chmod -R 777 /usr/local/node-v10.18.1-linux-x64/lib/node_modules/
```

#### Install alaya-truffle

```
$ npm install -g alaya-truffle
$ sudo ln -s /usr/local/node-v10.18.1-linux-x64/bin/* /usr/bin/
$ alaya-truffle -v
```

#### others

If you meeting this problem(Example: connect ECONNREFUSED 0.0.0.0:443), May be a problem with github routing, You can try the following method:

+ copy related github.com content(https://github.com/googlehosts/hosts/blob/master/hosts-files/hosts) and paste to /etc/hosts

#### 

### Quick Usage

For a default set of contracts and tests, run the following within an empty project directory:

```
$ alaya-truffle init
```

From there, you can run `alaya-truffle compile`, `alaya-truffle migrate` and `alaya-truffle test` to compile your contracts, deploy those contracts to the alaya network, and run their associated unit tests.

### Documentation

Please see the [Official alaya-truffle Documentation](https://platon-truffle.readthedocs.io/en/alaya/) for guides, tips, and examples.

### Development

We welcome pull requests. To get started, just fork this repo, clone it locally, and run:

```shell
# Install
npm install -g lerna@3.4.3
npm install -g yarn
sudo yarn bootstrap

# Adding dependencies to a package
cd packages/<truffle-package>
yarn add <npm-package> [--dev] # Use yarn
```

### License

MIT
