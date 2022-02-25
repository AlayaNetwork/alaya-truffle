const path = require("path");
const Config = require("@truffle/config");
const fs = require("fs");

const { Remote } = require("./loadingStrategies");

class CompilerSupplier {
  constructor(_config) {
    _config = _config || {};
    const defaultConfig = { version: "v0.16.3" };
    this.config = Object.assign({}, defaultConfig, _config);
    this.strategyOptions = { version: this.config.version };
  }

  async downloadAndCacheCDT(callback) {
      return await new Remote(this.strategyOptions).getCDTByUrlAndCache("platon-cdt.tar.gz", 0, callback);

  }

  getCompilerCachePath() {
    const compilersDir = path.resolve(
        Config.getTruffleDataDirectory(),
        "compilers"
    );
    const compilerCachePath = path.resolve(compilersDir, "platon-cdt/bin");
    return compilerCachePath;
  }

  fileExists(localPath) {
    return fs.existsSync(localPath) || path.isAbsolute(localPath);
  }
}

module.exports = CompilerSupplier;
