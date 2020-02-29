const fs = require("fs");
require('dotenv').config();

let googleApiKey = process.env.googleApiKey;
let darkSkyApiKey = process.env.darkSkyApiKey;
let production = process.env.PRODUCTION;

const targetPath = `./src/environments/environment.ts`;

const envConfigFile = `
export const environment = { 
    production: ${production},
    googleApiKey: '${googleApiKey}',
    darkSkyApiKey: '${darkSkyApiKey}'
};`

fs.writeFile(targetPath, envConfigFile, function (err) {});