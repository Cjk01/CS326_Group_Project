
import {User} from "../client/scripts/structures/user.js";
import {Deck} from "../client/scripts/structures/deck.js";
import PouchDB from "pouchdb";
import * as http from "http";

const users = new PouchDB("users");
const decks = new PouchDB("decks");


/**
 * 
 * @param {Deck} deck - the deck object to be added
 * @returns {Object} - the response object, similar to addUserToDatabase
 */
export async function addDeckToDatabase(deck) {
    let doc = {"_id" : deck.id.toString() , "deck" : deck};
    let response = await decks.put(doc);
    return response;
}

/**
 * 
 * @param {string} id - id of the requested deck
 * @returns {Deck} - the requested deck object
 */

export async function getDeckByID(id) {
    let deck_document = await decks.get(id);
    return deck_document["deck"];
}

/**
 * 
 * @param {User} user - the user object to be added
 * @returns {Object} - the response object, like below
 * {
  "ok": true,
  "id": "mydoc",
  "rev": "1-A6157A5EA545C99B00FF904EEF05FD9F"
  }
 * 
 */
export async function addUserToDatabase(user) {
    let doc = {"_id" : user.id.toString(), "user" : user}; //_id is needed for pouchDB
    let response = await users.put(doc);
    return response;
}

/**
 * 
 * @param {string} id - id of the requested user
 * @returns {User} - The requested User object
 */
export async function getUserByID(id){
    let user_document = await users.get(id);
    return user_document["user"];
}


/**
 * @returns {Object} - {users: user db info , decks: deck db info}
 * Used for debugging purposes
 * logs the info for all databases
 */
export async function logDatabaseInformation() {
   let users_info = await users.info();
   let decks_info = await decks.info();
   return {"users" : users_info, "decks" : decks_info};
}


