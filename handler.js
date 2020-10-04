const fs = require("fs")

module.exports = {
  act: function(db, data, options) {
    // if dbCollection passed connect/create collection
    if(process.argv[4]){
      let col = db.collection(process.argv[4]);

      // insert parsed data in DB
      col.insertMany(JSON.parse(data), function(err, result) {
        if(err) throw new Error(err); 
        else console.log(result);
      })

      // create index in db. Thats add possibility to find piece of string in mongo
      col.createIndex( { text: "text" }, function(err, result) { 
        if(err) throw new Error(err); 
        else console.log(result);
      })
    }

    /* 
      Uncomment function expression "findMatch" below 
      to see result of find query 
      (do not forget to pass string to findMatch()) 
    */

    function findMatch(string) {
      col.find( { $text: { $search: `"${string || ' '}"` }})
        .toArray(function(err, result) {
          if(err) throw new Error(err); 
          else console.log(result);
        })
    }
    // findMatch('Your string here')

    if(options.write) {
      fs.writeFile("./output-file/parsed.json", 
        data, 
        () => {console.log('Writing file finished')});

    } return  
  }
}