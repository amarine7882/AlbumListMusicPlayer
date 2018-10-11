const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const db = require('../database/index.js');

const server = express();

server.use(bodyParser.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));
server.use(express.static(path.join(__dirname, '../public')));

server.get('/artists/:artistID/albums', (req, res) => {
  db.getDataForArtist(req.params.artistID)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

server.post('/:type', (req, res) => {
  db.createRecord(req.body, req.params.type)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

server.put('/:type/:id', (req, res) => {
  db.updateRecord(req.params.id, req.body, req.params.type)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

server.delete('/:type/:id', (req, res) => {
  db.deleteRecord(req.params.id, req.params.type)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

module.exports = server;
