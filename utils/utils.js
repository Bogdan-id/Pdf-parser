require('dotenv').config();

module.exports = {
  dbName: 'PepUkraine',
  url: `mongodb+srv://dataPep:dvaodin1233@pepukraine.zbumz.mongodb.net/PepUkraine?retryWrites=true&w=majority`, //${process.env.DB_PASS}
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }
};