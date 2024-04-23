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
 * @param {User} - the updated user object sent to the database
 * @returns {Object} - response object with status info
 */
export async function updateUser(user) {
    let headers = new Headers();
    headers.append("Content-Type", "text/html");
    let response = await fetch(server_base_url + "users", {"headers": headers, method: "PUT", body: JSON.stringify(user)});
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
 * RIP User 
 * @param {int} user_id id of user to be deleted 
 */
export async function deleteUser(user_id) {
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}users?id=${user_id}` , {headers: headers, method: "DELETE"});
  let response_json = await response.json();
  return response_json;
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

export async function updateDeck(deck) {
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}decks`, {headers: headers, method: "PUT" , body: JSON.stringify(deck)});
  let response_json = await response.json();
  return response_json;
}

export async function deleteDeck(deck_id) {
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}decks?id=${deck_id}` , {headers: headers, method: "DELETE"});
  let response_json = await response.json();
  return response_json;
}

/**
 * 
 * @param {int} deck_id 
 * @returns {Deck} - the requested deck object
 */
export async function getDeck(deck_id) {
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}decks?id=${deck_id}`, {headers: headers, method: "GET"});
  let response_json = await response.json();
  let returned_deck = new Deck();
  Object.assign(returned_deck, response_json);
  return returned_deck;
}


/**
 * tests all CRUD operations for decks and users to ensure they are functioning correctly
 * any error will be logged to the console
 * 
 */
export async function testDatabaseOperations() {

  let user_uuid = await fetch("https://randomuser.me/api").then(resp => resp.json().then(data => data.results[0]["login"]["uuid"]));
  let test_user = new User(user_uuid , "testDatabaseUser", ["Follower1"], ["Following1"], {} );

  //testing addUser
  let add_response = await addUser(test_user);
  console.assert(add_response["ok"]);

  //testing getUser
  let get_response = await getUser(test_user.id);
  console.assert(get_response instanceof User && get_response.id === user_uuid);

  //testing updateUser
  test_user.followers.push("Great New Follower");
  let update_response = await updateUser(test_user);
  console.assert(update_response["ok"]);
  getUser(test_user.id).then(user => console.assert(user.followers[1] === "Great New Follower"));

  //testing addDeck
  let deck_uuid = await fetch("https://randomuser.me/api").then(resp => resp.json().then(data => data.results[0]["login"]["uuid"]));
  let test_deck = new Deck(deck_uuid, "TestTopic", [new Card("multiple-choice", "1x0", "0", {})], test_user );
  let deck_add = await addDeck(test_deck);
  console.assert(deck_add["ok"]);

  //testing getDeck
  let deck_get = await getDeck(test_deck.id);
  console.assert(deck_get instanceof Deck && deck_get.id === deck_uuid);

  //testing updateDeck
  test_deck.cards.push(new Card("multiple-choice", "2x2", "4", {}));
  let update_deck = await updateDeck(test_deck);
  console.assert(update_deck["ok"]);
  getDeck(test_deck.id).then(deck => console.assert(deck.cards.length === 2 && deck.cards[1].answer === "4"));

  //testing deleteDeck
  let delete_deck = await deleteDeck(test_deck["id"]);
  console.assert(delete_deck["ok"]);

  //testing deleteUser
  let delete_response = await deleteUser(test_user["id"]);
  console.assert(delete_response["ok"]);

  

}

/**
 * Clears the database of all contents
 * Used for setting up test environments
 */
export async function clearDatabases() {

  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}clear_databases` , {headers: headers, method: "DELETE"});
  let response_json = await response.json();
  return response_json;
}



/**
 * This function configures the database for milestone-02 presentation
 * It is meant to be called once in main.js, and prepares an example user
 * so that all features can be shown in their entirety
 */
export async function configureDatabaseForMilestoneTwo() {
  

  function makeCards(n) {
  let cards = [];
  for(let i = 0; i < n ; ++i){
    let n1 = Math.floor(Math.random() * 12);
    let n2 = Math.floor(Math.random() * 12);
    let question = n1.toString() + " x " + n2.toString() + " = ?";
    let answer = (n1 * n2).toString();
    cards.push(new Card("text_answer", question, answer, {"metadata" : "example"}));
  }
    return cards;
  }
  let user = new User("main_user", "Craig Krikorian", [33], [234,343], {});
  let example_decks = [];
  for(let i = 0 ; i < 10 ; ++i) {
    let deck = new Deck(i.toString(), "Math", makeCards(20), user )
    example_decks.push(deck);
    await addDeck(deck);
  }
  
  for(let i = 0 ; i < example_decks.length ; ++i) {
    user.metadata[example_decks[i].id] = {"timeLastStudied" : 0 , "timesStudied" : 0, "beingStudied" : false};
  }
  
  let added_user_to_db = await addUser(user);
  await User.estabilishLocalStorage(user.id);
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


