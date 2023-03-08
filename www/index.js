import { db, Parking, ParkingCar } from './lib/park.js';
import { User } from './lib/user.js';
import { License } from './lib/carLicense.js';

import dotenv from 'dotenv';
import express, { response } from 'express';
import bodyParser from 'body-parser';

import axios from 'axios';
import fs from 'fs';
import multer from 'multer';
import { env } from 'process';
import FormData  from 'form-data';

// Create a new instance of the Express application
const app = express();
app.use(bodyParser.json());

// Define a route that will handle HTTP GET requests to the root URL '/'
app.post('/api/carparking/', (req, res) => {
  let data = req.body;
  console.log(data);
  res.send('Hello, World!');
});

const upload = multer();
app.post('/upload', upload.single('file'), async (req, res) => {
  console.log(req.file.buffer);
  const formData = new FormData();
  formData.append('file', req.file.buffer, req.file.originalname);
  axios.post('https://api.aiforthai.in.th/panyapradit-lpr/', formData, {headers: {'Content-Type': 'multipart/form-data', "Apikey": process.env.LRPKEY }}).then(response => {
    console.log(response.data);
    res.send('File uploaded successfully');
  }).catch(error => {
    console.error(error);
    res.sendStatus(200);
  });
  
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Start the Express application and listen for incoming requests on port 3000
app.listen(3000, () => {
  console.log('Express server listening on port 3000...');
});