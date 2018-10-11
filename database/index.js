const { Client } = require('pg');

const db = new Client({
  host: '127.0.0.1',
  database: 'spotify',
  port: 5432,
});

db.connect()
  .then(() => console.log('psql connection established'))
  .catch(err => console.log(err));

exports.createRecord = (fields, type) => new Promise((res, rej) => {
  const columns = Object.keys(fields).join(', ');
  let values = Object.values(fields);

  values.forEach((value, idx) => {
    if (typeof value === 'string') {
      values[idx] = `'${value}'`;
    }
  });
  values = values.join(', ');

  db.query(`INSERT INTO ${type}s (${columns}) VALUES (${values})`)
    .then(result => res(result))
    .catch(err => rej(err));
});

exports.getDataForArtist = id => db
  .query(
    `
  SELECT
  *
  FROM
  artists,
  albums,
  songs
  WHERE
  artists._id_artist = ${id}
  AND albums.artist_id = artists._id_artist
  AND songs.album_id = albums._id_album`,
  )
  .then(data => data)
  .catch(err => err);

exports.updateRecord = (id, newFields, type) => new Promise((res, rej) => {
  const columns = Object.keys(newFields);
  const values = Object.values(newFields);
  let queryString = [];

  values.forEach((value, idx) => {
    if (typeof value === 'string') {
      values[idx] = `'${value}'`;
    }
  });

  columns.forEach((column, idx) => {
    queryString = [...queryString, `${column} = ${values[idx]}`];
  });
  queryString = queryString.join(', ');

  db.query(`UPDATE ${type}s SET ${queryString} WHERE ${type}s._id_${type} = ${id}`)
    .then(result => res(result))
    .catch(err => rej(err));
});

exports.deleteRecord = (id, type) => new Promise((res, rej) => {
  db.query(
    `
      DELETE
      FROM
      ${type}s
      WHERE
      ${type}s._id_${type} = ${id}
    `,
  )
    .then(result => res(result))
    .catch(err => rej(err));
});

