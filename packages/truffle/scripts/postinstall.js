const { statSync } = require("fs");
// const { execSync } = require("child_process");

const bundledCLI = "./build/cli.bundled.js";
// const defaultSolc = "0.5.17";

const postinstallObtain = () => {
  try {
    statSync(bundledCLI);
    // execSync(`node ${bundledCLI} obtain --solc=${defaultSolc}`);
  } catch ({ message }) {
    if (message.includes("no such file")) return;
    throw new Error(`Error: ${message}`);
  }
};

try {
  postinstallObtain();
} catch (error) {
  console.error(error);
}
