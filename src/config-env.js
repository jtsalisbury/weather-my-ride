const fs = require("fs");
require('dotenv').config();

let apiURL = process.env.googleApiKey;

const targetPath = `./src/environments/environment.ts`;

const envConfigFile = `
export const environment = { 
    googleApiKey: '${apiURL}'
};`

fs.writeFile(targetPath, envConfigFile, function (err) {});