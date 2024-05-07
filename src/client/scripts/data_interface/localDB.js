import PouchDB from "pouchdb";
import { getDeck, getUser, updateUser } from "../data_interface/data.js";
import { Deck } from "./deck.js";
import { Card } from "./card.js";
import { User } from "./user.js";

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
        await ldb.put({_id: "active-followers", followers: intendedFollowers})
    }

    try {
        const activeFollowing = await ldb.get("active-following");
    } catch (e) {
        let intendedFollowing = await intendedUser.getFollowing();
        await ldb.put({_id: "active-following", followers: intendedFollowing})
    }

    await ldb.close();
}

async function getLDB() {
    establishLocalDatabase("main_user");
    return new PouchDB("localData");
}

export async function replaceLocalDatabases() {
    let deleteLocal = await getLDB().then(db => db.destroy());
    establishLocalDatabase("main_user");
    return { "ok" : deleteLocal["ok"] };
}

export async function getActiveUser() {
    let db = await getLDB();
    let user_page = await db.get("active-user");
    let activeUser = new User();
    let userJSON = await user_page["user"].json();
    Object.assign(activeUser, userJSON);
    await db.close();
    return activeUser;
}

export async function updateActiveUser(user) {
    let db = await getLDB();
    db.put({_id: "active-user", user});
    await db.close();
}

export async function getActiveDecks(sorted = false, beingStudied = false, toStudy = false, owned = false, notOwned = false) {
    let db = await getLDB();
    let decks = await db.get("active-decks").then(ds => ds.json());
    if (decks.length === 0) {
        return decks;
     }

    let deckArr = [];
    for (let deck of decks) {
        let cardArr = [];
        let creator = deck.creator;
        let creatorUser = new User(creator.id, creator.username, creator.followers, creator.following, creator.metadata);
        deckArr.push(new Deck(deck.id, deck.topic, cardArr, creatorUser));
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

export async function updateActiveDecks() {
    
}