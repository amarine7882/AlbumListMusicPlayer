import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,
  rps: 300,
  duration: '2m',
};

export default function () {
  // <--------------- GET TESTS ----------------------------->

  for (let i = 0; i < 3; i += 1) {
    const res = http.get(`http://13.57.33.24:3001/player/artists/${i * 5 + 2000000}/albums`, {
      tags: { name: 'get-artists-info' },
    });
    check(res, {
      'status was 200': r => r.status === 200,
      'server under load threshold': r => r.status !== 503,
      'transaction time OK': r => r.timings.duration < 800,
    });
  }
  const url = `http://13.57.33.24:3001/player/artists/${Math.floor(Math.random() * 9999999) +
    1}/albums`;
  const res = http.get(url, { tags: { name: 'get-artists-info' } });
  check(res, {
    'status was 200': r => r.status === 200,
    'server under load threshold': r => r.status !== 503,
    'transaction time OK': r => r.timings.duration < 800,
  });

  // <- POST, PUT, DELETE METHODS TESTED ~ 1/3000 req to replicate streaming service load ->

  // if (Math.floor(Math.random() * 1000) + 1 === 1000) {
  //   const params = { headers: { 'Content-Type': 'application/json' } };

  //   // <-------- POST TEST -------------------------->

  //   const postUrl = 'http://13.57.33.24:3001/player/album';
  //   const postPayload = JSON.stringify({
  //     artist_id: 500,
  //     album_name: 'test',
  //     image_url: 'place.com',
  //     publish_year: 2000,
  //   });
  //   const postTest = http.post(postUrl, postPayload, params);
  //   check(postTest, {
  //     'status was 200': r => r.status === 200,
  //     'server under load threshold': r => r.status !== 503,
  //     'transaction time OK': r => r.timings.duration < 800,
  //   });
  // }
}
