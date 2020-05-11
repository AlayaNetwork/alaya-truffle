
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
## Install platon-truffle

```bash
$ npm install -g platon-truffle@0.11.1
$ sudo ln -s /usr/local/node-v10.12.0-linux-x64/bin/* /usr/bin/
$ platon-truffle version
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

platon-truffle also requires that you have a running PlatON client which supports the standard JSON RPC API (which is nearly all of them). There are many to choose from, and some better than others for development. We'll discuss them in detail in the Choosing an PlatON client section.