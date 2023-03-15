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
import JSON from 'JSON';

import cors from 'cors';


import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a new instance of the Express application
const app = express();
app.use(cors());
app.use(bodyParser.json());
import http from 'http';
const server = http.createServer(app);
import { Server } from "socket.io";

const io = new Server(server, { cors: { origin: '*' } });

import { Cache } from './lib/cache.js';
const cache = new Cache(100);
cache.set_func("parking", async () => {
  const parking = new Parking();
  await parking.get("parking1");
  return parking;
});

import jwt from 'jsonwebtoken';
import { randomInt } from 'crypto';

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Missing authorization header' });
  }

  // const token = authHeader.split(' ')[1];
  const token = authHeader;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = { 
      name: decodedToken.name,
      balance: decodedToken.balance,
      email: decodedToken.email,
      car_license: decodedToken.car_license,
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

const upload = multer();
app.post('/uploadin', upload.single('file'), async (req, res) => {
  // console.log(req.file.buffer);
  // console.log(req.file.originalname);
  fs.WriteStream("test.jpg").write(req.file.buffer);
  const formData = new FormData();
  formData.append('file', req.file.buffer, "test.jpg");
  axios.post('https://api.aiforthai.in.th/panyapradit-lpr/', formData, {headers: {'Content-Type': 'multipart/form-data', "Apikey": process.env.LRPKEY }}).then( async response => {
    // console.log(response.data);
    response.data.recognition = "9รถ2019กรุงเทพมหานคร";
    const recognition = response.data.recognition.replace("/", "-").replace("\n", "-").replace(" ", "");
    console.log(recognition);
    const license = new License();
    const email = await license.checkGetEmail(recognition);
    console.log(email);
    if (email == "" || email == undefined){
      res.send('License is not registered');
      id_lcd_msg = randomInt(1, 100000000);
      lcd_msg = "reg";
      return;
    }
    else{
      await license.comeIn(recognition);
      id_lcd_msg = randomInt(1, 100000000);
      const user = new User();
      user.auth = true;
      await user.get(email);
      lcd_msg = "Welcome to parking\n" + user.name + "\n" + "Balance: " + await user.balance + " Baht";
      console.log(lcd_msg);
      res.sendStatus(200);
      return;
    }
    res.send('File uploaded successfully');

  }).catch(error => {
    console.error(error);
    id_lcd_msg = randomInt(1, 100000000);
    lcd_msg = "Error.\n Please take a card";
    res.sendStatus(200);
  });
  return;
});

app.post('/uploadout', upload.single('file'), async (req, res) => {
  // console.log(req.file.buffer);
  const formData = new FormData();
  formData.append('file', req.file.buffer, "test.jpg");
  axios.post('https://api.aiforthai.in.th/panyapradit-lpr/', formData, {headers: {'Content-Type': 'multipart/form-data', "Apikey": process.env.LRPKEY }}).then( async response => {
    // console.log(response.data);
    response.data.recognition = "9รถ2019กรุงเทพมหานคร";
    const recognition = response.data.recognition.replace("/", "-").replace("\n", "-").replace(" ", "");
    console.log(recognition);
    const license = new License();
    const email = await license.checkGetEmail(recognition);
    console.log(email);
    if (email == "" || email == undefined){
      res.send('License is not registered');
      id_lcd_msg = randomInt(1, 100000000);
      lcd_msg = "See you again.";
      return;
    }
    else{
      const time = await license.comeOut(recognition);
      id_lcd_msg = randomInt(1, 100000000);
      const user = new User();
      user.auth = true;
      await user.get(email);
      await user.subtractBalance(time*1);
      lcd_msg = "Thank you.\n" + user.name + "\n" + "Balance: " + await user.balance + " Baht";
      console.log(lcd_msg);
      res.sendStatus(200);
      return;
    }
    res.send('File uploaded successfully');

  }).catch(error => {
    console.error(error);
    id_lcd_msg = randomInt(1, 100000000);
    lcd_msg = "Error.\n Put your card";
    res.sendStatus(200);
  });
  return;
});

app.post("/user/reg", async (req, res) => {
  const data = req.body;
  const user = new User();
  user.email = data.email;
  user.password = data.password;
  user.name = data.name;
  try{
    await user.register(user.name, user.email, user.password);
    const data = await user.getdata();
    console.log(JSON.stringify(data));
    const token = jwt.sign(JSON.stringify(data), process.env.JWT_SECRET);
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
    console.log(error);
    return;
  }
});

app.post("/user/login", async (req, res) => {
  const data = req.body;
  const pass = data.password;
  const email = data.email;
  const user = new User();
  let chk = await user.getAuth(email, pass);
  if (chk == true){
    const token = jwt.sign(user.getdata().toString(), process.env.JWT_SECRET);
    const resdata = {
      error: false,
      msg: "Login success",
      token: token,
    };
    res.send(JSON.stringify(resdata));
    return;
  }
  else{
    const resdata = {
      error: true,
      msg: "Login fail",
    };
    res.send(JSON.stringify(resdata));
    return;
  }
});


app.get('/park', async (req, res) => {
  const data = {};
  Object.assign(data, await cache.get("parking"));
  res.json(data.car[0]);
});

app.post("/esp/ir", async (req, res) => {
  const data = req.body;
  // console.log(data);
  const parking = await cache.get("parking");
  const id = data.id;
  const floor = data.floor;
  const free = data.free;
  parking.car[0][Number(id)].free = (free=="1")?true:false;
  // console.log(data.free);
  cache.set("parking", parking);
  res.sendStatus(200);
});

let id_lcd_msg = 1;
let lcd_msg = "reg";
app.get("/lcd/id", async (req, res) => {
  res.status(200).send(id_lcd_msg.toString());
});

app.get("/lcd/msg", async (req, res) => {
  res.send(lcd_msg);
});

app.post("/user/balance", authMiddleware, async (req, res) => {
  const email = req.userData.email;
  const user = new User();
  user.auth = true;
  console.log(req.userData);
  await user.get(email);
  const resdata = {
    error: false,
    balance: await user.balance,
  };
  res.send(JSON.stringify(resdata));
});

app.get("/user/license", authMiddleware, async (req, res) => {
  const email = req.userData.email;
  const user = new User();
  user.auth = true;
  await user.get(email);
  console.log(await user.getdata());
  const resdata = {
    error: false,
    license: await user.car_license,
  };
  console.log(resdata);
  res.send(JSON.stringify(resdata));
});

app.post("/user/addlicense", authMiddleware, async (req, res) => {
  const data = req.body;
  const email = req.userData.email;
  const user = new User();
  user.auth = true;
  await user.get(email);
  user.email = email;
  await user.addCar(data.license);
  const resdata = {
    error: false,
    msg: "Add license success",
  };
  res.send(JSON.stringify(resdata));
});

app.get('/', (req, res) => {
  const filePath = __dirname + '/test.html';
  res.sendFile(filePath);
  res.cookie("name", "value");
});

app.get("/test", (req, res) => {
  const cookie = req.headers.cookie;
  console.log(cookie.name);
  res.sendStatus(200);
});

app.post("/user/addmoney", authMiddleware, async (req, res) => {
  const data = req.body;
  const email = req.userData.email;
  const amount = data.amount;
  const user = new User();
  user.email = email;
  user.auth = true;
  await user.get(email);
  console.log(user.balance);
  user.auth = true;
  await user.addBalance(amount);
  console.log(user.balance);
  
  res.sendStatus(200);
});

// // Start the Express application and listen for incoming requests on port 3000
const hostname =  "172.20.10.3";
const port = "3000";
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});