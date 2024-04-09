export function generateDeckEntry(deck) {
    /**
     * Generates a Deck Entry (Icon to represent a deck at a glance)
     * @ToDo Change text elements to align with deck objects
     * Change text elements to align with deck objects
     * Change the text on the button
     * Add click functionality to the button
     * Style
     * @argument {Object} deck - A deck object as defined in structures/deck.js
     * @returns {Element} - An HTML div element
     */


    // Creation of entire entry
    let entry = document.createElement("div");
    entry.classList.add("entry");

    // Creation of text elements

    let textDiv = document.createElement("div");
    textDiv.classList.add("entry-textbox")

    let textChildren = [];

    for (let i = 0; i < 6; i++) {
        let textEl = document.createElement("div");
        textEl.classList.add("entry-text");
        textDiv.appendChild(textEl);
        textChildren.push(textEl);
    }

    // Change these to align with deck objects
    textChildren[0].innerHTML = "First thing:<br>" + deck;
    textChildren[1].innerHTML = "Second thing:<br>" + deck;
    textChildren[2].innerHTML = "Third thing:<br>" + deck;
    textChildren[3].innerHTML = "Fourth thing:<br>" + deck;
    textChildren[4].innerHTML = "Fifth thing:<br>" + deck;
    textChildren[5].innerHTML = "Sixth thing:<br>" + deck;

    entry.appendChild(textDiv);

    // Creation of button element

    let buttonDiv = document.createElement("button");
    buttonDiv.classList.add("entry-button");
    
    buttonDiv.innerHTML = "TBD"; // Change

    buttonDiv.click; // Change

    entry.appendChild(buttonDiv);

    return entry;
}

export function generateUserEntry(user) {
    /**
     * Generates a User Entry (Icon to represent a user at a glance)
     * @ToDo Change text elements to align with user objects
     * Change the text on the button
     * Add click functionality to the button
     * Style
     * @argument {Object} user - A user object as defined in structures/user.js
     * @returns {Element} - An HTML div element
     */


    // Creation of entire entry
    let entry = document.createElement("div");
    entry.classList.add("entry");

    // Creation of text elements

    let textDiv = document.createElement("div");
    textDiv.classList.add("entry-textbox")

    let textChildren = [];

    for (let i = 0; i < 6; i++) {
        let textEl = document.createElement("div");
        textEl.classList.add("entry-text");
        textDiv.appendChild(textEl);
        textChildren.push(textEl);
    }

    // Change these to align with user objects
    textChildren[0].innerHTML = "First thing:<br>" + user;
    textChildren[1].innerHTML = "Second thing:<br>" + user;
    textChildren[2].innerHTML = "Third thing:<br>" + user;
    textChildren[3].innerHTML = "Fourth thing:<br>" + user;
    textChildren[4].innerHTML = "Fifth thing:<br>" + user;
    textChildren[5].innerHTML = "Sixth thing:<br>" + user;

    entry.appendChild(textDiv);

    // Creation of button element

    let buttonDiv = document.createElement("button");
    buttonDiv.classList.add("entry-button");

    buttonDiv.innerHTML = "TBD"; // Change

    buttonDiv.click; // Change

    entry.appendChild(buttonDiv);

    return entry;
}