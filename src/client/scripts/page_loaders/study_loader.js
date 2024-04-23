import { User } from "../structures/user.js";
import { Deck } from "../structures/deck.js";
import { generateCard } from "../generators/card_generator.js";

/**
 * This function is called once (in main.js).
 * It loads the study page if the user clicks on the page directly (as opposed to studying a deck specifically)
 * @returns {Element} - The study view page
 * @todo Add general study page if 1 or more decks is actively being studied
*/
export function loadGeneralStudyPageView(deck = null) {
    const check_study_view = document.querySelector("div#StudyView");
    let final_study_view = null;

    if (check_study_view === null || check_study_view.tagName !== "DIV") {
        final_study_view = document.createElement("div");
        final_study_view.setAttribute("id", "StudyView");
        final_study_view.className = "view";
    } else {
        final_study_view = check_study_view;
    }

    if (deck === null) {
        let decks = User.getActiveDecks(true, true, true);

        if (decks.length === 0) { // Edge Case: No decks actively being studied as of yet
            final_study_view.innerText = "Please select a Deck to study from your Decks!";
        } else {
            // TODO General Study Page here
            final_study_view.innerText = "ACTUAL STUDY CONTENT HERE LMAO";
        }
    } else {
        // Specific Study Page here
        final_study_view.innerText= "Specific Study Page Entry Clicked here!" + JSON.stringify(deck);
    }

    return final_study_view;
}

/**
 * This function is called once (in entry.js).
 * It loads the study page if the user clicks on study from a deck entry (as opposed to clicking the general study page)
 * @param {Deck} deck - The specific deck whose entry was clicked on
 * @returns {Element} - The study view page
 * @todo Update study_loader.js to handle using the same view for the study(same StudyView ID) regardless of how you enter the Study Page
*/
export function loadDeckSpecificStudyPageView(deck) {
    const user = User.getActiveUser();
    const isDeckFreshlyRegistered = user.registerDeck(deck);



    let study_view = document.createElement("div");

    study_view.setAttribute("id", "StudyView");

    study_view.appendChild(generateCard(deck.cards[0]));

    return study_view;
}
