//this is the http server that our application will use to interact with pouchDB

import * as http from "http";
import * as url from "url";
import * as db from "./db.js";

const headerFields = { "Content-Type": "text/html" };

/**
 * 
 * @param {http.IncomingMessage} request - The http request message
 * @param {http.ServerResponse} response - the http response message
 * This function is essentially the main loop of the server
 * Each url path corresponds to some data manipulation function 
 * Interacts with PouchDB
 */
async function cachelyDataServer(request, response) {

  console.log(request.url);
  response.writeHead(200, headerFields);
  response.write("<h1>Hello</h1>");
  response.end();

  if(request.url.startsWith("/user")){

  }
  else if(request.url.startsWith("/deck")) {

  }
  

}

http.createServer(cachelyDataServer).listen(3470, () => {
    console.log("Server started on port 3470");
  });