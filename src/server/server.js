//this is the http server that our application will use to interact with pouchDB

import * as http from "http";
import * as url from "url";
import * as db from "./db.js";

const text_headers = { "Content-Type": "text/html" ,"Access-Control-Allow-Origin": "*"};
const json_headers = {"Content-Type" : "application/json", "Access-Control-Allow-Origin": "*"};



/**
 * 
 * @param {http.IncomingMessage} request - The http request message
 * @param {http.ServerResponse} response - the http response message
 * This function is essentially the main loop of the server
 * Each url path corresponds to some data manipulation function 
 * Interacts with PouchDB
 */
async function cachelyDataServer(request, response) {
  const query_params = url.parse(request.url, true).query;

  try {
  if(request.url.startsWith("/user")){

  }
  else if(request.url.startsWith("/deck")) {

  }
  else {
    //the default case is for the server to respond with database info
    let dbinfo = await db.logDatabaseInformation();
    response.writeHead(200, json_headers);
    response.write(JSON.stringify(dbinfo));
    response.end();
  }
}
catch(err) {
    console.log(err);
}


}

http.createServer(cachelyDataServer).listen(3470, () => {
    console.log("Server started on port 3470");
  });