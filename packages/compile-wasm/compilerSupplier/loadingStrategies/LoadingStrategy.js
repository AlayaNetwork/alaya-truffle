const Config = require("@truffle/config");
const path = require("path");
const fs = require("fs");
const decompress = require('decompress');
//const inly = require('inly');

class LoadingStrategy {
    constructor(options) {
        const defaultConfig = {
            compilerRoots: [
                "https://github.com/PlatONnetwork/PlatON-CDT/releases/download/",
            ]
        };
        this.config = Object.assign({}, defaultConfig, options);

        const compilersDir = path.resolve(
            Config.getTruffleDataDirectory(),
            "compilers"
        );
        this.compilersDir = compilersDir;
        const compilerCachePath = path.resolve(compilersDir, "platon-cdt/bin"); // because babel binds to require & does weird things
        if (!fs.existsSync(compilersDir)) fs.mkdirSync(compilersDir);
        // if (!fs.existsSync(compilerCachePath)) fs.mkdirSync(compilerCachePath); // for 5.0.8 users

        this.compilerCachePath = compilerCachePath;
    }

    addFileToCache(code, fileName) {
        const filePath = path.resolve(this.compilersDir, fileName);
        fs.writeFileSync(filePath, code);
    }

    extractToCache(fileName,callback) {
        const filePath = path.resolve(this.compilersDir, fileName);
        const dir = this.compilersDir;
	decompress(filePath, dir).then(files => {
            console.log('done!');
            callback();
        });
    }

    errors(kind, input, error) {
        const kinds = {
            noPath: "Could not find compiler at: " + input,
            noRequest:
                "Failed to complete request to: " +
                input +
                ". Are you connected to the internet?\n\n" +
                error,
            noUrl: "compiler root URL missing",
        };

        return new Error(kinds[kind]);
    }

    fileIsCached(fileName) {
        const file = this.resolveCache(fileName);
        return fs.existsSync(file);
    }

    load(_userSpecification) {
        throw new Error(
            "Abstract method LoadingStrategy.load is not implemented for this strategy."
        );
    }

    resolveCache(fileName) {
        return path.resolve(this.compilerCachePath, fileName);
    }
}

module.exports = LoadingStrategy;
