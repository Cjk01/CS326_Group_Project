/**
 * This file is where all of the loaders within page_loaders are called to generate the entire page and inject it into the body
 * this is where the logic including the state of the application will be handled (multi view ui logic)
 */

const server_base_url = "http://localhost:3470/"


console.log("main.js loading");
fetch(server_base_url).then(res => res.json().then(data => console.log(data))); 

