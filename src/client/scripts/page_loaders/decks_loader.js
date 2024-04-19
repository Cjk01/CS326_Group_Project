
/**
 * This function is called once (in main.js)
 * It loads the basic structure of the decks view
 * This content is then updated by updateDecksView
 * @returns {Element} - The decks view page
 * 
 */

import { getDeck } from "../data_interface/data.js";
import { generateDeckEntry } from "../generators/entry_generators.js";

export async function loadDecksView() {

    //the buttons (your decks, saved decks, create deck)
    let your_decks_button = document.createElement("input");
    your_decks_button.setAttribute("type", "button");
    your_decks_button.setAttribute("value", "Your Decks");

    let saved_decks_button = document.createElement("input");
    saved_decks_button.setAttribute("type", "button");
    saved_decks_button.setAttribute("value", "Saved Decks");

    let create_deck_button = document.createElement("input");
    create_deck_button.setAttribute("type", "button");
    create_deck_button.setAttribute("value", "Create Deck");

    //container holding all of the buttons
    let decks_button_container = document.createElement("div");
    decks_button_container.setAttribute("id", "decks-button-container");
    decks_button_container.appendChild(your_decks_button);
    decks_button_container.appendChild(saved_decks_button);
    decks_button_container.appendChild(create_deck_button);

    // the container of deck previews (your decks, saved decks)
    let user_decks_container = document.createElement("div");
    user_decks_container.setAttribute("id", "user-decks-container");
    
    //load all of the active user's decks (should be set prior)
    let active_user_raw = localStorage.getItem("active-user");
    let active_user = JSON.parse(active_user_raw);
    Object.keys(active_user.metadata).forEach(async deck_id => {
       let deck = await getDeck(deck_id); 
       let deck_entry = generateDeckEntry(deck);
       user_decks_container.appendChild(deck_entry);

    });
 
    
    //the container of the entire page view
    let decks_view = document.createElement("div");
    decks_view.setAttribute("id", "DecksView");
    decks_view.classList.add("view");
    decks_view.appendChild(decks_button_container);
    decks_view.appendChild(user_decks_container);
    
    return decks_view;
}


/**
 * TODO (maybe not necessary?? idk)
 * This function dynamically updates the content of the page
 * It makes use of localstorage if needed (not via pouchDB, as we want to only use pouchDB for what will later be replaced by a remote server)
 * 
 */

export function updateDecksView() {

}