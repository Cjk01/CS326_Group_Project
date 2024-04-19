import { generateNavbar } from "./generators/navbar_generator.js"
import { loadHomepageView } from "./page_loaders/homepage_loader.js";
import {loadDecksView} from "./page_loaders/decks_loader.js"
import { loadProfileView } from "./page_loaders/profile_loader.js";
import { addUser, clearDatabases, configureDatabaseForMilestoneTwo, loadBatchTestData, testDatabaseOperations, updateUser } from "./data_interface/data.js";
import { User } from "./structures/user.js";


await clearDatabases();
await configureDatabaseForMilestoneTwo();



let body = document.getElementById("body");
//create and append the navbar element to the body of the page
generateNavbar( {"Home" : "#", "Decks" : "#", "Profile": "#"}, body);

//create the view container, and add it after the navbar
let views = document.createElement("div");
views.setAttribute("id", "views");
body.appendChild(views);

//add all view pages as children of the views element
let hpview = await loadHomepageView();
let dview = await loadDecksView();
let pview = await loadProfileView();
views.appendChild(hpview);
views.appendChild(dview);
views.appendChild(pview);

//setting up the multiview UI logic 
const links = document.querySelectorAll(".navbarLink");
const all_views = document.querySelectorAll(".view");
const navigate = (view_id) => all_views.forEach(v => v.id === view_id ? v.style.display = "block" : v.style.display = "none");
links.forEach(l => l.addEventListener("click", (e) => {
    e.preventDefault(); //prevent the default behavior of page reload when clicking
    navigate(e.target.id); 
}));

//navigate to the default page upon page load
navigate("HomeView");











