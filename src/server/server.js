import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import * as db from "./db.js";

const app = express();
const port = 3500;


//express middleware ---------------------------------------------
//this sets up our app so that when users go to
// localhost:3500/ they receive the index.html file in src/client/
app.use(express.json());
app.use(express.static("src/client"));


//all of the crud operations below

app.get('/users', async (req, res) => {
    let response_obj = await db.getUserByID(req.query.id);
    if(response_obj instanceof Error){
        //error handling for when a user does not exist in the DB
        res.status(404);
        res.send(response_obj);
    }
    else {
        //successful
        res.status(200);
        res.send(response_obj);
    }
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

app.delete('/users', async (req, res) => {
    let response_obj = await db.deleteUserFromDatabase(req.query.id);
    res.send(response_obj);
});

app.delete('/decks', async (req, res) => {
    let response_obj = await db.deleteDeckFromDatabase(req.query.id);
    res.send(response_obj);
});

app.delete('/clear_databases', async (req, res) => {
    let response_obj = await db.clearDatabases();
    res.send(response_obj);
});


app.listen(port , () => {
    console.log(`Currently Listening on Port ${port}`);
});