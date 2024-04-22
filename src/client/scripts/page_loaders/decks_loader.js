


import { getDeck, addDeck, updateDeck } from "../data_interface/data.js";
import { generateDeckEntry } from "../generators/entry_generators.js";
import { generateCard } from "../generators/card_generator.js";
import { User } from "../structures/user.js";
import {Card} from "../structures/card.js";
import { Deck } from "../structures/deck.js";

/**
 * This function is called once (in main.js)
 * It loads the basic structure of the decks view
 * This content is then updated by updateDecksView
 * @returns {Element} - The decks view page
 * 
 */

export async function loadDecksView() {

        
    //the container of the entire page view
    let decks_view = document.createElement("div");
    decks_view.setAttribute("id", "DecksView");
    decks_view.classList.add("view");
    decks_view.innerHTML = 
    `
    <div id="decks-button-container"> 
    <input id="your-decks-button" type="button" value="Your Decks"/>
    <input id="saved-decks-button" type="button" value="Saved Decks"/>
    <input id="create-deck-button" type="button" value="Create Deck"/>
    </div>
    <div id="user-decks-container"> </div>
    `;

    //load all of the active user's decks (should be set prior)
    //this is equivalent to clicking "Your Decks"
    await User.getActiveUser().getDecks(true, false, false, true, false).then(decks => decks.forEach(deck => decks_view.querySelector("#user-decks-container").appendChild(generateDeckEntry(deck))));
    
    //adding event listeners to the buttons to load filtered subset of decks

    decks_view.querySelector("#your-decks-button").addEventListener("click", async () => {
        await populateDecksContainer(true);
    });

    decks_view.querySelector("#saved-decks-button").addEventListener("click", async () => {
        await populateDecksContainer(false);
    });

    decks_view.querySelector("#create-deck-button").addEventListener("click" , async () => {
      await loadCreateNewDeckView();
    });


    return decks_view;
}
/**
 * helper function which populates the decks container with
 * cards depending on which option (filter) is selected
 * (Your Decks -> true , Saved Decks -> false)
 * @param {boolean} filter - true for your decks, false for saved decks
 */
export async function populateDecksContainer(filter) {

    //removing all of the current decks entries within the decks container
    let user_decks_container = document.getElementById("user-decks-container");
    while(user_decks_container.firstChild) {
        user_decks_container.removeChild(user_decks_container.firstChild);
    }

    
    await User.getActiveUser().getDecks(true, false, false, filter, !filter).then(decks => decks.forEach(deck => user_decks_container.appendChild(generateDeckEntry(deck))));
    

}

export async function populateDeckPreviewPane(deck) {
    let preview_pane = document.getElementById("deck-preview-pane");
    while(preview_pane.firstChild) {
        preview_pane.removeChild(preview_pane.firstChild);
    }
    deck.cards.forEach(card => preview_pane.appendChild(generateCard(card)));
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

    user_decks_container.innerHTML = 
    `
    <div id="create-new-deck-view">
    <label for="deckname">Enter Your Deck Name</label> 
    <input id="deckname-input" type="text" name="deckname"/>
    <input id="submit-deck-button" type="button" value="Create Deck"/>
    </div>
    `;
    document.getElementById("submit-deck-button").addEventListener("click", async () => {
        // TODO
        //Refactor this logic of adding deck to db plus updating user to a predefined function
        // it should create a new blank deck, add it to the decks db, and register it with the current active user
        let active_user = User.getActiveUser();
        let new_deck_name = document.getElementById("deckname-input").value;
        let new_deck_uuid = await fetch("https://randomuser.me/api").then(resp => resp.json().then(data => data.results[0]["login"]["uuid"]));
        let new_deck = new Deck(new_deck_uuid, new_deck_name , [], active_user);
        await addDeck(new_deck);
        active_user.registerDeck(new_deck);
        loadModifyDeckView(new_deck_uuid);
    });
   

}

/**
 * loads the deck creation view within the decks page
 * removes all content from the decks view, injects the deck creator
 */
export async function loadModifyDeckView(deck_id) {

   //clearing the user decks container
   let user_decks_container = document.getElementById("user-decks-container");
   while(user_decks_container.firstChild) {
       user_decks_container.removeChild(user_decks_container.firstChild);
   }

   let deck_to_modify = await getDeck(deck_id);

   user_decks_container.innerHTML = 
   `
   <div id="deck-creation-page">
   <label for="question" >Question</label>
   <input id="question-input" type="text" name="question"/>
   <label for="answer">Answer</label>
   <input id="answer-input" type="text" name="answer"/>
   <input id="add-card-button" type="button" value="Add Card" />
   <div id="deck-preview-pane"> </div>
  
   </div>
   `;

    //add event listener to the button
    document.getElementById("add-card-button").addEventListener("click" , async () => {
        console.log("Adding card to deck ... ");
        // add the card to the selected deck
        deck_to_modify.cards.push(new Card("text", document.getElementById("question-input").value, document.getElementById("answer-input").value, {}));
        await updateDeck(deck_to_modify);
        //populate the view of the current deck in the preview pane
        populateDeckPreviewPane(deck_to_modify);
        
    });

}


/**
 * TODO (maybe not necessary?? idk)
 * This function dynamically updates the content of the page
 * It makes use of localstorage if needed (not via pouchDB, as we want to only use pouchDB for what will later be replaced by a remote server)
 * 
 */

export function updateDecksView() {

}