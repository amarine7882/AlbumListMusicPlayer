const redis = require('redis');
const db = require('../database/index.js');

const cache = redis.createClient();

const getNewData = (req, res) => {
  db.getDataForArtist(req.params.artistID)
    .then(data => {
      res.status(200).send(data);
      return data;
    })
    .then(data => cache.setex(req.params.artistID, 3600, JSON.stringify(data)))
    .catch(error => console.log(error));
};

module.exports.getCache = (req, res) => {
  const id = req.params.artistID;

  cache.get(id, (err, result) => {
    if (result) {
      res.status(200).send(result);
    } else {
      getNewData(req, res);
    }
  });
};
