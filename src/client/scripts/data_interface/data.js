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
  let response = await fetch(`${server_base_url}users?id=${user_id}` , {headers: text_headers, method: "GET"});
  return response;
}