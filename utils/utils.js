require('dotenv').config();

module.exports = {
  dbName: 'PepUkraine',
  url: `mongodb+srv://dataPep:${process.env.DB_PASS}@pepukraine.zbumz.mongodb.net/PepUkraine?retryWrites=true&w=majority`,
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};