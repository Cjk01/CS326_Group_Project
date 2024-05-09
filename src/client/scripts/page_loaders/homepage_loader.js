import { generateDeckEntry, generateUserEntry } from "../generators/entry_generators.js";
import { User } from "../structures/user.js";
import { getActiveUser, getActiveDecks, getActiveFollowers, getActiveFollowing } from "../data_interface/localDB.js"

/**
 * Generates the homepage HTML element
 * @returns {HTMLElement}
*/
export async function loadHomepageView() {
    //Get all the necessary data by using User methods --> Retrieves from local storage
    const user = await getActiveUser();
    const decks = await getActiveDecks(true, false, false, true, false);

    //TODO: Uncomment lines once these are added into local storage. For now, just use a fake user
    const user1 = new User(123, "daniilkoval", [1245, 456], [1245, 456], {});
    const followers = await getActiveFollowers();
    const following = await getActiveFollowing();

    //Create Home Page Container
    let homePageContainer = document.createElement('div');
    homePageContainer.setAttribute('id', 'HomeView');
    homePageContainer.classList.add('view');
    homePageContainer.innerHTML = '';

    //Create header
    const studyHeader = document.createElement('h2');
    studyHeader.innerHTML = `<h2 id='homepage-decksToStudy'>Decks to Study </h2>`;
    homePageContainer.appendChild(studyHeader);

    //Element to contain the decks
    const deckContainer = document.createElement('div');
    deckContainer.setAttribute('id', 'homepage-deckContainer');
    homePageContainer.appendChild(deckContainer);

    //Generate deck elements for the first 5 decks in the decks to study as per wire frame
    let decks_to_iterate = decks.length > 5 ? 5 : decks.length;
    for(let i = 0; i < decks_to_iterate; i++){
        const deck = await generateDeckEntry(decks[i]);
        deck.classList.add('homepage-entry');
        deckContainer.appendChild(deck);
    }

    /*Create an add deck button. May add back later
    const addButton = document.createElement('input');
    addButton.setAttribute('type', 'button');
    addButton.setAttribute('id', 'homepage-addButton');
    addButton.setAttribute('value', '+');
    addButton.classList.add('homepage-entry');
    addButton.classList.add('cool-green-button');
    deckContainer.appendChild(addButton);
    addButton.addEventListener('click', () => {
        //TODO: Add functionality to the add deck button when the page to create a deck is made
        console.log("To be implemented");
    });*/

    //Header for followers
    const followersHeader = document.createElement('h2');
    followersHeader.innerHTML = `<h2 id='homepage-followers'>Followers </h2>`;
    homePageContainer.appendChild(followersHeader);

    //Container for followers
    const followersContainer = document.createElement('homepage-followerContainer');
    homePageContainer.appendChild(followersContainer);

    //Create a short display of people following the user
    for(let i = 0; i < followers.length; i++){
        const follower = await generateUserEntry(followers[i]);
        follower.classList.add('homepage-follower');
        followersContainer.appendChild(follower);
    }

    //Header for people following the user
    const followingHeader = document.createElement('h2');
    followingHeader.innerHTML = `<h2 id='homepage-following'>Following </h2>`;
    homePageContainer.appendChild(followingHeader);

    //Container for people following the user
    const followingContainer = document.createElement('homepage-followingContainer');
    homePageContainer.appendChild(followingContainer);

    //Do the same for people the user follows as for people who follow the user
    for(let i = 0; i < following.length; i++){
        const followee = await generateUserEntry(following[i]);
        followee.classList.add('homepage-followee');
        followingContainer.appendChild(followee);
    }

    return homePageContainer;
}
