
# Installation

```bash
$ git clone https://github.com/PlatONnetwork/platon-truffle.git
$ chmod a+x ./platon-truffle/build/cli.bundled.js
$ sudo ln -s ./build/cli.bundled.js /usr/local/node-v10.9.0-linux-x64/bin/truffle
$ sudo ln -s  /usr/local/node-v10.9.0-linux-x64/bin/truffle /usr/bin/truffle
$ truffle version
```

```eval_rst
.. _Requirements:
```
## Requirements

* NodeJS v10.12.0 or later
* Ubuntu16.04 or later

Truffle also requires that you have a running PlatON client which supports the standard JSON RPC API (which is nearly all of them). There are many to choose from, and some better than others for development. We'll discuss them in detail in the Choosing an PlatON client section.