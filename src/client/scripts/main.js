import {User} from "./structures/user.js";
import * as data from "../scripts/data_interface/data.js";



console.log("main.js loading");
let add_user = await data.addUser(new User(Math.floor(Math.random() * 1000), "test", {"metadata" : "test"}, ["test2"], ["test3"]));
console.log(add_user);
let get_user = await data.getUser(1);
console.log(get_user);

//testing batch data loader
let loadFakeUsers = await data.loadBatchTestData();
console.log(loadFakeUsers);


