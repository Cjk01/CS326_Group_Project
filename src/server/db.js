
import {User} from "../client/scripts/structures/user.js";
import PouchDB from "pouchdb";

const users = new PouchDB("users");
const decks = new PouchDB("decks");


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
 * @param {int} id - id of the requested user
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