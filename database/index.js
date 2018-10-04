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
  const values = Object.values(fields).join(', ');

  return db
    .query(`INSERT INTO ${type}s (${columns}) VALUES (${values})`)
    .then(data => console.log(data))
    .catch(err => err);
};

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
  .then(data => data.rows)
  .catch(err => err);

exports.updateRecord = (id, newFields, type) => {
  const columns = Object.keys(newFields);
  let queryString = [];

  columns.forEach((column) => {
    queryString = [...queryString, `${column} = ${newFields[column]}`];
  });
  queryString = queryString.join(', ');

  return db
    .query(`UPDATE ${type}s SET ${queryString} WHERE ${type}s._id_${type} = ${id}`)
    .then(data => console.log(data))
    .catch(err => err);
};

exports.deleteRecord = (id, type) => db
  .query(
    `
    DELETE
    *
    FROM
    ${type}s
    WHERE
    ${type}s._id_${type} = ${id}
  `,
  )
  .then(data => console.log(data))
  .catch(err => err);
