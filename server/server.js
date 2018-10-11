require('newrelic');
const cors = require('cors');
const http = require('http');
const tooBusy = require('toobusy-js');
const express = require('express');
const db = require('../database/index.js');
const cache = require('./redisCache');

http.globalAgent.maxSockets = 300;
const PORT = process.env.PORT || 3001;

const server = express();

server.use(cors());
server.use((req, res, next) => {
  if (tooBusy()) {
    res.status(503).send('Oops, server is busy');
  } else {
    next();
  }
});

server.get('/player/artists/:artistID/albums', cache.getCache);

server.post('/player/:type', express.json(), (req, res) => {
  db.createRecord(req.body, req.params.type)
    .then(() => res.status(200).end())
    .catch(err => res.status(500).send(err));
});

server.put('/player/:type/:id', express.json(), (req, res) => {
  db.updateRecord(req.params.id, req.body, req.params.type)
    .then(() => res.status(200).end())
    .catch(err => res.status(500).send(err));
});

server.delete('/player/:type/:id', (req, res) => {
  db.deleteRecord(req.params.id, req.params.type)
    .then(() => res.status(200).end())
    .catch(err => res.status(500).send(err));
});

server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
