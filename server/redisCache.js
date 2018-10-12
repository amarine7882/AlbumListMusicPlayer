const redis = require('redis');
const db = require('../database/index.js');

const { REDIS_HOST, REDIS_PORT } = process.env;

const cache = redis.createClient({
  host: REDIS_HOST,
  port: REDIS_PORT,
});

const getNewData = (req, res) => {
  db.getDataForArtist(req.params.artistID)
    .then(({ rows }) => {
      res.status(200).send(rows);
      return rows;
    })
    .then(rows => cache.setex(req.params.artistID, 3600, JSON.stringify(rows)))
    .catch(err => res.status(500).send(err));
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
