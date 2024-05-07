import express from 'express';
import cors from 'cors';
import path from 'path';
import {fileURLToPath} from 'url';
import * as db from "./db.js";

//we need these below as a cross platform solution
//to acquire the current directory name while
//using ES6 module syntax instead of the require syntax
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const client_path = path.resolve('src/client/');
const app = express();
const port = 3500;

console.log(`client_path: ${client_path}`);
console.log(`joined path: ${path.join(client_path, 'index.html')}`);

//express middleware
//this sets up our app so that when users go to
// localhost:3500/ they receive the index.html file in src/client/

// allow CORS:
app.use(function (req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000')
  next()
})
app.use(cors());
app.use(express.json());
app.use(express.static(client_path));


app.get('/', (req, res) => {
   res.sendFile(path.join(client_path, 'index.html'));
});

//all of the crud operations below

app.get('/users', async (req, res) => {
    let response_obj = await db.getUserByID(req.query.id);
    res.send(response_obj);
});

app.get('/decks', async (req, res) => {
    let response_obj = await db.getDeckByID(req.query.id);
    res.send(response_obj);
});

app.post('/users' , async (req, res) => {
    let response_obj = await db.addUserToDatabase(req.body);
    res.send(response_obj);
});

app.post('/decks', async (req, res) => {
    console.log(req.body);
    let response_obj = await db.addDeckToDatabase(req.body);
    res.send(response_obj);
});

app.put('/users', async (req, res) => {
    let response_obj = await db.updateUserInDatabase(req.body);
    res.send(response_obj);
});

app.put('/decks', async (req, res) => {
    let response_obj = await db.updateDeckInDatabase(req.body);
    res.send(response_obj);
});



app.delete('/clear_databases', async (req, res) => {
    let response_obj = await db.clearDatabases();
    res.send(response_obj);
});


app.listen(port , () => {
    console.log(`Currently Listening on Port ${port}`);
});