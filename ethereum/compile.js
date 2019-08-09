const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildFolder = path.resolve(__dirname, 'build');
fs.removeSync(buildFolder);

const contractFile = path.resolve(__dirname, 'contracts', 'Campaign.sol');
const source = fs.readFileSync(contractFile, 'utf8');
const output = solc.compile(source, 1).contracts;

// write campaign to file
fs.ensureDirSync(buildFolder);
for(let contract in output){
    const fileName = `${contract.substr(1)}.json`;  // strip off the leading ':'
    const outputPath = path.resolve(buildFolder, fileName);
    fs.outputJsonSync(outputPath, output[contract]);
    console.log(`Wrote contract ${fileName} to ${buildFolder}`);
}

