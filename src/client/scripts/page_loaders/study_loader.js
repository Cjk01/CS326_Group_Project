import { User } from "../structures/user.js";

/**
 * This function is called once (in main.js).
 * It loads the study page if the user clicks on the page directly (as opposed to studying a deck specifically)
 * @returns {Element} - The study view page
*/
export async function loadGeneralStudyPageView() {
    let study_view = document.createElement("div");
    study_view.setAttribute("id", "StudyView");
    study_view.className = "view";

    let decks = User.getActiveDecks(true, true, true);

    if (decks.length === 0) { // Edge Case: No decks actively being studied as of yet
        study_view.innerText = "Please select a deck to study from your Decks!";
    } else {
        study_view.innerText = "ACTUAL STUDY CONTENT HERE LMAO";
    }

    return study_view;
}
