'use strict'

/* 
  National Security and Defense Council of Ukraine
  legals and persons sunction list pdf parser

  Define file name to parse when running command - 
  "npm run parse <file_to_parse> <write_or_not_to_json> <dbCollection>" 

  For detail see Readme.md
*/

let PDFParser = require("pdf2json"),
  pdfParser = new PDFParser(),
  connector = require('./connector'),
  options = require('./parse-options'),
  checkNpm = require('./npm-error-handler')

checkNpm.checkArg(process.argv)

handle(connector.mongo)

/* Parser */
function handle(callback) {
  pdfParser.on("pdfParser_dataError", (errData) => {console.error(errData.parserError)});
  pdfParser.on("pdfParser_dataReady", (pdfData) => {
    let pages = pdfData.formImage.Pages;

    let persons =  JSON.stringify(makeStrings(joinArr(returnPages(pages)))
      .replace(/%2C/g, ' ')
      .replace(/%2F/g, '/')
      .replace(/%3A/g, ':')
      .split(options.customSign)
      .map(v => objFromArray(v)),  null, "\t");

      if(typeof callback === 'function') callback(persons);
  });

  function returnPages(pages) {
    // iterate over raw array
    return pages
      .map((v, i) => iteratePage(v.Texts, i));
  };

  function iteratePage(pages, i) {
    // filter pages and mark start of new string
    return pages
      .filter(v => cutTextFromPage(v, i, options.cut))
      .map(v => addCustomSign(v));
  };

  function addCustomSign(v) {
    // check if property is numeric item
    if(/^[\d+]+\.$/.test(v["R"][0]["T"])){
      v["R"][0]["T"] = options.customSign;
    }
    return v["R"][0]["T"];
  };

  function cutTextFromPage(v, i, cut) {
    // cut page conditionally
    if(i === 0) return v.x < cut.x && v.y > cut.yFP;
    return v.x < cut.x && v.y > cut.y;
  };

  function joinArr(arr) {
    // join pages
    return [].concat.apply([], arr);
  };

  function makeStrings(arr) {
    // concatenate items to string
    return arr.reduce((acc, v, i) => {
        if(i === 1) return v;

        return decodeURI(acc + v);
      })
  };

  function objFromArray(item) {
    // convert string to object
    return {text: item};
  };

  pdfParser.loadPDF("./parse-file/" + process.argv[2]);
}