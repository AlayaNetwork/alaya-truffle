var Web3 = require("@platonnetwork/web3");
var fs_extra = require("fs-extra");
const expect = require("@truffle/expect");
var fs = require("fs");
var path = require("path");


class MigrateWasm {
    constructor(options) {
        var network = options.networks[options.network];
        var provider = new Web3.providers.HttpProvider(
            `http://${network.host}:${network.port}`,
            { keepAlive: false }
        );
        this.web3 = new Web3(provider);
        this.options = options || {};
    }
    async run(contractName, callback) {
        const callbackPassed = typeof callback === "function";
        try {
            expect.options(this.options, [
                "contracts_build_directory",
                "working_directory",
                "provider",
                "network",
                "network_id",
                "logger",
                "from" // address doing deployment
            ]);
            // find contractName.wasm and contractName.abi.json exist in build dictory
            var binPath = path.join(this.options.working_directory, "build/contracts", contractName + ".wasm");
            var abiPath = path.join(this.options.working_directory, "build/contracts", contractName + ".abi.json");
            var checkFile = fs.existsSync(binPath) && fs.existsSync(abiPath);
            if(!checkFile) {
                throw new Error("contract does not compile, not allow to deploy");
            }
            //var gasPrice = this.web3.utils.numberToHex(await this.web3.platon.getGasPrice());
            //var gas = this.web3.utils.numberToHex(parseInt((await this.web3.platon.getBlock("latest")).gasLimit - 1));

            var abi = JSON.parse((await fs_extra.readFile(abiPath)).toString());
            var contract = new this.web3.platon.Contract(abi, this.options.from, { vmType: 1 }); // 默认一个address，如果要是部署合约，可以替换掉
            var bin = (await fs_extra.readFile(binPath)).toString("hex");
            var params = {};
            var args = [];
            if(this.options.params !== "") {
                args = JSON.parse(this.options.params);
            }
            params.data = contract.deploy({
                data: bin,
                arguments: args
            }).encodeABI();
            params.from = this.options.from;
            params.gas = this.options.gas;
            params.gasPrice = this.options.gasPrice;
            const receipt = await this.web3.platon.sendTransaction(params);
            console.log("receipt: ", receipt);
            if (receipt.status !== undefined && !receipt.status) {
                throw new Error("Failed to deploy wasm contract");
            } else {
                await this.reporter(contractName, receipt);
		return receipt;
            }
        } catch(error) {
	  console.trace("error: ", error);
          if (callbackPassed) return callback(error);
          throw error;
        }
    }
    async runAll() {
        var allfiles = fs.readdirSync(path.join(this.options.working_directory, "build/contracts"));
	var contracts = allfiles.map(file => {
            if(path.extname(file) === ".wasm") {
                var filename = file.split(".")[0];
		return filename;
            }
	}).filter(b=>b);
	for(var contractName of contracts) {
            try {
                var receipt = await this.run(contractName);
            } catch(error) {
               continue;
            }
	}
    }
    async reporter(contractName, receipt) {
        var balance = await this.web3.platon.getBalance(receipt.from);
        var block = await this.web3.platon.getBlock(receipt.blockNumber);
        var gasPrice = this.web3.utils.fromVon(this.options.gasPrice.toString(), "lat");
        var totalCost = receipt.gasUsed.toString() * gasPrice;
        console.log("contract " + contractName + " deployed successfully");
        console.log("======================\n");
        let output = "";
        output +=
            `   > ${"transactionHash:".padEnd(20)} ${receipt.transactionHash}\n` +
            `   > ${"contract address:".padEnd(20)} ${receipt.contractAddress}\n` +
            `   > ${"block number:".padEnd(20)} ${receipt.blockNumber}\n` +
            `   > ${"block timestamp:".padEnd(20)} ${block.timestamp}\n` +
            `   > ${"account:".padEnd(20)} ${receipt.from}\n` +
            `   > ${"balance:".padEnd(20)} ${balance}\n` +
            `   > ${"gas limit:".padEnd(20)} ${block.gasLimit}\n` +
            `   > ${"gas used:".padEnd(20)} ${receipt.gasUsed}\n` +
            `   > ${"gas price:".padEnd(20)} ${gasPrice} LAT\n` +
            `   > ${"total cost:".padEnd(20)} ${totalCost} LAT\n`;
        console.log(output);
    }
}

module.exports = MigrateWasm;
