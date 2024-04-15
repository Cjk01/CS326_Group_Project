//This is where the pouch db database initialization and data manipulation functions live

import PouchDB from "pouchdb";

const users = new PouchDB("users");
const decks = new PouchDB("decks");


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