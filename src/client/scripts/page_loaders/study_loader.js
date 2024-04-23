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

        final_study_view.innerHTML = ""; // Resets study page
    }

    if (deck === null) {
        // TODO - Add general study functionality later
        final_study_view.innerText = "Please select a Deck to study from your Decks!";
    } else {
        // Specific Study Page here
        //final_study_view.innerText= "Specific Study Page Entry Clicked here!" + JSON.stringify(deck);
        /*
        Algorithm:
        -1) Define correct and incorrect for deck summary stats at the end
        0) Load a check and cross icon at the bottom
        1) while(card != last)
            a) Render the card
            b) Add event handler to switch to new card when either check or cross is clicked
        2) Render the summary stats and ask user to click on another deck to study
        */
        let correct = 0;
        let incorrect = 0;
        let cardIdx = 0;

        let card = generateCard(deck.cards[cardIdx]);

        const correctButton = document.createElement("button");
        correctButton.setAttribute("id", "correct-button");
        correctButton.setAttribute("class", "studyButton");
        correctButton.innerText = "Correct";

        const incorrectButton = document.createElement("button");
        incorrectButton.setAttribute("id", "incorrect-button");
        incorrectButton.setAttribute("class", "studyButton");
        incorrectButton.innerText = "Incorrect";

        correctButton.addEventListener("click", () => {
            ++correct;
            ++cardIdx;

            // Remove the old card from the DOM
            final_study_view.removeChild(card);

            // Create a new card and add it to the DOM
            card = generateCard(deck.cards[cardIdx]);
            final_study_view.prepend(card); // Add before the buttons
        });

        incorrectButton.addEventListener("click", () => {
            ++incorrect;
            ++cardIdx;

            // Remove the old card from the DOM
            final_study_view.removeChild(card);

            // Create a new card and add it to the DOM
            card = generateCard(deck.cards[cardIdx]);
            final_study_view.prepend(card); // Add before the buttons
        });


        final_study_view.append(card);
        final_study_view.append(correctButton);
        final_study_view.append(incorrectButton);
    }

    return final_study_view;
}
