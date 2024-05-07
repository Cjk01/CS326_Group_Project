


import { getDeck, addDeck, updateDeck, deleteDeck } from "../data_interface/data.js";
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
    <input id="your-decks-button" class="cool-green-button" type="button" value="Your Decks"/>
    <input id="saved-decks-button" class="cool-green-button" type="button" value="Saved Decks"/>
    <input id="create-deck-button" class="cool-green-button" type="button" value="Create Deck"/>
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

export function populateDeckPreviewPane(deck, card_number) {
    let card_container = document.getElementById("card-container");
    card_container.current_card = card_number;
    while(card_container.firstChild) {
        card_container.removeChild(card_container.firstChild);
    }
    card_container.appendChild(generateCard(deck.cards[card_number]));

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
    <input id="submit-deck-button" class="cool-green-button" type="button" value="Create Deck"/>
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
 * @param {int} deck_id - the deck id of the deck which is loaded in
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
   <textarea rows="6" id="question-input"  name="question"> </textarea>
   <label for="answer">Answer</label>
   <textarea rows="6" id="answer-input" name="answer"> </textarea>
   <input id="add-card-button" class="cool-green-button" type="button" value="Add Card" />
   <div id="deck-preview-pane">
    <div id="card-container"> </div>
   </div>
    <input type="button" class="cool-green-button" id="move-backwards-button" value="<" />
    <input type="button" class="cool-green-button" id="move-forward-button" value=">" />
  
   </div>
   `;

   document.getElementById("card-container").current_card = 0;

   document.getElementById("move-forward-button").addEventListener("click", () => {
     let current_card = document.getElementById("card-container").current_card;
     populateDeckPreviewPane(deck_to_modify, current_card + 1 === deck_to_modify.cards.length ? 0 : current_card + 1);
   });

   document.getElementById("move-backwards-button").addEventListener("click", () => {
     let current_card = document.getElementById("card-container").current_card;
     populateDeckPreviewPane(deck_to_modify, current_card - 1 === -1 ? deck_to_modify.cards.length - 1 : current_card - 1);
   });
    //add event listener to the button
    document.getElementById("add-card-button").addEventListener("click" , async () => {
        console.log("Adding card to deck ... ");
        // add the card to the selected deck
        deck_to_modify.cards.push(new Card("text", document.getElementById("question-input").value, document.getElementById("answer-input").value, {}));
        await updateDeck(deck_to_modify);
        //populate the view of the current deck in the preview pane
        populateDeckPreviewPane(deck_to_modify, deck_to_modify.cards.length - 1);
        
    });

}

/**
 * This function injects the html and rigs event listeners for the preview pane
 * that is shown on the deck view page 
 * The html is injected into the user-decks-container 
 * @param {Deck} deck - The deck which is shown in the preview pane
 */
export function loadDeckPreview(deck) {
    document.getElementById("navbar").childNodes[0].childNodes[4].childNodes[0].click();

    //clearing the user decks container
    let user_decks_container = document.getElementById("user-decks-container");
    while(user_decks_container.firstChild) {
        user_decks_container.removeChild(user_decks_container.firstChild);
    }

    let activeUser = User.getActiveUser();

    
   
   document.getElementById("navbar").childNodes[0].childNodes[2].childNodes[0].click();
   

    user_decks_container.innerHTML = 
   `
   <div id="deck-creation-page">
   <p>Deck ID: ${deck.id}</p>
   <input id="addDel-button" type="button" value="Add">
   <div id="deck-preview-pane">
    <div id="card-container"> </div>
   </div>
   <br>
    <input type="button" class="cool-green-button" id="move-backwards-button" value="<" />
    <input type="button" class="cool-green-button" id="move-forward-button" value=">" />
  
   </div>
   `;

    document.getElementById("card-container").current_card = 0;

    document.getElementById("move-forward-button").addEventListener("click", () => {
        let current_card = document.getElementById("card-container").current_card;
        populateDeckPreviewPane(deck, current_card + 1 === deck.cards.length ? 0 : current_card + 1);
    });

    document.getElementById("move-backwards-button").addEventListener("click", () => {
        let current_card = document.getElementById("card-container").current_card;
        populateDeckPreviewPane(deck, current_card - 1 === -1 ? deck.cards.length - 1 : current_card - 1);
    });

    populateDeckPreviewPane(deck, 0);

    let addDelButton = user_decks_container.querySelector("#deck-creation-page").querySelector("#addDel-button");

    if (deck.creator.id === User.getActiveUser().id) {
        addDelButton.value = "Delete";
        addDelButton.addEventListener("click", async () => {
            addDelButton.value = "Pending";
            await activeUser.deleteOwnedDeck(deck);
            populateDecksContainer(true);
        });
    } else if (Object.keys(activeUser.metadata).includes(deck.id)) {
        addDelButton.value = "Already added";
        addDelButton.disabled = true; 
    } else {
        addDelButton.addEventListener("click", async () => {
            addDelButton.value = "Pending";
            await activeUser.registerDeck(deck);
            addDelButton.value = "Added";
            addDelButton.disabled = true;
        }) 
    }
}
