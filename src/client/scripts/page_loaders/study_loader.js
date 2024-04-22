import { User } from "../structures/user.js";

/**
 * This function is called once (in main.js).
 * It loads the study page if the user clicks on the page directly (as opposed to studying a deck specifically)
 * @returns {Element} - The study view page
*/
export async function loadGeneralStudyPageView() {
    // Get current user data
    const decks = User.getActiveDecks(true, true, true);

    console.log(`THESE ARE THE DECKS: ${decks}`);


    let study_view = document.createElement("div");
    study_view.setAttribute("id", "GeneralStudyView");
    study_view.innerHTML = `

    `;
}

loadGeneralStudyPageView();
