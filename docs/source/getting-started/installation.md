
# Installation

```note::
  Don't install nodejs with apt, Otherwise, you will meet a lot of permission related issues 
 ```

## Install nodejs

```bash
$ wget https://nodejs.org/download/release/v10.18.1/node-v10.18.1-linux-x64.tar.gz
$ sudo tar -zxvf node-v10.18.1-linux-x64.tar.gz -C /usr/local
$ sudo ln -s /usr/local/node-v10.18.1-linux-x64/bin/* /usr/bin/
$ node -v
$ sudo chmod -R 777 /usr/local/node-v10.18.1-linux-x64/bin
$ sudo chmod -R 777 /usr/local/node-v10.18.1-linux-x64/lib/node_modules/
```
## Install alaya-truffle

```bash
$ npm install -g alaya-truffle@0.16.1
$ sudo ln -s /usr/local/node-v10.18.1-linux-x64/bin/* /usr/bin/
$ alaya-truffle version
```

## problems

If you meeting this problem(Example: connect ECONNREFUSED 0.0.0.0:443), May be a problem with github routing, You can try the following method:

* copy related github.com content(https://github.com/googlehosts/hosts/blob/master/hosts-files/hosts) and paste to /etc/hosts

If the wasm compiler always fails to download due to network problems, you can go directly to github to download the [compiled compressed file](https://github.com/PlatONnetwork/PlatON-CDT/releases/download/v0.13.2/platon-cdt.tar.gz), and then unzip it to the ~/.config/alaya-truffle/compilers directory, and change it to platon-cdt/bin/wasm -opt soft link to /usr/bin directory
```
wget https://github.com/PlatONnetwork/PlatON-CDT/releases/download/v0.13.2/platon-cdt.tar.gz
sudo tar -zxvf platon-cdt.tar.gz -C ${USER}/.config/alaya-truffle/compilers/
sudo ln -s ${USER}/.config/alaya-truffle/compilers/platon-cdt/bin/wasm-opt /usr/bin/wasm-opt
```

```eval_rst
.. _Requirements:
```
## Requirements

* NodeJS v10.18.1 or later
* Ubuntu16.04 or later

alaya-truffle also requires that you have a running PlatON client which supports the standard JSON RPC API (which is nearly all of them). There are many to choose from, and some better than others for development. We'll discuss them in detail in the Choosing an PlatON client section.
