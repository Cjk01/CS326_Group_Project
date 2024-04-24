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
        let correct = 0;
        let incorrect = 0;
        let cardIdx = 0;

        let card = generateCard(deck.cards[cardIdx]);

        const correctButton = document.createElement("button");
        correctButton.setAttribute("id", "correct-button");
        correctButton.setAttribute("class", "studyButton");
        correctButton.innerText = "Correct";
        correctButton.style.visibility = "hidden"; // Hidden to start until user clicks on flashcard

        const incorrectButton = document.createElement("button");
        incorrectButton.setAttribute("id", "incorrect-button");
        incorrectButton.setAttribute("class", "studyButton");
        incorrectButton.innerText = "Incorrect";
        incorrectButton.style.visibility = "hidden"; // Hidden to start until user clicks on flashcard

        correctButton.addEventListener("click", () => {
            // Hide both buttons until next flashcard is clicked
            correctButton.style.visibility = "hidden"; // Hidden to start until user clicks on flashcard
            incorrectButton.style.visibility = "hidden"; // Hidden to start until user clicks on flashcard

            // Update relevant card metadata
            ++correct;
            ++cardIdx;

            // Remove the old card from the DOM
            final_study_view.removeChild(card);

            // Displays final metadata if we've finished going through all cards
            if (cardIdx === deck.cards.length) {
                const finalDeckOutput = document.createElement("div");

                finalDeckOutput.innerHTML = `
                <h2>Deck Summary:</h2>
                <strong>Correct: </strong>${correct} <br>
                <strong>Incorrect: </strong>${incorrect} <br>
                <strong>Incorrect: </strong>${incorrect} <br>
                <strong>Percent: </strong>${Math.trunc(correct/((correct + incorrect !== 0 ? correct + incorrect : 1)) * 100)}% <br><br>
                Learning has never been more fun! Please choose another Deck from your Decks to keep it up!
                `;

                final_study_view.prepend(finalDeckOutput);
            } else {
                // Create a new card and add it to the DOM
                card = generateCard(deck.cards[cardIdx]);
                final_study_view.prepend(card); // Add before the buttons
            }
        });

        incorrectButton.addEventListener("click", () => {
            // Hide both buttons until next flashcard is clicked
            correctButton.style.visibility = "hidden"; // Hidden to start until user clicks on flashcard
            incorrectButton.style.visibility = "hidden"; // Hidden to start until user clicks on flashcard

            // Update relevant card metadata
            ++incorrect;
            ++cardIdx;

            // Remove the old card from the DOM
            final_study_view.removeChild(card);

            // Displays final metadata if we've finished going through all cards
            if (cardIdx === deck.cards.length) {
                const finalDeckOutput = document.createElement("div");

                finalDeckOutput.innerHTML = `
                <h2>Deck Summary:</h2>
                <strong>Correct: </strong>${correct} <br>
                <strong>Incorrect: </strong>${incorrect} <br>
                <strong>Percent: </strong>${Math.trunc(correct/((correct + incorrect !== 0 ? correct + incorrect : 1)) * 100)}% <br><br>
                Learning has never been more fun! Please choose another Deck from your Decks to keep it up!
                `;

                final_study_view.prepend(finalDeckOutput);
            } else {
                // Create a new card and add it to the DOM
                card = generateCard(deck.cards[cardIdx]);
                final_study_view.prepend(card); // Add before the buttons
            }
        });


        final_study_view.append(card);
        final_study_view.append(correctButton);
        final_study_view.append(incorrectButton);
    }

    return final_study_view;
}
