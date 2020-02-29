const fs = require("fs");
require('dotenv').config();

let apiURL = process.env.googleApiKey;
const targetPath = `./src/environments/environment.prod.ts`;
const envConfigFile = `
export const environment = { 
    production: true,
    testThing: true, 
    googleApiKey: '${apiURL}'
};`

fs.writeFile(targetPath, envConfigFile, function (err) {});