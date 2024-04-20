


import { getDeck } from "../data_interface/data.js";
import { generateDeckEntry } from "../generators/entry_generators.js";
import { User } from "../structures/user.js";
import {Card} from "../structures/card.js";

/**
 * This function is called once (in main.js)
 * It loads the basic structure of the decks view
 * This content is then updated by updateDecksView
 * @returns {Element} - The decks view page
 * 
 */

export async function loadDecksView() {

    let active_user = User.getActiveUser();

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

    //adding event listeners to the buttons to load filtered subset of decks

    your_decks_button.addEventListener("click", () => {
        console.log("Clicked Your Decks Button");
    });

    saved_decks_button.addEventListener("click", () => {
        console.log("Clicked Saved Decks Button");
    });

    create_deck_button.addEventListener("click" , () => {
      loadCreateNewDeckView();
});

  


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
    //this is equivalent to clicking "Your Decks"

    await active_user.getDecks(true, false, false, true, false).then(decks => decks.forEach(deck => user_decks_container.appendChild(generateDeckEntry(deck))));
    
 
    
    //the container of the entire page view
    let decks_view = document.createElement("div");
    decks_view.setAttribute("id", "DecksView");
    decks_view.classList.add("view");
    decks_view.appendChild(decks_button_container);
    decks_view.appendChild(user_decks_container);
    
    return decks_view;
}



/**
 * loads the view where the user enters a deck name and hits "Create"
 * Which takes them to the modify deck view
 */

export async function loadCreateNewDeckView() {

    //clearing the user decks container
    let user_decks_container = document.getElementById("user-decks-container");
    while(user_decks_container.firstChild) {
        user_decks_container.removeChild(user_decks_container.firstChild);
    }

    let create_new_deck_view = document.createElement("div");
    create_new_deck_view.setAttribute("id", "create-new-deck-view");

    let deckname_input_label = document.createElement("label");
    deckname_input_label.setAttribute("for", "deckname");
    deckname_input_label.innerHTML = "Enter Your Deck Name";
    let deckname_input = document.createElement("input");
    deckname_input.setAttribute("id", "deckname-input");
    deckname_input.setAttribute("type", "text");
    deckname_input.setAttribute("name", "deckname");

    let submit_deck_button = document.createElement("input");
    submit_deck_button.setAttribute("id", "submit-deck-button");
    submit_deck_button.setAttribute("type", "button");
    submit_deck_button.setAttribute("value" , "Create Deck");

    submit_deck_button.addEventListener("click", () => {
        // TODO
        //add a new deck to the database with the given name
        //add this new deck to the user's list of decks
        loadModifyDeckView(document.getElementById("deckname-input").value);
    });

    create_new_deck_view.appendChild(deckname_input_label);
    create_new_deck_view.appendChild(deckname_input);
    create_new_deck_view.appendChild(submit_deck_button);

    user_decks_container.appendChild(create_new_deck_view);
    

}

/**
 * loads the deck creation view within the decks page
 * removes all content from the decks view, injects the deck creator
 */
export async function loadModifyDeckView(deckname) {

   //clearing the user decks container
   let user_decks_container = document.getElementById("user-decks-container");
   while(user_decks_container.firstChild) {
       user_decks_container.removeChild(user_decks_container.firstChild);
   }

    //deck modification page consists of a deck preview pane, two input boxes for question/answer contents, and a submission field
    let deck_creation_page = document.createElement("div");
    deck_creation_page.setAttribute("id", "deck-creation-page");

    let deck_preview_pane = document.createElement("div");
    deck_preview_pane.setAttribute("id", "deck-preview-pane");

    let question_input_label = document.createElement("label");
    question_input_label.setAttribute("for", "question");
    question_input_label.innerHTML = "Question";
    let question_input = document.createElement("input");
    question_input.setAttribute("id", "question-input");
    question_input.setAttribute("type", "text");
    question_input.setAttribute("name", "question");

    let answer_input_label = document.createElement("label");
    answer_input_label.setAttribute("for", "answer");
    answer_input_label.innerHTML = "Answer";
    let answer_input = document.createElement("input");
    answer_input.setAttribute("id", "answer");
    answer_input.setAttribute("type", "text");
    answer_input.setAttribute("name", "answer");


    //the submission button for adding a card to the deck being modified

    let add_card_button = document.createElement("input");
    add_card_button.setAttribute("id", "add-card-button");
    add_card_button.setAttribute("type", "button");
    add_card_button.setAttribute("value" , "Add Card");

    //add event listener to the button
    add_card_button.addEventListener("click" , () => {
        console.log("Adding card to deck ... ");
    });

    deck_creation_page.appendChild(question_input_label);
    deck_creation_page.appendChild(question_input);
    deck_creation_page.appendChild(answer_input_label);
    deck_creation_page.appendChild(answer_input);
    deck_creation_page.appendChild(add_card_button);
    deck_creation_page.appendChild(deck_preview_pane);

    user_decks_container.appendChild(deck_creation_page);
    

}


/**
 * TODO (maybe not necessary?? idk)
 * This function dynamically updates the content of the page
 * It makes use of localstorage if needed (not via pouchDB, as we want to only use pouchDB for what will later be replaced by a remote server)
 * 
 */

export function updateDecksView() {

}