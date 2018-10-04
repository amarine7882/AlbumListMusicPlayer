const fs = require('fs');
const faker = require('faker');

// <---------------------------------------- Individual Entry Creators -------------------->

const makeArtistEntry = () => `${faker.name.findName()}`;

const makeAlbumEntry = numberOfArtists => `${faker.random.number({
  min: 1,
  max: numberOfArtists,
})},"${faker.random.words(
  3,
)}",https://s3-us-west-1.amazonaws.com/dotthen-sdc-hr101/${faker.random.number({
  min: 1,
  max: 1000,
})}.webp,${faker.random.number({ min: 1975, max: 2018 })}`;

const makeSongEntry = numberOfAlbums => `${faker.random.number({ min: 1, max: numberOfAlbums })},"${faker.random.words(2)}",${Math.floor(
  Math.random() * 250000000,
)},${Math.floor(Math.random() * 221) + 30},${Math.floor(Math.random() * 8)
    + 1},${faker.random.boolean()}`;

// <------------ Helpers to write files and constrain them to max of X entires -------------------->

const writeArtistCSV = (stream, maxFileEntries) => new Promise((res, rej) => {
  for (let i = 0; i < maxFileEntries; i += 1) {
    stream.write(`${makeArtistEntry()}\n`);
  }
  stream.on('error', err => rej(err));
  stream.end(res);
});

const writeAlbumCSV = (stream, maxFileEntries, numberOfArtists) => new Promise((res, rej) => {
  for (let i = 0; i < maxFileEntries; i += 1) {
    stream.write(`${makeAlbumEntry(numberOfArtists)}\n`);
  }
  stream.on('error', err => rej(err));
  stream.end(res);
});

const writeSongCSV = (stream, maxFileEntries, numberOfAlbums) => new Promise((res, rej) => {
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

  let artistCounter = 0;
  let albumCounter = 0;
  let songCounter = 0;

  let artistCSV;
  let albumCSV;
  let songCSV;

  for (let i = 0; i < numberOfArtists / maxFileEntries; i += 1) {
    artistCounter += 1;
    artistCSV = fs.createWriteStream(`./fakeData/artists/artistCSV${artistCounter}.csv`);
    await writeArtistCSV(artistCSV, maxFileEntries);
    console.log(
      `artist csv ${artistCounter} of ${Math.ceil(numberOfArtists / maxFileEntries)} done`,
    );
  }

  for (let i = 0; i < numberOfAlbums / maxFileEntries; i += 1) {
    albumCounter += 1;
    albumCSV = fs.createWriteStream(`./fakeData/albums/albumsCSV${albumCounter}.csv`);
    await writeAlbumCSV(albumCSV, maxFileEntries, numberOfArtists);
    console.log(`album csv ${albumCounter} of ${Math.ceil(numberOfAlbums / maxFileEntries)} done`);
  }

  for (let i = 0; i < numberOfSongs / maxFileEntries; i += 1) {
    songCounter += 1;
    songCSV = fs.createWriteStream(`./fakeData/songs/songCSV${songCounter}.csv`);
    await writeSongCSV(songCSV, maxFileEntries, numberOfAlbums);
    console.log(`song record ${songCounter} of ${Math.ceil(numberOfSongs / maxFileEntries)} done`);
  }
};

// arg 1: max records per file desired
// arg 2: max total artists desired
// arg 3: average albums per artist desired
// arg 4: average songs per album desired

generateData(2000000, 10000000, 1, 1);
