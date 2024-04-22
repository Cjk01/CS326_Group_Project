import { User } from "../structures/user.js";
import { Deck } from "../structures/deck.js";

/**
 * This function is called once (in main.js).
 * It loads the study page if the user clicks on the page directly (as opposed to studying a deck specifically)
 * @returns {Element} - The study view page
 * @todo Add general study page if 1 or more decks is actively being studied
*/
export function loadGeneralStudyPageView() {
    let study_view = document.createElement("div");
    study_view.setAttribute("id", "StudyView");
    study_view.className = "view";

    let decks = User.getActiveDecks(true, true, true);

    if (decks.length === 0) { // Edge Case: No decks actively being studied as of yet
        study_view.innerText = "Please select a Deck to study from your Decks!";
    } else {
        // TODO General Study Page here
        study_view.innerText = "ACTUAL STUDY CONTENT HERE LMAO";
    }

    return study_view;
}

/**
 * This function is called once (in entry.js).
 * It loads the study page if the user clicks on study from a deck entry (as opposed to clicking the general study page)
 * @param {Deck} deck - The specific deck whose entry was clicked on
 * @returns {Element} - The study view page
*/
export function loadDeckSpecificStudyPageView(deck) {
    let study_view = document.createElement("div");
    study_view.setAttribute("id", "StudyView");
    study_view.className = "view";

    let decks = User.getActiveDecks(true, true, true);

    if (decks.length === 0) { // Edge Case: No decks actively being studied as of yet
        study_view.innerText = "Please select a Deck to study from your Decks!";
    } else {
        // TODO General Study Page here
        study_view.innerText = "ACTUAL STUDY CONTENT HERE LMAO";
    }

    return study_view;
}
