
import PouchDB from "pouchdb";

let users = new PouchDB("users");
let decks = new PouchDB("decks");


/**
 * 
 * @param {Object} deck - JSON representation of the deck object to be updated
 * @returns {Object} - the response object, similar to addUserToDatabase
 */
export async function addDeckToDatabase(deck) {
    try { 
    let doc = {"_id" : deck.id.toString() , "deck" : deck};
    let response = await decks.put(doc);
    return response;
    }
    catch(err) {
        return err;
    }
}

/**
 * 
 * @param {string} id - id of the requested deck
 * @returns {Object} - the requested deck object
 */

export async function getDeckByID(id) {
    try {
    let deck_document = await decks.get(id);
    return deck_document["deck"];
    } 
    catch(err) {
        return err;
    }
}

/**
 * 
 * @param {Object} deck - The parsed JSON object representing the deck to be updated
 * @returns {Object} - response status object
 */
export async function updateDeckInDatabase(deck) {
    try {
    let doc_to_update = await decks.get(deck.id);
    Object.assign(doc_to_update, {"_id" : deck.id.toString() , "deck" : deck});
    let response = await decks.put(doc_to_update);
    return response;
    }
    catch(err) {
        return err;
    }
}

/**
 * 
 * @param {string} id - The id of the deck to be deleted
 * @returns {Object} - response status object
 */
export async function deleteDeckFromDatabase(id) {
    try {
    let deletion = await decks.get(id).then(deck_doc => decks.remove(deck_doc));
    return deletion; 
    } 
    catch(err) {
        return err;
    }
 }

/**
 * 
 * @param {Object} user - JSON representation of the user object to be added
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

    try {
    let response = await users.put(doc);
    return response;
    } 
    catch(err) {
        return err;
    }
}

/**
 * 
 * @param {string} id - id of the requested user
 * @returns {Object} - JSON representation of the requested User object
 */
export async function getUserByID(id){
    try  {
    let user_document = await users.get(id); 
    return user_document["user"];
    } 
    catch(err) {
        return err;
    }
}

/**
 * 
 * @param {Object} user - The parsed JSON object representing the user to be updated
 * @returns {Object} - response status object
 */
export async function updateUserInDatabase(user) {
    try {
    let doc_to_update = await users.get(user.id);
    Object.assign(doc_to_update, {"_id" : user.id.toString() , "user" : user});
    let response = await users.put(doc_to_update);
    return response;
    }
    catch(err) {
        return err;
    }
    
}

/**
 * deletes a user specified by id from the database.
 * Note: Because of how pouchDB works, there are still references to deleted documents (called tombstones)
 * Under the hood, this just adds a _deleted attribute to the document (could be useful info for later)
 * @param {string} id - id of user to be deleted
 * @returns {Object} - response status object (if the user was deleted properly)
 */
export async function deleteUserFromDatabase(id) {
   try {
   let deletion = await users.get(id).then(user_doc => users.remove(user_doc));
   return deletion;
   }
   catch(err) {
      return err;
   }
}

/**
 * deletes the entirety of the users and decks databases
 * @returns {Object} response status object
 */
export async function clearDatabases() {
    try {
    let delete_users = await users.destroy();
    let delete_decks = await decks.destroy();
    users = new PouchDB("users");
    decks = new PouchDB("decks");
    return {"ok" : delete_decks["ok"] && delete_users["ok"] };
    } 
    catch(err) {
        return err;
    }
}


/**
 * @returns {Object} - {users: user db info , decks: deck db info}
 * Used for debugging purposes
 * logs the info for all databases
 */
export async function logDatabaseInformation() {
    try { 
   let users_info = await users.info();
   let decks_info = await decks.info();
   return {"users" : users_info, "decks" : decks_info};
    } 
    catch(err) {
        return err;
    }
}


