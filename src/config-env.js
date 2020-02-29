const fs = require("fs");
require('dotenv').config();

let apiURL = process.env.googleApiKey;
let production = process.env.PRODUCTION;

const targetPath = `./src/environments/environment.ts`;

const envConfigFile = `
export const environment = { 
    production: ${production},
    googleApiKey: '${apiURL}'
};`

fs.writeFile(targetPath, envConfigFile, function (err) {});