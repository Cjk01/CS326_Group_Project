import { getUser } from "../data_interface/data.js";
import { User } from "../structures/user.js";
import { Deck } from "../structures/deck.js";
import { loadOtherUserProfile } from "../page_loaders/profile_loader.js";
import { loadDeckPreview } from "../page_loaders/decks_loader.js";
import { getActiveUser } from "../data_interface/localDB.js";

/**
 * Generates a Deck Entry (Icon to represent a deck at a glance)
 * @ToDo
 * Add functionality to buttons
 * @param {Deck} deck - A deck object as defined in structures/deck.js
 * @returns {Element} - An HTML div element
 */
export async function generateDeckEntry(deck) {
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
    textChildren[0].innerHTML = deck.topic;
    textChildren[1].innerHTML = deck.cards.length + " Cards";
    textChildren[2].innerHTML = "Author: " + deck.creator.username;

    textChildren[2].classList.add("deck-entry-creator-text");
    textChildren[2].addEventListener("click", async () => {
        let creator = await getUser(deck.creator.id);
        loadOtherUserProfile(creator);
    })

    if (Object.keys(await getActiveUser().then(u => u.metadata)).includes(deck.id)) {
        let studyingButton = document.createElement("input");
        studyingButton.type = "button";
        studyingButton.classList.add("cool-green-button");

        if (await getActiveUser().then(u => u.metadata[deck.id].beingStudied)) {
            studyingButton.value = "Studying";
        } else {
            studyingButton.value = "Not Studying";
        }

        studyingButton.addEventListener("click", async () => {
            if (await getActiveUser().then(u => u.metadata[deck.id].beingStudied)) {
                studyingButton.value = "Pending";
                await getActiveUser().then(async u => await u.toggleStudy(deck));
                studyingButton.value = "Not Studying";
            } else {
                studyingButton.value = "Pending";
                await getActiveUser().then(async u => await u.toggleStudy(deck));
                studyingButton.value = "Studying";
            }
        })

        textDiv.appendChild(studyingButton);
    }

    entry.appendChild(textDiv);

    // Creation of button element

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("entry-button-grid");

    let topButton = document.createElement("input");
    topButton.type = "button";
    topButton.classList.add("cool-green-button");
    topButton.value = "Study";
    topButton.addEventListener("click", () => {
        const studyPage = document.getElementById("StudyView");

        studyPage.deck = deck;
        document.getElementById("StudyView").click();
    });

    let bottomButton = document.createElement("input");
    bottomButton.type = "button";
    bottomButton.classList.add("cool-green-button");
    bottomButton.value = "View";

    bottomButton.addEventListener("click", async () => {
        await loadDeckPreview(deck);
    });

    let thirdButton;

    if (!Object.keys(await getActiveUser().then(u => u.metadata)).includes(deck.id)) {
        thirdButton = document.createElement("input");
        thirdButton.type = "button";
        thirdButton.classList.add("cool-green-button");
        thirdButton.value = "Add";
        thirdButton.addEventListener("click", async () => {
            thirdButton.value = "Pending";
            await getActiveUser().then(u => u.registerDeck(deck));
            thirdButton.value = "Added";
            thirdButton.disabled = true;
        })
    }

    buttonDiv.appendChild(topButton);
    buttonDiv.appendChild(bottomButton);
    if (thirdButton) {
        buttonDiv.appendChild(thirdButton);
    }

    entry.appendChild(buttonDiv);

    return entry;
}

/**
 * Generates a User Entry (Icon to represent a user at a glance)
 * @ToDo
 * Change the text on the button
 * Add click functionality to the button
 * Style
 * @param {User} user - A user object as defined in structures/user.js
 * @returns {Element} - An HTML div element
 */
export async function generateUserEntry(user) {

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
    textChildren[0].innerHTML = "User: " + user.username;
    textChildren[1].innerHTML = "Followers: " + user.followers.length;
    textChildren[2].innerHTML = "Following: " + user.following.length;

    entry.appendChild(textDiv);

    // Creation of button elements

    let buttonDiv = document.createElement("div");
    buttonDiv.classList.add("entry-button-grid");


    let topButton = document.createElement("input");
    topButton.type = "button";
    topButton.classList.add("cool-green-button");

    let activeUser = await getActiveUser();

    if (user.id === activeUser.id) {
        topButton.value = "Self";
        topButton.disabled = true;
    } else if (activeUser.isFollowing(user)) {
        topButton.value = "Unfollow";
    } else {
        topButton.value = "Follow"
    }

    topButton.addEventListener("click", async () => {
        if (await getActiveUser().then(u => u.isFollowing(user))) {
            topButton.value = "Pending";
            await getActiveUser().then(async u => await u.removeFollowing(user));
            topButton.value = "Follow";
        } else {
            topButton.value = "Pending";
            await getActiveUser().then(async u => await u.registerFollowing(user));
            topButton.value = "Unfollow";
        }
    })

    let bottomButton = document.createElement("input");
    bottomButton.type = "button";
    bottomButton.classList.add("cool-green-button");
    bottomButton.value = "View";

    bottomButton.addEventListener("click", () => {
        loadOtherUserProfile(user);
    });

    buttonDiv.appendChild(topButton);
    buttonDiv.appendChild(bottomButton);

    entry.appendChild(buttonDiv);

    return entry;
}
