//This is where the pouch db database initialization and data manipulation functions live

import PouchDB from "pouchdb";

const users = new PouchDB("users");
const decks = new PouchDB("decks");

