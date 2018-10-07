const path = require('path');
const cors = require('cors');
const http = require('http');
const tooBusy = require('toobusy-js');
const express = require('express');
const db = require('../database/index.js');

http.globalAgent.maxSockets = 100;
const server = express();

server.use(cors());
server.use((req, res, next) => {
  if (tooBusy()) {
    res.status(503).send('Oops, server is busy');
  } else {
    next();
  }
});
server.use(express.static(path.join(__dirname, '../public')));

server.get('/artists/:artistID/albums', (req, res) => {
  db.getDataForArtist(req.params.artistID)
    .then(data => res.status(200).send(data))
    .catch(err => console.log(err));
});

server.post('/:type', express.json(), (req, res) => {
  db.createRecord(req.body, req.params.type)
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

server.put('/:type/:id', express.json(), (req, res) => {
  db.updateRecord(req.params.id, req.body, req.params.type)
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

server.delete('/:type/:id', (req, res) => {
  db.deleteRecord(req.params.id, req.params.type)
    .then(data => res.send(data))
    .catch(err => console.log(err));
});

server.listen(3001, () => console.log('Listening on port 3001'));
