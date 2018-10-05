import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 700,
  rps: 3000,
  duration: '30s',
};

export default function () {
  const res = http.get('http://localhost:3001/artists/6/albums');
  check(res, {
    'status was 200': r => r.status === 200,
  });
}
