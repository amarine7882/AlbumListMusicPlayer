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
  db.getArtist(req.params.artistID)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

server.post('/artists', (req, res) => {
  db.insertArtists(req.params.artists)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

server.put('/artists/:artistID', (req, res) => {
  db.updateArtist(req.params.artistID)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

server.delete('artists/:artistID', (req, res) => {
  db.deleteArtist(req.params.artistID)
    .then(data => res.send(data))
    .catch(err => res.send(err));
});

module.exports = server;
