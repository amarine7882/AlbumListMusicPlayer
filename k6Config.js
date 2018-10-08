import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 500,
  rps: 3300,
  duration: '1m',
};

export default function() {
  // <--------------- GET TESTS ----------------------------->

  for (let i = 0; i < 3; i += 1) {
    const res = http.get(`http://localhost:3001/artists/${i * 5 + 2000000}/albums`, {
      tags: { name: 'get-artists-info' },
    });
    check(res, {
      'status was 200': r => r.status === 200,
      'server under load threshold': r => r.status !== 503,
      'transaction time OK': r => r.timings.duration < 800,
    });
  }
  const url = `http://localhost:3001/artists/${Math.floor(Math.random() * 9999999) + 1}/albums`;
  const res = http.get(url, { tags: { name: 'get-artists-info' } });
  check(res, {
    'status was 200': r => r.status === 200,
    'server under load threshold': r => r.status !== 503,
    'transaction time OK': r => r.timings.duration < 800,
  });

  // <- POST, PUT, DELETE METHODS TESTED ~ 1/3000 req to replicate streaming service load ->

  if (Math.floor(Math.random() * 1000) + 1 === 1000) {
    console.log('POST, PUT, DELETE');
    const params = { headers: { 'Content-Type': 'application/json' } };

    // <-------- POST TEST -------------------------->

    const postUrl = 'http://localhost:3001/album';
    const postPayload = JSON.stringify({
      artist_id: 500,
      album_name: 'test',
      image_url: 'place.com',
      publish_year: 2000,
    });
    http.post(postUrl, postPayload, params);

    // <--------------- PUT TEST --------------------->

    const putUrl = `http://localhost:3001/artist/${Math.floor(Math.random() * 9999999) + 1}`;
    const putPayload = JSON.stringify({
      artist_name: 'Joe',
    });
    http.put(putUrl, putPayload, params);

    // <--------------- DELETE TEST ------------------>

    const deleteUrl = `http://localhost:3001/song/${Math.floor(Math.random() * 9999999) + 1}`;
    http.del(deleteUrl);
  }
}
