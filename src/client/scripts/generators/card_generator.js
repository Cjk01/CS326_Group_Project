/**
 * Function that generates a visual representation of a card object as an HTML element
 */
export function generateCard(card) {
    /**
     * @param {Card} card - A card object as defined in structures/card.js
     * @returns {Element} - An HTML div element representing a flashcard
     */
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");

    // Inside part supports flip animation
    const cardInside = document.createElement("div");
    cardInside.classList.add("card-inside");

    const cardFront = document.createElement("div");
    cardFront.classList.add("card-front");
    cardFront.innerHTML = card.question;

    const cardBack = document.createElement("div");
    cardBack.classList.add("card-back");
    cardBack.innerHTML = card.answer;

    cardElement.append(cardInside);
    cardInside.appendChild(cardFront);
    cardInside.appendChild(cardBack);

    // isBeingStudied used to trigger the Correct and Incorrect Buttons when clicked
    cardElement.addEventListener("click", (isBeingStudied = false) => {
        if (cardInside.style.transform === "rotateY(180deg)") {
            cardInside.style.transform = "rotateY(0deg)";
        } else {
            cardInside.style.transform = "rotateY(180deg)";
        }

        if (isBeingStudied) {
          // TODO: Add button visibility logic here
        }
    });

    return cardElement;
}
