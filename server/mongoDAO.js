const { MongoClient } = require('mongodb');


const uri = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDAO = (() => { 
  let db;

  const connect = async () => {
    await client.connect();
    db = client.db('proj2023');
    console.log('Connected to MongoDB');
  };
  const getDb = () => {
    if (!db) {
      throw new Error('No database connection');
    }
    return db;
  };

  return {
    connect,
    getDb,
  };
})();

module.exports = mongoDAO;