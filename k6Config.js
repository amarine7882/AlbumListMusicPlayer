import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 500,
  rps: 1600,
  duration: '1m',
};

export default function () {
  for (let i = 0; i < 3; i += 1) {
    const res = http.get(`http://localhost:3001/artists/${i + 2000000}/albums`);
    check(res, {
      'status was 200': r => r.status === 200,
      'transaction time OK': r => r.timings.duration < 800,
    });
  }
  const url = `http://localhost:3001/artists/${Math.floor(Math.random() * 9000000) + 1}/albums`;
  const res = http.get(url);
  check(res, {
    'status was 200': r => r.status === 200,
    'transaction time OK': r => r.timings.duration < 800,
  });
}
