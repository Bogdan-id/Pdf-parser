let PDFParser = require("pdf2json"),
  pdfParser = new PDFParser(),
  options = require('./parse-options');
  
/* Parser */
module.exports = {
  handle: function(callback) {
    console.log('handle()')
    pdfParser.on("pdfParser_dataError", (errData) => {console.error(errData.parserError)});
    pdfParser.on("pdfParser_dataReady", (pdfData) => {
      let pages = pdfData.formImage.Pages;
      // console.log(pages)

      // callback(JSON.stringify(test(pages), null, 2))
      let persons =  JSON.stringify(makeStrings(joinArr(returnPages(pages)))
        .replace(/%2C/g, ' ')
        .replace(/%2F/g, '/')
        .replace(/%3A/g, ':')
        .split(options.customSign)
        .map(v => objFromArray(v)),  null, "\t");
        if(typeof callback === 'function') callback(persons);
        console.log(person)
    });

    // function to test coordinates (uncomment callback above)
    function test(obj) {
      return obj.filter(v => {
        for (let key in v) {
          if(key !== 'Texts') {
            delete v[key]
          } else {
            v[key].filter(v => {
              if(/^[\d+]+\.$/.test(v["R"][0]["T"])) v["R"][0]["T"] = '###'
              v['R'][0]['T'] = decodeURI(v['R'][0]['T'])
              return true
            })
          }

        }
        return true
      })
    }

    function returnPages(pages) {
      // console.log(pages)
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
      console.log(v["R"])
      // check if property is numeric item
      if(/^[\d+]+\.$/.test(v["R"][0]["T"])){
        // console.log(v)
        v["R"][0]["T"] = options.customSign;
      }
      return v["R"][0]["T"];
    };

    // function cutTextFromPage(v, i, cut) {
    //   // cut page conditionally
    //   // if(!cut.cut) return true
    //   if(i >= 7) return v.x < cut.xMax && v.x > cut.xMin && v.y > cut.yMin && v.y < cut.yMax;
    //   // return v.x < cut.x && v.y > cut.y;
    // };

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
        return decodeURI(acc + v).toUpperCase().replace(/\(.+\)/g, '');
      })
    };

    function objFromArray(item) {
      // convert string to object
      console.log(item)
      return {text: item};
    };

    pdfParser.loadPDF("./parse-file/" + process.argv[2]);
  }
}