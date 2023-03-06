import { db, Parking } from './lib/database.js';
import http from 'http';



const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});

let x = new Parking("parking1", 1, 1, true, "ABC-123");
x.set();