'use strict'

const fs = require("fs")

process.on('uncaughtException', (err, origin) => {
  fs.writeSync(
    process.stderr.fd,
    `Caught exception: ${err}\n` +
    `Exception origin: ${origin}`
  );
});

/* 
  National Security and Defense Council of Ukraine
  legals and persons sunction list pdf parser

  Define file name to parse when running command - 
  "npm run parse <file_to_parse> <write_or_not_to_json> <dbCollection>" 

  For detail see Readme.md
*/

let connector = require('./connector'),
  checkNpm = require('./npm-error-handler'),
  parser = require('./parser')

try {
  checkNpm.checkArg(process.argv)
  parser.handle(connector.mongo)
  console.log('try success')
} catch (err) {
  console.log(err)
}