import { db, Parking, ParkingCar } from './lib/park.js';
import { User } from './lib/user.js';
import http from 'http';



const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello, World!');
});

server.listen(3000, () => {
  console.log('Server running on http://localhost:3000/');
});

// let x = new ParkingCar;
// x.set("parking1", 1, 1, true, "ABC-123");
// await x.send();
// let y = new Parking;
// await y.get("parking1", 1);
// console.log(y);

let x = new User;
x.register("test", "test", "password");