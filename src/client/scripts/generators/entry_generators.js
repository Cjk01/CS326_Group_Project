import {User} from "../structures/user.js";
import {Deck} from "../structures/deck.js"

const activeUser = User.getActiveUser();

export function generateDeckEntry(deck, view) {
    /**
     * Generates a Deck Entry (Icon to represent a deck at a glance)
     * @ToDo
     * Change the text on the button
     * Add click functionality to the button
     * @param {Deck} deck - A deck object as defined in structures/deck.js
     * @param {boolean} view - Decides what the top button does. True for study, false for add.
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
    textChildren[2].innerHTML = "Author:<br>" + deck.creator.username + "<br>(Click to view profile)";
    
    textChildren[2].addEventListener("click", () => {
        console.log("Not yet implemented");
    })

    let studyingButton = document.createElement("input");
    studyingButton.type = "button";
    studyingButton.classList.add("entry-study-Button");
    if (activeUser.isStudying(deck)) {
        studyingButton.value = "Studying";
    } else {
        studyingButton.value = "Not studying";
    }

    studyingButton.addEventListener("click", async () => {
        if (activeUser.isStudying(deck)) {
            studyingButton.value = "Pending";
            await activeUser.toggleStudy();
            studyingButton.value = "Not studying";
        } else {
            studyingButton.value = "Pending";
            await activeUser.toggleStudy();
            studyingButton.value = "Not studying";
        }
    })

    textDiv.appendChild(studyingButton);

    entry.appendChild(textDiv);

    // Creation of button element

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("entry-button-grid");

    let topButton = document.createElement("input");
    topButton.type = "button";
    topButton.classList.add("entry-button");
    if (view) {
        topButton.value = "Study";
        topButton.addEventListener("click", () => {
            console.log("Not yet implemented");
        })
    } else {
        topButton.value = "Add";
        topButton.addEventListener("click", async () => {
            if (!topButton.value === "Added") {
                topButton.value = "Pending";
                await activeUser.registerDeck(deck);
                topButton.value = "Added";
            }
        })
    }
    
    let bottomButton = document.createElement("input");
    bottomButton.type = "button";
    bottomButton.classList.add("entry-button");
    bottomButton.value = "View";
    
    bottomButton.addEventListener(() => {
        console.log("Not yet implemented");
    });

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
     * @param {User} user - A user object as defined in structures/user.js
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

    // Creation of button elements

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("entry-button-grid");


    let topButton = document.createElement("input");
    topButton.type = "button";
    topButton.classList.add("entry-button");
    if (activeUser.isFollowing(user)) {
        topButton.value = "Unfollow";
    } else {
        topButton.value = "Follow"
    }

    topButton.addEventListener("click", async () => {
        if (activeUser.isFollowing(user)) {
            topButton.value = "Pending";
            await activeUser.removeFollowing(user);
            topButton.value = "Follow";
        } else {
            topButton.value = "Pending";
            await activeUser.registerFollowing(user);
            topButton.value = "Unfollow";
        }
    })

    let bottomButton = document.createElement("input");
    bottomButton.type = "button";
    bottomButton.classList.add("entry-button");
    bottomButton.value = "View";
    
    bottomButton.addEventListener("click", () => {
        console.log("To be implemented");
    });

    buttonDiv.appendChild(topButton);
    buttonDiv.appendChild(bottomButton);

    entry.appendChild(buttonDiv);

    return entry;
}