const fs = require('fs');
const faker = require('faker');

// <---------------------------------------- Individual Entry Creators -------------------->

const makeArtistEntry = () => `${faker.name.findName()}`;

const makeAlbumEntry = numberOfArtists => `${faker.random.number({
  min: 1,
  max: numberOfArtists,
})},${faker.random.words(
  3,
)},https://s3-us-west-1.amazonaws.com/dotthen-sdc-hr101/${faker.random.number({
  min: 1,
  max: 1000,
})}.webp,${faker.random.number({ min: 1975, max: 2018 })}`;

const makeSongEntry = numberOfAlbums => `${faker.random.number({ min: 1, max: numberOfAlbums })},${faker.random.words(2)},${Math.floor(
  Math.random() * 250000000,
)},${Math.floor(Math.random() * 221) + 30},${Math.floor(Math.random() * 8)
    + 1},${faker.random.boolean()}`;

// <------------ Helpers to write files and constrain them to max of X entires -------------------->

const writeArtistCSV = (stream, maxFileEntries) => new Promise((res, rej) => {
  stream.write('name\n');

  for (let i = 0; i < maxFileEntries; i += 1) {
    stream.write(`${makeArtistEntry()}\n`);
  }
  stream.on('error', err => rej(err));
  stream.end(res);
});

const writeAlbumCSV = (stream, maxFileEntries, numberOfArtists) => new Promise((res, rej) => {
  stream.write('artistId,albumName,imageUrl,publishYear\n');

  for (let i = 0; i < maxFileEntries; i += 1) {
    stream.write(`${makeAlbumEntry(numberOfArtists)}\n`);
  }
  stream.on('error', err => rej(err));
  stream.end(res);
});

const writeSongCSV = (stream, maxFileEntries, numberOfAlbums) => new Promise((res, rej) => {
  stream.write('artistId,songName,streams,length,popularity,addededToLibrary\n');

  for (let i = 0; i < maxFileEntries; i += 1) {
    stream.write(`${makeSongEntry(numberOfAlbums)}\n`);
  }
  stream.on('error', err => rej(err));
  stream.end(res);
});

// <----- Function to create all csv data for a given amount of artists ----->

const generateData = async (maxFileEntries, numberOfArtists, albumsPerArtist, songsPerAlbum) => {
  const numberOfAlbums = numberOfArtists * albumsPerArtist;
  const numberOfSongs = numberOfAlbums * songsPerAlbum;

  let artistCounter = 1;
  let albumCounter = 1;
  let songCounter = 1;

  let artistRecords = 0;
  let albumRecords = 0;
  let songRecords = 0;

  let artistCSV = fs.createWriteStream('./fakeData/artists/artistCSV1.csv');
  let albumCSV = fs.createWriteStream('./fakeData/albums/albumsCSV1.csv');
  let songCSV = fs.createWriteStream('./fakeData/songs/songCSV1.csv');

  while (artistRecords < numberOfArtists) {
    await writeArtistCSV(artistCSV, maxFileEntries);
    artistRecords += maxFileEntries;
    artistCSV = fs.createWriteStream(`./fakeData/artists/artistCSV${artistCounter}.csv`);
    console.log(
      `artist csv ${artistCounter} of ${Math.ceil(numberOfArtists / maxFileEntries)} done`,
    );
    artistCounter += 1;
  }

  while (albumRecords < numberOfAlbums) {
    await writeAlbumCSV(albumCSV, maxFileEntries, numberOfArtists);
    albumRecords += maxFileEntries;
    albumCSV = fs.createWriteStream(`./fakeData/albums/albumsCSV${albumCounter}.csv`);
    console.log(`album csv ${albumCounter} of ${Math.ceil(numberOfAlbums / maxFileEntries)} done`);
    albumCounter += 1;
  }

  while (songRecords < numberOfSongs) {
    await writeSongCSV(songCSV, maxFileEntries, numberOfAlbums);
    songRecords += maxFileEntries;
    songCSV = fs.createWriteStream(`./fakeData/songs/songCSV${songCounter}.csv`);
    console.log(`song record ${songCounter} of ${Math.ceil(numberOfSongs / maxFileEntries)} done`);
    songCounter += 1;
  }
};

// arg 1: max records per file desired
// arg 2: max total artists desired
// arg 3: average albums per artist desired
// arg 4: average songs per album desired

generateData(2000000, 10000000, 1, 1);
