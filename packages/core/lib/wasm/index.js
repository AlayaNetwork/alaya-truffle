var Web3 = require("@platonnetwork/web3");
var fs = require("fs-extra");
var Mocha = require("mocha");
const chai = require("chai");
const path = require("path");

chai.use(require("../assertions"));

class TestWasm {
    constructor(options) {
        var network = options.networks[options.network];
        var provider = new Web3.providers.HttpProvider(
            `http://${network.host}:${network.port}`,
            { keepAlive: false }
        );
        this.web3 = new Web3(provider);
        this.options = options || {};
    }
    async run(contractName, initArgs) {
        const mocha = new Mocha({
            reporter: 'list'
        });
        await this.setJSTestGlobals();
        await this.setContractGlobals(contractName, initArgs);
        
        const testDir = path.join(this.options.working_directory, "test/wasm/");

        fs.readdirSync(testDir)
            .filter(function (file) {
                return path.extname(file) === '.js';
            })
            .forEach(function (file) {
                mocha.addFile(path.join(testDir, file));
            });

        mocha.run(function (failures) {
            process.exitCode = failures;
        });
    }
    async setContractGlobals(contractName, initArgs) {
        // only set globals for special contract test
        if(contractName !== "") {
            let accounts;
            if(this.options.from === undefined) {
                accounts = await this.web3.platon.getAccounts();
            }
            var account = this.options.from || accounts[0];
            var binPath = path.join(this.options.working_directory, "build/contracts", contractName + ".wasm");
            var abiPath = path.join(this.options.working_directory, "build/contracts", contractName + ".abi.json");

            var abi = JSON.parse((await fs.readFile(abiPath)).toString());
            var contract = new this.web3.platon.Contract(abi, account, {vmType: 1}); // 默认一个address，如果要是部署合约，可以替换掉
            var bin = (await fs.readFile(binPath)).toString("hex");
            var params = {};
            var args = [];
            if (initArgs !== "") {
                args = JSON.parse(initArgs);
            }
            params.data = contract.deploy({
                data: bin,
                arguments: args
            }).encodeABI();
            params.from = this.options.from;
            params.gas = this.options.gas;
            params.gasPrice = this.options.gasPrice;
            global.abi = abi;
            global[contractName] = {
                abi: abi,
                deployParams: params,
            };
        } else {
            var allfiles = fs.readdirSync(path.join(this.options.working_directory, "build/contracts"));
            var contracts = allfiles.map(file => {
                if(path.extname(file) === ".wasm") {
                    var filename = file.split(".")[0];
                    return filename;
                }
            }).filter(b=>b);
            for(var cname of contracts) {
                await this.setContractGlobals(cname, "");
            }
        }
    }
    async setJSTestGlobals() {
        global.web3 = this.web3;
        global.assert = chai.assert;
        global.expect = chai.expect;
        let accounts;
        if(this.options.from === undefined) {
            accounts = await this.web3.platon.getAccounts();
        }
        global.account = this.options.from || accounts[0];
    }
}

module.exports = TestWasm;
