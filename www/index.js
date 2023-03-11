import { db, Parking, ParkingCar } from './lib/park.js';
import { User } from './lib/user.js';
import { License } from './lib/carLicense.js';

import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

import axios from 'axios';
import fs from 'fs';
import multer from 'multer';
import { env } from 'process';
import FormData  from 'form-data';

import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new instance of the Express application
const app = express();
app.use(bodyParser.json());
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server);

import { Cache } from './lib/cache.js';
const cache = new Cache(100);
cache.set_func("parking", async () => {
  const parking = new Parking();
  await parking.get("parking1");
  return parking;
});

import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { 
      userId: decodedToken.userId,
    };
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid authorization token' });
  }
}

io.on('connection', (socket) => {
  console.log('a user connected');

  // Send a message to the client when they connect
  socket.emit('msg', 'Welcome to the Socket.io server!');

  // Listen for messages from the client
  socket.on('message', (data) => {
    console.log('Received message:', data);
    io.emit('message', data);
  });

  // Listen for disconnections
  socket.on('disconnect', () => {
    console.log('a user disconnected');
  });
});

// Define a route that will handle HTTP GET requests to the root URL '/'
app.post('/api/carparking/', (req, res) => {
  io.emit('msg', "test");
  let data = req.body;
  console.log(data);
  res.send('Hello, World!');
});

const upload = multer();
app.post('/uploadin', upload.single('file'), async (req, res) => {
  console.log(req.file.buffer);
  const formData = new FormData();
  formData.append('file', req.file.buffer, req.file.originalname);
  axios.post('https://api.aiforthai.in.th/panyapradit-lpr/', formData, {headers: {'Content-Type': 'multipart/form-data', "Apikey": process.env.LRPKEY }}).then( async response => {
    console.log(response.data);
    const recognition = response.data.recognition;
    const license = new License();
    const email = await license.checkGetEmail(recognition);
    if (email == ""){
      res.send('License is not registered');
      return;
    }
    else{
      await license.comeIn(recognition);
      res.send('License is registered');
      return;
    }
    res.send('File uploaded successfully');

  }).catch(error => {
    console.error(error);
    res.sendStatus(200);
  });
  return;
});

app.post('/uploadout', upload.single('file'), async (req, res) => {
  console.log(req.file.buffer);
  const formData = new FormData();
  formData.append('file', req.file.buffer, req.file.originalname);
  axios.post('https://api.aiforthai.in.th/panyapradit-lpr/', formData, {headers: {'Content-Type': 'multipart/form-data', "Apikey": process.env.LRPKEY }}).then( async response => {
    console.log(response.data);
    const recognition = response.data.recognition;
    const license = new License();
    const email = await license.checkGetEmail(recognition);
    if (email == ""){
      res.send('License is not registered');
      return;
    }
    else{
      const time = await license.comeOut(recognition);
      res.send('License is registered');
      return;
    }
    res.send('File uploaded successfully');

  }).catch(error => {
    console.error(error);
    res.sendStatus(200);
  });
  return;
});

app.post("/user/add", async (req, res) => {
  const data = req.body;
  const user = new User();
  user.email = data.email;
  user.password = data.password;
  user.name = data.name;
  try{
    await user.register(user.name, user.email, user.password);
    const token = jwt.sign(user.getdata(), process.env.JWT_SECRET, { expiresIn: '24h' });
    const resdata = {
      error: false,
      msg: "Register success",
      token: token,
    };
    res.send(JSON.stringify(resdata));
    return;
  }
  catch (error) {
    const resdata = {
      error: true,
      msg: error,
    };
    res.send(JSON.stringify(resdata));
    return;
  }
});

app.get('/park', async (req, res) => {
  const data = {};
  Object.assign(data, await cache.get("parking"));
  res.send(data);
});

app.post("/esp/ir", async (req, res) => {
  const data = req.body;
  console.log(data);
  const parking = await cache.get("parking");
  const id = data.id;
  const floor = data.floor;
  const free = data.free;
  console.log( parking.car);
  parking.car[floor][id] = free;
  io.emit('parking_change', true);
  res.sendStatus(200);
});

app.get('/', (req, res) => {
  const filePath = __dirname + '/test.html';
  res.sendFile(filePath);
});

// // Start the Express application and listen for incoming requests on port 3000
server.listen(3000, () => {
  console.log('Express server listening on port 3000...');
});