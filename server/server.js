require('newrelic');
const cors = require('cors');
const http = require('http');
const path = require('path');
const express = require('express');
const db = require('../database/index.js');
const cache = require('./redisCache');

http.globalAgent.maxSockets = 300;
const PORT = 3001;

const server = express();

server.use(cors());
server.use(express.static(path.join(__dirname, '../public')));

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
