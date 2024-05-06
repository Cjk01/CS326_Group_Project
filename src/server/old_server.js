
import * as http from "http";
import * as url from "url";
import * as db from "./db.js";



//the headers in all cases must include Access-Control-Allow-Origin since we host our database on a different port locally
//if the header does not include this, the client will receive an error
const text_headers = { "Content-Type": "text/html" ,"Access-Control-Allow-Origin": "*"};
const json_headers = {"Content-Type" : "application/json", "Access-Control-Allow-Origin": "*"};
const satisfy_cors_headers = {"Access-Control-Allow-Methods" : "GET, POST, PATCH, PUT, DELETE, OPTIONS" , 
"Access-Control-Allow-Headers" : "Origin, Content-Type, X-Auth-Token", "Access-Control-Allow-Origin": "*"}


/**
 * 
 * @param {http.IncomingMessage} request - the reuqest object from our server function 
 * @returns {Promise} - promise resolving to our http request body
 * A very primitive method of parsing the body from the http request using the event stream
 * (There is no built-in method to do this for some reason?)
 */

async function getRequestBody(request) {
    return new Promise((resolve) => {
    let body = "";
    request.on('data', (data_chunk) => {
        body += data_chunk;
    });
    request.on('end', () => {
        console.log(body); 
        resolve(body);
    });

    });
}

/**
 * 
 * @param {http.IncomingMessage} request - The http request message
 * @param {http.ServerResponse} response - the http response message
 * This function is essentially the main loop of the server
 * Each url path corresponds to some data manipulation function 
 * Interacts with PouchDB
 */
async function cachelyDataServer(request, response) {
  console.log(` URL: ${request.url} \n Method: ${request.method} \n Headers: ${request.headers}`);
  const body = await getRequestBody(request);
  const parsed_url = url.parse(request.url, true);
  const query_params = parsed_url.query;

  try {
  if(request.method === "OPTIONS") {
    //this means that a CORS preflight request was made, the server must respond letting the client know it accepts cross origin requests
    response.writeHead(200, satisfy_cors_headers);
    response.end();
  }
  else if(request.url.startsWith("/users")){

    if(request.method === "POST"){
        let response_obj = await db.addUserToDatabase(JSON.parse(body));
        response.writeHead(200, text_headers);
        response.write(JSON.stringify(response_obj));
        response.end();    
    }

    if(request.method === "GET"){
        let response_obj = await db.getUserByID(query_params.id);
        response.writeHead(200, text_headers);
        response.write(JSON.stringify(response_obj));
        response.end();    
    }

    if(request.method === "PUT") {
      let response_obj = await db.updateUserInDatabase(JSON.parse(body));
      response.writeHead(200, text_headers);
      response.write(JSON.stringify(response_obj));
      response.end();   

    }

    if(request.method === "DELETE") {
      let response_obj = await db.deleteUserFromDatabase(query_params.id);
      response.writeHead(200, text_headers);
      response.write(JSON.stringify(response_obj));
      response.end();   

    }

  }
  else if(request.url.startsWith("/decks")) {

    if(request.method === "POST") {
      let response_obj = await db.addDeckToDatabase(JSON.parse(body));
      response.writeHead(200, text_headers);
      response.write(JSON.stringify(response_obj));
      response.end();
    }

    if(request.method === "GET") {
      let response_obj = await db.getDeckByID(query_params.id);
      response.writeHead(200, text_headers);
      response.write(JSON.stringify(response_obj));
      response.end();
    }

    if(request.method === "PUT") {
      let response_obj = await db.updateDeckInDatabase(JSON.parse(body));
      response.writeHead(200, text_headers);
      response.write(JSON.stringify(response_obj));
      response.end();   

    }
  
    if(request.method === "DELETE") {
      let response_obj = await db.deleteDeckFromDatabase(query_params.id);
      response.writeHead(200, text_headers);
      response.write(JSON.stringify(response_obj));
      response.end();   

    }


  }

  else if(request.url.startsWith("/clear_databases")) {
    let response_obj = await db.clearDatabases();
    response.writeHead(200, text_headers);
    response.write(JSON.stringify(response_obj));
    response.end();
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