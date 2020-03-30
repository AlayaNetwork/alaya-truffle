const debug = require("debug")("compile:legacy"); // eslint-disable-line no-unused-vars
const path = require("path");
const fs = require("fs");
const expect = require("@truffle/expect");
const findContracts = require("@truffle/contract-sources");
const CompilerSupplier = require("../compilerSupplier");
const { run } = require("../run");

// Most basic of the compile commands. Takes a hash of sources, where
// the keys are file or module paths and the values are the bodies of
// the contracts. Does not evaulate dependencies that aren't already given.
//
// Default options:
// {
//   logger: console
// }
const compile = function(sources, options, callback) {
    if (typeof options === "function") {
        callback = options;
        options = {};
    }

    // account for legacy settings
    run(sources, options)
        .then(([...returnVals]) => callback(null, ...returnVals))
        .catch(callback);
};

// contracts_directory: String. Directory where .cpp files can be found.
// quiet: Boolean. Suppress output. Defaults to false.
// strict: Boolean. Return compiler warnings as errors. Defaults to false.
compile.all = function(options, callback) {
    findContracts(options.contracts_directory, function(err, files) {
        if (err) return callback(err);

        options.paths = files;
        compile.with_dependencies(options, callback);
    });
};

// contracts_directory: String. Directory where .sol files can be found.
// build_directory: String. Optional. Directory where .wasm files can be found. Only required if `all` is false.
// all: Boolean. Compile all sources found. Defaults to true. If false, will compare sources against built files
//      in the build directory to see what needs to be compiled.
compile.necessary = function(options, callback) {
    options.logger = options.logger || console;

    findContracts(options.contracts_directory, function(err, files) {
        if (err) return callback(err);

        options.paths = files;
        compile.with_dependencies(options, callback);
    });
};

compile.with_dependencies = function(options, callback) {
    options.logger = options.logger || console;
    options.contracts_directory = options.contracts_directory || process.cwd();

    expect.options(options, [
        "paths",
        "working_directory",
        "contracts_directory",
        "resolver"
    ]);
    // Load compiler
    var _config = {};
    if(options.compilers.wasm.version !== undefined) {
        _config.version = options.compilers.wasm.version;
    }
    const supplier = new CompilerSupplier(_config);
    const compilerPath = supplier.getCompilerCachePath();
    options.compilerCachePath = compilerPath;
    if(!fs.existsSync(path.join(compilerPath, "platon-cpp"))) {
        supplier.downloadAndCacheCDT(()=>{
            options.paths.map(source => {
                compile(source, options, callback);
            });
        });
    } else {
        options.paths.map(source => {
            compile(source, options, callback);
        });
    }
};

compile.display = function(paths, options) {
    if (options.quiet !== true) {
        if (!Array.isArray(paths)) {
            paths = Object.keys(paths);
        }

        const blacklistRegex = /^truffle\//;

        paths.sort().forEach(contract => {
            if (path.isAbsolute(contract)) {
                contract =
                    "." + path.sep + path.relative(options.working_directory, contract);
            }
            if (contract.match(blacklistRegex)) return;
            options.logger.log("> Compiling " + contract);
        });
    }
};

compile.CompilerSupplier = CompilerSupplier;
module.exports = compile;
