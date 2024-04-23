import { getDeck, addDeck, updateDeck } from "../data_interface/data.js";
import { generateDeckEntry, generateUserEntry } from "../generators/entry_generators.js";
import { generateCard } from "../generators/card_generator.js";
import { User } from "../structures/user.js";
import {Card} from "../structures/card.js";
import { Deck } from "../structures/deck.js";

export async function loadHomepageView() {
    //Get all the necessary data by using User methods --> Retrieves from local storage
    const user = User.getActiveUser();
    const decks = User.getActiveDecks(true, false, false, true, false);
    //const followers = User.getActiveFollowers();
    //const following = User.getActiveFollowing();

    //Create Home Page Container
    let homePageContainer = document.createElement('div');
    homePageContainer.setAttribute('id', 'HomeView');
    homePageContainer.classList.add('view');
    homePageContainer.innerHTML = '';
    
    //Create header
    const studyHeader = document.createElement('h2');
    studyHeader.innerHTML = `<h2 id='homepage-decksToStudy'>Decks to Study: </h2>`;
    homePageContainer.appendChild(studyHeader);

    const deckContainer = document.createElement('div');
    deckContainer.setAttribute('id', 'homepage-deckContainer');
    homePageContainer.appendChild(deckContainer);

    //Create divs for 5 decks that are most urgent to study --> As per wireframe
    for(let i = 0; i < 5; i++){
        const deck = generateDeckEntry(decks[i]);
        deck.classList.add('homepage-entry');
        deckContainer.appendChild(deck);
    }

    const followersHeader = document.createElement('h2');
    followersHeader.innerHTML = `<h2 id='homepage-followers'>Followers: </h2>`;
    homePageContainer.appendChild(followersHeader);

    const user1 = new User(123, "daniilkoval", [1245, 456], [1245, 456], {});
    const followersContainer = document.createElement('homepage-followerContainer');
    homePageContainer.appendChild(followersContainer);
    //Create a short display of people following the user
    for(let i = 0; i < 4; i++){
        const follower = generateUserEntry(user1);
        follower.classList.add('homepage-follower');
        followersContainer.appendChild(follower);
    }

    const followingHeader = document.createElement('h2');
    followingHeader.innerHTML = `<h2 id='homepage-following'>Following: </h2>`;
    homePageContainer.appendChild(followingHeader);

    const followingContainer = document.createElement('homepage-followingContainer');
    homePageContainer.appendChild(followingContainer);

    //Do the same for people the user follows
    for(let i = 0; i < 4; i++){
        const followee = generateUserEntry(user1);
        followee.classList.add('homepage-followee');
        followingContainer.appendChild(followee);
    }

    return homePageContainer;
}