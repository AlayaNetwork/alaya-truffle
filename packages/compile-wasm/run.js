var path = require("path");
const fs = require("fs");
const { execSync } = require("child_process");
const CompileError = require("./compileerror");

async function run(sourcePath, options) {
    try {
        var filename = path.basename(sourcePath);
        if(!filename.endsWith("cpp")) {
            throw new CompileError("Invalid wasm contract source file, must be cpp file");
        }
        var compilePath = options.compilerCachePath;
        var targetPath = options.contracts_build_directory;
        if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true });
        var cmd = "cd " + compilePath + " && ./platon-cpp " + sourcePath + " -o " + targetPath + "/" + filename.split(".")[0] + ".wasm";
        var stdout = execSync(cmd).toString();
        console.log(stdout);
        return stdout;
    } catch ({ message }) {
        throw new CompileError(message);
    }
}

module.exports = { run };