export function generateDeckEntry(deck) {
    /**
     * Generates a Deck Entry (Icon to represent a deck at a glance)
     * @ToDo
     * Change the text on the button
     * Add click functionality to the button
     * @argument {deck} deck - A deck object as defined in structures/deck.js
     * @returns {Element} - An HTML div element
     */

    // Creation of entire entry
    let entry = document.createElement("div");
    entry.classList.add("entry");

    // Creation of text elements

    let textDiv = document.createElement("div");
    textDiv.classList.add("entry-textbox")

    let textChildren = [];

    for (let i = 0; i < 3; i++) {
        let textEl = document.createElement("div");
        textEl.classList.add("entry-text");
        textDiv.appendChild(textEl);
        textChildren.push(textEl);
    }

    // Change these to align with deck objects
    textChildren[0].innerHTML = "Topic:<br>" + deck.topic;
    textChildren[1].innerHTML = "Card Count:<br>" + deck.cards.length;
    textChildren[2].innerHTML = "Author:<br>" + deck.creator.username;

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
     * @ToDo
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

    for (let i = 0; i < 3; i++) {
        let textEl = document.createElement("div");
        textEl.classList.add("entry-text");
        textDiv.appendChild(textEl);
        textChildren.push(textEl);
    }

    // Change these to align with user objects
    textChildren[0].innerHTML = "User:<br>" + user.username;
    textChildren[1].innerHTML = "Followers:<br>" + user.followers.length;
    textChildren[2].innerHTML = "Following:<br>" + user.following.length;
    
    entry.appendChild(textDiv);

    // Creation of button element

    let buttonDiv = document.createElement("button");
    buttonDiv.classList.add("entry-button");

    buttonDiv.innerHTML = "TBD"; // Change

    buttonDiv.click; // Change

    entry.appendChild(buttonDiv);

    return entry;
}