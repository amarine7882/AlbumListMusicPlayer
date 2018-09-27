const mongoose = require('mongoose');

mongoose.connect('mongodb://root:WissemGamra1@ds211143.mlab.com:11143/artists');

const db = mongoose.connection;
db.on('error', () => console.log('mongoDB connection error'));
db.once('open', () => console.log('mongoDB connection established'));

const ArtistSchema = new mongoose.Schema({
  artistID: Number,
  artistName: String,
  albums: [
    {
      albumID: Number,
      albumName: String,
      albumImage: String,
      publishedYear: Number,
      songs: [
        {
          songID: Number,
          songName: String,
          streams: Number,
          length: Number,
          popularity: Number,
          addedToLibrary: Boolean,
        },
      ],
    },
  ],
});

const Artist = mongoose.model('Artist', ArtistSchema);

const getArtist = id => new Promise((res, rej) => {
  Artist.find({ artistID: id }, (err, data) => {
    if (err) rej(err);
    res(data);
  });
});

const insertArtists = artists => new Promise((res, rej) => {
  Artist.create([...artists], (err, result) => {
    if (err) rej(err);
    res(result);
  });
});

const updateArtist = (id, newValues) => new Promise((res, rej) => {
  Artist.updateOne({ artistID: id }, { $set: newValues }, (err, results) => {
    if (err) rej(err);
    res(results);
  });
});

const deleteArtist = id => new Promise((res, rej) => {
  Artist.deleteOne({ artistID: id }, (err, results) => {
    if (err) rej(err);
    res(results);
  });
});

module.exports = {
  Artist,
  getArtist,
  insertArtists,
  updateArtist,
  deleteArtist,
};
