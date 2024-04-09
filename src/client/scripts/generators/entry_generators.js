function generateDeckEntry(deck) {
    /**
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
    entry.classList.add("deck-entry");

    entry.style.width = 700;
    entry.style.height = 150;
    entry.style.margin = 10;
    entry.style.display = "grid";
    entry.style.gridTemplateColumns = "3fr 1fr";
    entry.style.border = "solid";


    // Creation of text elements

    let textDiv = document.createElement("div");
    textDiv.style.display = "grid";
    textDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
    textDiv.style.gridTemplateRows = "repeat(2, 1fr)";

    let textChildren = [];

    for (let i = 0; i < 6; i++) {
        let textEl = document.createElement("div");
        textEl.classList.add("deck-entry-text");
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
    buttonDiv.style.width = 125;
    buttonDiv.style.height = 75;
    buttonDiv.style.border = "solid";
    buttonDiv.style.placeSelf = "center";
    buttonDiv.innerHTML = "TBD"; // Change

    buttonDiv.click; // Change

    entry.appendChild(buttonDiv);

    return entry;
}

function generateUserEntry(user) {
    /**
     * @ToDo Change text elements to align with user objects
     * Change the text on the button
     * Add click functionality to the button
     * Style
     * @argument {Object} user - A user object as defined in structures/user.js
     * @returns {Element} - An HTML div element
     */


    // Creation of entire entry
    let entry = document.createElement("div");
    entry.classList.add("user-entry");

    entry.style.width = 700;
    entry.style.height = 150;
    entry.style.margin = 10;
    entry.style.display = "grid";
    entry.style.gridTemplateColumns = "3fr 1fr";
    entry.style.border = "solid";


    // Creation of text elements

    let textDiv = document.createElement("div");
    textDiv.style.display = "grid";
    textDiv.style.gridTemplateColumns = "repeat(3, 1fr)";
    textDiv.style.gridTemplateRows = "repeat(2, 1fr)";

    let textChildren = [];

    for (let i = 0; i < 6; i++) {
        let textEl = document.createElement("div");
        textEl.classList.add("user-entry-text");
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
    buttonDiv.style.width = 125;
    buttonDiv.style.height = 75;
    buttonDiv.style.border = "solid";
    buttonDiv.style.placeSelf = "center";
    buttonDiv.innerHTML = "TBD"; // Change

    buttonDiv.click; // Change

    entry.appendChild(buttonDiv);

    return entry;
}