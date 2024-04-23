import { User } from '../structures/user.js';

export async function loadHomePageView() {
    //Get all the necessary data by using User methods --> Retrieves from local storage
    const user = User.getActiveUser();
    const decks = User.getActiveDecks(true, false, false, false, false);
    const followers = User.getActiveFollowers();
    const following = User.getActiveFollowing();

    //Create Home Page Container
    let homePageContainer = document.createElement('div');
    homePageContainer.setAttribute('id', 'HomeView');
    homePageContainer.innerHTML = '';
    
    //Create header
    studyHeader = document.createElement('h2');
    studyHeader.innerHTML = `<h2 id='homepage-decksToStudy'>Decks to Study: </h2>`;
    homePageContainer.appendChild(studyHeader);

    //Create divs for 5 decks that are most urgent to study --> As per wireframe
    for(let i = 0; i < 5; i++){
        const deck = document.createElement('div');
        /*Looking at the wireframe, on the homepage we have rate of consistency, 
        date last studied, and deadline under each deck. I don't see anywhere where these are defined 
        yet (tell me if I'm wrong), so I'll just leave them blank until we get some more of 
        the deck logic going*/
        deck.classList.add('homepage-deck');
        deck.innerHTML = `
            <h3 class='homepage-deckName'>${decks[i].topic}</h3>
            <div class='homepage-numTerms'>${decks[i].cards.length}</div>
            <div class='homepage-consistency'> TO BE DETERMINED </div>
            <div class='homepage-lastStudied'> TO BE DETERMINED </div>
            <div class='homepage-deadline'> TO BE DETERMINED </div>
        `;
        homePageContainer.appendChild(deck);
    }

    //Create a short display of people following the user
    for(let i = 0; i < 4; i++){
        const follower = document.createElement('div');
        follower.classList.add('homepage-follower');

        follower.innerHTML = `
            <div class=homepage-followerName>${followers[i].username}</div>
        `;

        homePageContainer.appendChild(follower);
    }

    //Do the same for people the user follows
    for(let i = 0; i < 4; i++){
        const userFollows = document.createElement('div');
        userFollows.classList.add('homepage-following');

        userFollows.innerHTML = `
            <div class=homepage-followingName>${following[i].username}</div>
        `;

        homePageContainer.appendChild(following);
    }
}