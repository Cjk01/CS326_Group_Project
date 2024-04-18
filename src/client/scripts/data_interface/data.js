//this is where all functions used to interact with the server are stored
//these are meant to be transparent to the user so that api calls can be made easily 
//by the front end

import { User } from "../structures/user.js";
import { Card } from "../structures/card.js";
import { Deck } from "../structures/deck.js";

const server_base_url = "http://localhost:3470/"


/**
 * constructs and sends the http request to add a user to the database 
 * @param {User} user - The user to be added to the database
 * @returns {Object} - response object with status info
 * 
 * 
 */
export async function addUser(user) {
    let headers = new Headers();
    headers.append("Content-Type", "text/html");
    let response = await fetch(server_base_url + "users", {"headers": headers, method: "POST", body: JSON.stringify(user)});
    let response_json = response.json();
    return response_json;
   
}

/**
 * 
 * @param {int} user_id - id of the user you wish to obtain from the database 
 * @returns {User} - the User object
 */
export async function getUser(user_id) {
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}users?id=${user_id}` , {headers: headers, method: "GET"});
  let response_json = await response.json();
  let returned_user = new User(); //creating an empty class isntance to map the returned object into
  Object.assign(returned_user, response_json); //filling in the User object with the contents of the returned object
  return returned_user;
  
}


/**
 * 
 * @param {Deck} deck - the deck to be added
 * @returns {Object} - response object with status info
 */
export async function addDeck(deck) {
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}decks`, {headers: headers, method: "POST" , body: JSON.stringify(deck)});
  let response_json = await response.json();
  return response_json;

}
//TODO
export async function getDeck() {

}


/**
 * This function is used to load our pouchDB store with fake data 
 * to satisfy the mock data requirements for milestone-02.
 * This will not be needed once we move forward to milestone-03
 * Makes use of the https://randomuser.me/documentation#howto api
 * Will not be used after milestone-02
 * @returns {Object} - {users: user db info, decks: deck db info} obtained from logDatabaseInformation()
 * 
 */
export async function loadBatchTestData() {
  
  //fetch fake user data in bulk from api
  let fakeUsersRequest = await fetch("https://randomuser.me/api?results=500"); //fetch 500 fake users
  let fakeUsersJson = await fakeUsersRequest.json();
  let fakeUsersArray = fakeUsersJson.results;
  let fakeUsersPromises = fakeUsersArray.map(user => addUser(new User(user["login"]["uuid"], user["login"]["username"],{"meta" : 3}, ["test"], ["test"])));
  let fullyResolved = await Promise.all(fakeUsersPromises);
  

  /**
   * generating 50 multiplication cards to be used in decks
   */
  let cards = [];
  for(let i = 0; i < 50 ; ++i){
    let n1 = Math.floor(Math.random() * 12);
    let n2 = Math.floor(Math.random() * 12);
    let question = n1.toString() + " x " + n2.toString() + " = ?";
    let answer = (n1 * n2).toString();
    cards.push(new Card("text_answer", question, answer, {"metadata" : "example"}));
  }

  //generating 3 decks and placing them into the database
  for(let i = 0 ; i < 3; ++i) {
    let uuid = await fetch("https://randomuser.me/api").then(resp => resp.json().then(data => data.results[0]["login"]["uuid"]));
    let deck_creator = await getUser(fakeUsersArray[0]["login"]["uuid"]);
    console.log(deck_creator instanceof User);
    let deck = new Deck(uuid, "Math", cards, deck_creator);
    let added_deck = await addDeck(deck);
  }
  

  /**
   *
   * Now, a final http request needs to be made to the server (on an empty path /)
   * To get the results of logDatabaseInfo, which is then returned to user
   */
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}`, {headers: headers, method: "GET"}).then(resp => resp.json());
  return response;

}