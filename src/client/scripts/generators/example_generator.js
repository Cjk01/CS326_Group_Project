
/**
 * @todo write this documentation
 * @param {Object} deck
 * @returns {Element|null} the generated Deck Element (https://developer.mozilla.org/en-US/docs/Web/API/Element)
 */
export default function generateDeck(deck) {
    let deckElement = document.createElement("div");
    deckElement.classList.add("deck");
    deckElement.style.height = 100;
    deckElement.style.width = 500;

    let studyButton = document.createElement("input");
    studyButton.onclick = "study();"

    return deckElement;
}