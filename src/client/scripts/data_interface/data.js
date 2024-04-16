//this is where all functions used to interact with the server are stored
//these are meant to be transparent to the user so that api calls can be made easily 
//by the front end

import { User } from "../structures/user.js";

const server_base_url = "http://localhost:3470/"
const json_headers = {"Content-Type" : "application/json", "Access-Control-Allow-Origin": "*"};
const text_headers = { "Content-Type": "text/html" ,"Access-Control-Allow-Origin": "*"};

/**
 * 
 * @param {User} user - The user to be added to the database
 * constructs and sends the http request to add a user to the database 
 * 
 */
export async function addUser(user) {
    let headers = new Headers();
    headers.append("Content-Type", "text/html");
    let response = await fetch(server_base_url + "users", {"headers": headers, method: "POST", body: JSON.stringify(user)});
    let response_json = response.json();
    return response_json;
   
}

export async function getUser(user_id) {
  let headers = new Headers();
  headers.append("Content-Type", "text/html");
  let response = await fetch(`${server_base_url}users?id=${user_id}` , {headers: headers, method: "GET"});
  let response_json = response.json();
  return response_json;
}


//TODO
export async function addDeck() {

}
//TODO
export async function getDeck() {

}


/**
 * 
 * @returns {Object} - {users: user db info, decks: deck db info} obtained from logDatabaseInformation()
 * This function is used to load our pouchDB store with fake data 
 * to satisfy the mock data requirements for milestone-02.
 * This will not be needed once we move forward to milestone-03
 * Makes use of the https://randomuser.me/documentation#howto api
 */
export async function loadBatchTestData() {
  
  //fetch fake user data in bulk from api
  let fakeUsersRequest = await fetch("https://randomuser.me/api?results=500"); //fetch 500 fake users
  let fakeUsersJson = await fakeUsersRequest.json();
  let fakeUsersArray = fakeUsersJson.results;
  let fakeUsersPromises = fakeUsersArray.map(user => addUser(new User(user["login"]["uuid"], user["login"]["username"],{"meta" : 3}, ["test"], ["test"])));
  let fullyResolved = await Promise.all(fakeUsersPromises).then((resolverObject)=>console.log(resolverObject));
  return fullyResolved; //This was just used for testing users, needs to be removed later

  /**
   * TODO
   * Here, A similar thing needs to be done for loading test deck data 
   * via an unimplemented addDeck function
   */

  /**
   * TODO
   * Now, a final http request needs to be made to the server (on an empty path /)
   * To get the results of logDatabaseInfo, which is then returned to user
   */
}