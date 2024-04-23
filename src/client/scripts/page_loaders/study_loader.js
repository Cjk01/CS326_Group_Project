import { User } from "../structures/user.js";
import { Deck } from "../structures/deck.js";
import { generateCard } from "../generators/card_generator.js";

/**
 * This function is called in main.js.
 * It loads the study page directly if the user clicks on it or with the deck if clicked on its entry
 * @param {deck} deck - Optional deck specified if user clicks on its entry
 * @returns {Element} - The study view page
 * @todo Add general study page if 1 or more decks is actively being studied
*/
export function loadStudyPageView(deck = null) {
    const check_study_view = document.querySelector("div#StudyView");
    let final_study_view = null;

    if (check_study_view === null) {
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
