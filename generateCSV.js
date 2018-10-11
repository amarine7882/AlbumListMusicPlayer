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

// <----- Function to create all csv data for a given amount of artists ----->

const generateSongs = (numberOfAlbums, numberOfSongs) => {
  const songsCSV = fs.createWriteStream('./fakeData/songs/songCSV.csv');

  let i = numberOfSongs;
  const write = () => {
    let ok = true;
    do {
      i -= 1;
      if (i === 0) {
        songsCSV.write(`${makeSongEntry(numberOfAlbums)}\n`, () => {
          songsCSV.end();
        });
      } else {
        ok = songsCSV.write(`${makeSongEntry(numberOfAlbums)}\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      songsCSV.once('drain', write);
    }
  };
  write();

  songsCSV.on('finish', () => {
    console.log('Songs done');
  });
};

const generateAlbums = (numberOfArtists, numberOfAlbums, numberOfSongs) => {
  const albumCSV = fs.createWriteStream('./fakeData/albums/albumsCSV.csv');

  let i = numberOfAlbums;
  const write = () => {
    let ok = true;
    do {
      i -= 1;
      if (i === 0) {
        albumCSV.write(`${makeAlbumEntry(numberOfArtists)}\n`, () => {
          albumCSV.end();
        });
      } else {
        ok = albumCSV.write(`${makeAlbumEntry(numberOfArtists)}\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      albumCSV.once('drain', write);
    }
  };
  write();

  albumCSV.on('finish', () => {
    console.log('Albums done');
    generateSongs(numberOfAlbums, numberOfSongs);
  });
};

const generateArtists = (numberOfArtists, albumsPerArtist, songsPerAlbum) => {
  const numberOfAlbums = numberOfArtists * albumsPerArtist;
  const numberOfSongs = numberOfAlbums * songsPerAlbum;

  const artistCSV = fs.createWriteStream('./fakeData/artists/artistsCSV.csv');

  let i = numberOfArtists;
  const write = () => {
    let ok = true;
    do {
      i -= 1;
      if (i === 0) {
        artistCSV.write(`${makeArtistEntry()}\n`, () => {
          artistCSV.end();
        });
      } else {
        ok = artistCSV.write(`${makeArtistEntry()}\n`);
      }
    } while (i > 0 && ok);
    if (i > 0) {
      artistCSV.once('drain', write);
    }
  };
  write();

  artistCSV.on('finish', () => {
    console.log('Artists done');
    generateAlbums(numberOfArtists, numberOfAlbums, numberOfSongs);
  });

};

// arg 1: max records per file desired
// arg 2: max total artists desired
// arg 3: average albums per artist desired
// arg 4: average songs per album desired

generateArtists(10000000, 3, 10);
