import { db, Parking, ParkingCar } from './lib/park.js';
import { User } from './lib/user.js';
import { License } from './lib/carLicense.js';

// Import the Express module
import express from 'express';
import bodyParser from 'body-parser';

import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
// Create a new instance of the Express application
const app = express();
app.use(bodyParser.json());

// Define a route that will handle HTTP GET requests to the root URL '/'
app.post('/api/carparking/', (req, res) => {
  let data = req.body;
  console.log(data);
  res.send('Hello, World!');
});

app.post('/upload', upload.single('image'), (req, res) => {
  console.log(req.file); // Output: { fieldname: 'image', originalname: 'example.jpg', encoding: '7bit', mimetype: 'image/jpeg', destination: 'uploads/', filename: '12bbefee41b81e285b8f266c54e6bde1', path: 'uploads/12bbefee41b81e285b8f266c54e6bde1', size: 26948 }
  res.send('Image uploaded successfully');
});


app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the Express application and listen for incoming requests on port 3000
app.listen(3000, () => {
  console.log('Express server listening on port 3000...');
});