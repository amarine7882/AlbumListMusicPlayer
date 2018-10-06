const { Client } = require('pg');

const db = new Client({
  host: '127.0.0.1',
  database: 'spotify',
  port: 5432,
});

db.connect()
  .then(() => console.log('psql connection established'))
  .catch(err => console.log(err));

exports.createRecord = (fields, type) => {
  const columns = Object.keys(fields).join(', ');
  let values = Object.values(fields);

  values.forEach((value, idx) => {
    if (typeof value === 'string') {
      values[idx] = `'${value}'`;
    }
  });
  values = values.join(', ');

  return db
    .query(`INSERT INTO ${type}s (${columns}) VALUES (${values})`)
    .then(result => result)
    .catch(err => err);
};

exports.getDataForArtist = id => new Promise((res, rej) => {
  db.query(
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
    .then(data => res(data))
    .catch(err => rej(err));
});

exports.updateRecord = (id, newFields, type) => {
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

  return db
    .query(`UPDATE ${type}s SET ${queryString} WHERE ${type}s._id_${type} = ${id}`)
    .then(result => result)
    .catch(err => err);
};

exports.deleteRecord = (id, type) => db
  .query(
    `
    DELETE
    FROM
    ${type}s
    WHERE
    ${type}s._id_${type} = ${id}
  `,
  )
  .then(result => result)
  .catch(err => err);
