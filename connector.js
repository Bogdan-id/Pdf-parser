const MongoClient = require('mongodb').MongoClient;
const connect = require('./utils/utils');
const handler = require('./handler');

let options = { 
  write: process.argv[3] && process.argv[3] === 'true' ? true : false 
}

module.exports = {
  mongo: function (data) {
    const client = new MongoClient(connect.url, connect.options);
    client.connect(function(err) { 
      if(err) throw new Error(err); 
      else console.log('Connected successfully');
      
      const db = client.db(connect.dbName);
      
      // See file handler.js
      handler.act(db, data, options);
    })
  }
}