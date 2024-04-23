import { getUser, updateUser, getDeck } from "../data_interface/data.js";
import { generateDeckEntry, generateUserEntry } from "../generators/entry_generators.js";
import { User } from "../structures/user.js";

/**
 * @todo - fix edit button
 * @returns 
 */
export async function loadProfileView() {
    let profileView = document.createElement("div");
    profileView.setAttribute("id", "ProfileView");
    profileView.classList.add("view");
    profileView.innerHTML = 
    `
    <div id="profile-button-container">
    <input id="your-profile-button" class="cool-green-button" type="button" value="Your Profile"/>
    <input id="following-button" class="cool-green-button" type="button" value="Following"/>
    <input id="follower-button" class="cool-green-button" type="button" value="Followers"/>
    <input id="search-user-button" class="cool-green-button" type="button" value="Search Users">
    <input id="search-deck-button" class="cool-green-button" type="button" value="Search Decks">
    </div>
    <br>
    <div id="profileContainer"><div/>
    `;

    let activeUser = User.getActiveUser();

    let profileInfo = profileView.querySelector("#profileContainer");

    profileInfo.innerHTML = 
    `
    <p id="profile-username-text">Username: ${activeUser.username}</p>

    <p id="profile-id-text">ID: ${activeUser.id}</p>

    <p id="profile-follower-count-text">Number of Followers: ${activeUser.followers.length}</p>

    <p id="profile-following-count-text">Number Following: ${activeUser.following.length}</p>

    <p id="profile-deck-text">Currently studying ${User.getActiveDecks(false, true, false, false, false).length} deck(s)</p>
    `

    profileView.querySelector("#your-profile-button").addEventListener("click", loadUserProfile);

    profileView.querySelector("#following-button").addEventListener("click", loadUserFollowing);
    
    profileView.querySelector("#follower-button").addEventListener("click", loadUserFollowers);

    profileView.querySelector("#search-user-button").addEventListener("click", loadUserSearch);

    profileView.querySelector("#search-deck-button").addEventListener("click", loadDeckSearch);

    return profileView;
}


function loadUserProfile() {
    let profileInfoContainer = document.getElementById("profileContainer");
    profileInfoContainer.innerHTML = "";

    let activeUser = User.getActiveUser();

    profileInfoContainer.innerHTML = 
    `
    <p id="profile-username-text">Username: ${activeUser.username}</p>

    <p id="profile-id-text">ID: ${activeUser.id}</p>

    <p id="profile-follower-count-text">Number of Followers: ${activeUser.followers.length}</p>

    <p id="profile-following-count-text">Number Following: ${activeUser.following.length}</p>

    <p id="profile-deck-text">Currently studying ${User.getActiveDecks(false, true, false, false, false).length} deck(s)</p>
    `
}

async function loadUserFollowing() {
    let profileContainer = document.getElementById("profileContainer");
    profileContainer.innerHTML = ""

    let followContainer = document.createElement("div");
    followContainer.setAttribute("id", "other-decks-container");
    let following = User.getActiveFollowing();
    following.map(generateUserEntry).map(entry => followContainer.appendChild(entry));
    profileContainer.appendChild(followContainer);
}

async function loadUserFollowers() {
    let profileContainer = document.getElementById("profileContainer");
    profileContainer.innerHTML = "";

    let followContainer = document.createElement("div");
    followContainer.setAttribute("id", "other-decks-container");
    let followers = User.getActiveFollowers();
    followers.map(generateUserEntry).map(entry => followContainer.appendChild(entry));
    profileContainer.appendChild(followContainer);
}

async function loadUserSearch() {
    let profileContainer = document.getElementById("profileContainer");
    profileContainer.innerHTML =
    `<p>Type a user's ID here: </p>
    <input id="user-search-id-field" /><br>
    <input id="user-search-button" type="button" value="Search"/><br>
    <div id="profile-entry-container"></div>
    `

    let searchField = profileContainer.querySelector("#user-search-id-field");
    let searchButton = profileContainer.querySelector("#user-search-button");
    let entryContainer = profileContainer.querySelector("#profile-entry-container");

    searchButton.addEventListener("click", async () => {
        entryContainer.innerHTML = 
        `
        <p id="user-apology-message">Searching...</p>
        <p id="user-apology-continued">If the user does not load within a few moments, it is likely we cannot find it. Sorry for the inconvenience, and please search for another ID.</p>
        `;

        let user = await getUser(searchField.value);
        
        entryContainer.innerHTML = "";
        entryContainer.appendChild(generateUserEntry(user));
    });
}

async function loadDeckSearch() {
    let profileContainer = document.getElementById("profileContainer");
    profileContainer.innerHTML =
    `
    <p>Type a deck's ID here: </p>
    <input id="deck-search-id-field" /><br>
    <input id="deck-search-button" type="button" value="Search"/><br>
    <div id="profile-entry-container"></div>
    `

    let searchField = profileContainer.querySelector("#deck-search-id-field");
    let searchButton = profileContainer.querySelector("#deck-search-button");
    let entryContainer = profileContainer.querySelector("#profile-entry-container");

    searchButton.addEventListener("click", async () => {
        entryContainer.innerHTML = 
        `
        <p id="deck-apology-message">Searching...</p>
        <p id="deck-apology-continued">If the deck does not load within a few moments, it is likely we cannot find it. Sorry for the inconvenience, and please search for another ID.</p>
        `;

        let deck = await getDeck(searchField.value);
        
        entryContainer.innerHTML = "";
        entryContainer.appendChild(generateDeckEntry(deck));
    }); 
}

export async function loadOtherUserProfile(user) {
    document.getElementById("navbar").childNodes[0].childNodes[4].childNodes[0].click();
    let userDecks = await user.getDecks(false, false, false, true, false);
    let profileContainer = document.getElementById("profileContainer");
    profileContainer.innerHTML =
    `
    <p id="other-profile-username-text">${user.username}</p>

    <p id="other-profile-id-text">ID: ${user.id}</p>

    <p id="other-profile-follower-count-text">Number of Followers: ${user.followers.length}</p>

    <p id="other-profile-following-count-text">Number Following: ${user.following.length}</p>

    <p id="profile-deck-text">Owns ${userDecks.length} Decks</p>

    <div id="other-decks-container"></div>
    `

    let entryContainer = profileContainer.querySelector("#other-decks-container");
    userDecks.map(deck => entryContainer.appendChild(generateDeckEntry(deck)));
}