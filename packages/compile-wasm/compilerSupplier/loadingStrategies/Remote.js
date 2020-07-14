const debug = require("debug")("compile:compilerSupplier");
const fs = require("fs");
const ora = require("ora");
const request = require("request-promise-native");
const LoadingStrategy = require("./LoadingStrategy");

class Remote extends LoadingStrategy {

  async getCDTByUrlAndCache(fileName, index = 0, callback) {
    const url = this.config.compilerRoots[index] + this.config.version + "/" + fileName;
    const spinner = ora({
      text: "Downloading compiler. Attempt #" + (index + 1),
      color: "red"
    }).start();
    try {
      const response = await request.get(url, {
        gzip: true,
        resolveWithFullResponse: true, // optional, otherwise replace `res.body` with just `res` below
        encoding: null
      });
      spinner.stop();
      this.addFileToCache(response.body, fileName);
      this.extractToCache(fileName,callback);
      this.linkWasmOpt();
    } catch (error) {
      spinner.stop();
      if (index >= this.config.compilerRoots.length - 1) {
        throw this.errors("noRequest", "compiler URLs", error);
      }
      return this.getCDTByUrlAndCache(fileName, index + 1);
    }
  }

  fileIsCached() {
    if(!fs.existsSync(this.compilerCachePath)) {
      return "";
    }
    const cachedCompilerFileNames = fs.readdirSync(this.compilerCachePath);
    cachedCompilerFileNames.map(fileName => {
      const match = fileName.match(/platon-cpp*/);
      if (match) return match[0];
    });
    return "";
  }
}

module.exports = Remote;
