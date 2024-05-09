
import { getUser } from "../data_interface/data.js";
import { Deck } from "../structures/deck.js";
import { User } from "../structures/user.js";


/**
 * Creates a client side database and checks for the different data, filling in whatever blanks exist
 * @param {String} user_id - The user to be established as the active user 
 */
export async function establishLocalDatabase(user_id) {
    const ldb = new PouchDB("localData");

    const intendedUser = await getUser(user_id);
    try {
        const activeUser = await ldb.get("active-user");
    } catch (e) {
        await ldb.put({_id: "active-user", user: intendedUser});
    }

    try {
        const activeDecks = await ldb.get("active-decks");
    } catch (e) {
        let intendedDecks = await intendedUser.getDecks();
        await ldb.put({_id: "active-decks", decks: intendedDecks});
    }

    try {
        const activeFollowers = await ldb.get("active-followers");
    } catch (e) {
        let intendedFollowers = await intendedUser.getFollowers();
        await ldb.put({_id: "active-followers", followers: intendedFollowers});
    }

    try {
        const activeFollowing = await ldb.get("active-following");
    } catch (e) {
        let intendedFollowing = await intendedUser.getFollowing();
        await ldb.put({_id: "active-following", following: intendedFollowing});
    }
}

/**
 * Returns instance of client-side database, mainly for sake of convenience
 * @returns {PouchDB} Instance of client-side database
 */
async function getLDB() {
    return new PouchDB("localData");
}

/**
 * Destroys and replaces the existing client-side database. Can also be used to initialize database.
 * @param {String} user_id - ID of user to establish as the active user
 */
export async function replaceLocalDatabase(user_id) {
    let db = new PouchDB("localData");
    await db.destroy();
    await establishLocalDatabase(user_id);
}

/**
 * Gets active user from client-side database
 * @returns {User} - Active user object
 */
export async function getActiveUser() {
    let db = await getLDB();
    let user_page = await db.get("active-user");
    let activeUser = new User();
    Object.assign(activeUser, user_page["user"]);
    return activeUser;
}

/**
 * Updates the client-side database with current instance
 * @param {User} user - Object form of active user
 */
export async function updateActiveUser(user) {
    let db = await getLDB();
    let activeUser = await db.get("active-user");
    let rev = activeUser._rev;
    await db.put({_id: "active-user", user: user, _rev: rev});
}

/**
 * Gets array of the active user's decks from the client-side database
 * @param {boolean} sorted - Sorts according to time over deadline to study according to spatial repetition
 * @param {boolean} beingStudied - Filters to return only decks currently being studied according to metadata
 * @param {boolean} toStudy - Filters to return only decks that need to be studied according to spatial repetition
 * @param {boolean} owned - Filters to return only decks created by the user. Overrides notOwned
 * @param {boolean} notOwned - Filters to return only decks created by someone other than the user. Overridden by owned
 * @returns {Deck[]} - Array of deck objects
*/
export async function getActiveDecks(sorted = false, beingStudied = false, toStudy = false, owned = false, notOwned = false) {
    let db = await getLDB();
    let decks = await db.get("active-decks").then(ds => ds["decks"]);
    
    let user = await getActiveUser();
    if (decks.length === 0) {
        return decks;
     }

    let deckArr = [];
    for (let deck of decks) {
        let creator = deck.creator;
        let creatorUser = new User(creator.id, creator.username, creator.followers, creator.following, creator.metadata);
        deckArr.push(new Deck(deck.id, deck.topic, deck.cards, creatorUser));
    }

    if (beingStudied) {
        deckArr = deckArr.filter((deck) => user.metadata[deck.id].beingStudied);
     }

     if (toStudy) {
        deckArr = deckArr.filter(deck => user.checkDeck(deck));
     }

     let sortFunc = ((d1, d2) => {
        let time = Date.now();
        let timeInDay = 86_400_000; // Number of milliseconds in a day

        let d1Time = (time - user.metadata[d1.id].timeLastStudied) - (timeInDay * user.metadata[d1.id].timesStudied);
        let d2Time = (time - user.metadata[d2.id].timeLastStudied) - (timeInDay * user.metadata[d2.id].timesStudied);

        return d1Time - d2Time;
     })

     if (sorted) {
        deckArr.sort(sortFunc)
     }

     if (owned) {
        deckArr = deckArr.filter(deck => deck.creator.id === user.id);
     } else if (notOwned) {
        deckArr = deckArr.filter(deck => deck.creator.id !== user.id);
     }

     return deckArr;
}

/**
 * Refreshes the client-side database's decks with the server's
 */
export async function refreshActiveDecks() {
    let activeUser = await getActiveUser();
    let trueDecks = await activeUser.getDecks();
    let db = await getLDB();
    let dbDecks = await db.get("active-decks");
    let rev = dbDecks._rev;
    await db.put({_id: "active-decks", decks: trueDecks, _rev: rev});
}

/**
 * Updates client-side database's decks with the deck you pass to it
 * @param {Deck} deck - the deck you want to add or delete
 * @param {Boolean} add - True to add the deck, false to delete it
 */
export async function updateActiveDecks(deck, add) {
    let activeDecks = await getActiveDecks();
    if (add) {
        activeDecks.push(deck);
    } else {
        activeDecks = activeDecks.filter(x => x.id !== deck.id);
    }
    let db = await getLDB();
    let dbDecks = await db.get("active-decks");
    let rev = dbDecks._rev;
    await db.put({_id: "active-decks", decks: activeDecks, _rev: rev});
}

/**
* Outputs array of User objects who follow the active user from client-side database
* @returns {User[]} - Array of User objects
*/
export async function getActiveFollowers() {
    let db = await getLDB();
    let activeFollowers = await db.get("active-followers").then(f => f["followers"]);
    return activeFollowers.map(follow => new User(follow.id, follow.username, follow.followers, follow.following, follow.metadata));
}

/**
 * Outputs array of User objects who the active user is following from client-side database
 * @returns {User[]} - Array of User objects
 */
export async function getActiveFollowing() {
    let db = await getLDB();
    let activeFollowing = await db.get("active-following").then(f => f["following"]);
    return activeFollowing.map(follow => new User(follow.id, follow.username, follow.followers, follow.following, follow.metadata));
}

/**
 * Adds or deletes a user to client-side database for the active user's following list
 * @param {User} user - User to add or delete from client-side database
 * @param {*} add - True to add the user, false to delete
 */
export async function updateActiveFollowing(user, add) {
    let activeFollowing = await getActiveFollowing();
    if (add) {
        activeFollowing.push(user);
    } else {
        activeFollowing = activeFollowing.filter(follow => follow.id !== user.id);
    }
    let db = await getLDB();
    let dbFollowing = await db.get("active-following");
    let rev = dbFollowing._rev;
    await db.put({_id: "active-following", following: activeFollowing, _rev: rev});
}