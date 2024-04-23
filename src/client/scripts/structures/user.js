import { getDeck, getUser, updateUser } from "../data_interface/data.js";
import { Deck } from "./deck.js";
import { Card } from "./card.js";
/**
 * Class representing a User (of Cachely!)
 */
export class User {

    /**
     * Creates a User
     * @param {Number} id - a unique identifier
     * @param {string} username - the username text
     * @param {Number[]} followers - stores followers of the User
     * @param {Number[]} following - stores those being followed by the User
     * @param {Object} metadata - Object mapping Deck IDs to study information
     * Study information is an object including three keys
     * timeLastStudied - The time in milliseconds since the Epoch at the time the deck was last studied
     * timesStudied - The number of times the deck has been studied, to be used for spatial repetition
     * beingStudied - A boolean indicating whether the deck is being actively studied
     */
   constructor(id = null, username = null, followers = null, following = null, metadata = {}) {
      this.id = id;
      this.username = username;
      this.followers = followers;
      this.following = following;
      this.metadata = metadata;
   }

   /**
    * @todo - Uncomment follower parts - as of right now, active user's followers/following aren't in database
    * Fetches active user from database and sets local storage field
    * Can also be used to update the field to match database
    * @param {Number} userId - the user object meant to
    */
   static async estabilishLocalStorage(userId) {
      let activeUser = await getUser(userId);
      let activeDecks = await activeUser.getDecks();
      let activeFollowers = await activeUser.getFollowers();
      let activeFollowing = await activeUser.getFollowing();
      localStorage.setItem("active-user", JSON.stringify(activeUser));
      localStorage.setItem("active-decks", JSON.stringify(activeDecks));
      localStorage.setItem("active-followers", JSON.stringify(activeFollowers));
      localStorage.setItem("active-following", JSON.stringify(activeFollowing));
   }

   /** Updates local storage's active-user field without accessing database
    * @param {User} activeUser - The active user, currently in local storage
    */
   static #updateLocalUser(activeUser) {
      localStorage.setItem("active-user", JSON.stringify(activeUser));
   }

   /** Updates local storage's active-decks field without accessing database
    * @param {Deck} deck - A deck to be added to local storage
    */
   static #updateLocalDecks(deck) {
      let localDecks = User.getActiveDecks();
      localDecks.push(deck);
      localStorage.setItem("active-decks", JSON.stringify(localDecks));
   }

   /**
    * Updates the local storage followers field
    * @param {User} user - the user to add or delete to the local storage follower field
    * @param {boolean} add - true for adding, false for deleting
    */
   static #updateLocalFollowers(user, add) {
      let localFollowers = User.getActiveFollowers();
      if (add) {
         localFollowers.push(user);
         localStorage.setItem("active-followers", JSON.stringify(localFollowers));
      } else {
         localStorage.setItem("active-followers", JSON.stringify(localFollowers.filter(follow => follow.id !== user.id)));
      }
   }

   /**
    * Updates the local storage following field
    * @param {User} user - the user to add or delete to the local storage following field
    * @param {boolean} add - true for adding, false for deleting
    */
   static #updateLocalFollowing(user, add) {
      let localFollowing = User.getActiveFollowing();
      if (add) {
         localFollowing.push(user);
         localStorage.setItem("active-following", JSON.stringify(localFollowing));
      } else {
         localStorage.setItem("active-following", JSON.stringify(localFollowing.filter(follow => follow.id !== user.id)));
      }
   }

   /**
    * An abstraction to get the active user from local storage. Unnecessary, but there if you want it.
    * @returns {User} - The active (logged in) user object
    */
   static getActiveUser() {
      let userData = JSON.parse(localStorage.getItem("active-user"));
      return new User(userData.id, userData.username, userData.followers, userData.following, userData.metadata);
   }

   /**
    * Gets active user's decks from local storage and sorts/filters them as necessary
    * @param {boolean} sorted - Sorts according to time over deadline to study according to spatial repetition
    * @param {boolean} beingStudied - Filters to return only decks currently being studied according to metadata
    * @param {boolean} toStudy - Filters to return only decks that need to be studied according to spatial repetition
    * @param {boolean} owned - Filters to return only decks created by the user. Overrides notOwned
    * @param {boolean} notOwned - Filters to return only decks created by someone other than the user. Overridden by owned
    * @returns {Deck[]} - Array of deck objects
    */
   static getActiveDecks(sorted = false, beingStudied = false, toStudy = false, owned = false, notOwned = false) {
      let user = User.getActiveUser();
      let decks = JSON.parse(localStorage.getItem("active-decks"));
      let deckArr = [];
      for (let deck of decks) {
         let cardArr = [];
         for (let card of deck.cards) {
            cardArr.push(new Card(card.card_type, card.question, card.answer, card.metadata));
         }
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

   /**
    * Gets active user's followers from local storage
    */
   static getActiveFollowers() {
      let followers = JSON.parse(localStorage.getItem("active-followers"));
      return followers.map(follow => new User(follow.id, follow.username, follow.followers, follow.following, follow.metadata));
   }

   /**
    * Gets users the active user is following from local storage
    */
   static getActiveFollowing() {
      let following = JSON.parse(localStorage.getItem("active-following"));
      return following.map(follow => new User(follow.id, follow.username, follow.followers, follow.following, follow.metadata));
   }

   /**
    * Registers a deck's id in the metadata field along with necessary information if it doesn't already exists.
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    * @returns {boolean} - true if user was freshly registered, false otherwise
    */
   async registerDeck(deck) {
      if (deck.id in this.metadata) {
         return false;
      } else {
         this.metadata[deck.id] = {timeLastStudied: Date.now(), timesStudied: 0, beingStudied: true};

         await updateUser(this);

         if (this.id === User.getActiveUser().id) {
            User.#updateLocalUser(this);
            User.#updateLocalDecks(deck);
         }

         return true;
      }
   }

   /**
    * Checks whether the user needs to study a given deck based on spatial repetition
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    * @returns {boolean} - true if the user needs to study this deck, false otherwise
    */
   checkDeck(deck) {
      let time = Date.now();
      let timeInDay = 86_400_000; // Number of milliseconds in a day
      return ((time - this.metadata[deck.id].timeLastStudied) >= (timeInDay * this.metadata[deck.id].timesStudied));
   }

   /**
    * Updates the given deck in metadata, to be used after the user studies it
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    */
   updateDeck(deck) {
      this.metadata[deck.id].timeLastStudied = Date.now();
      this.metadata[deck.id].timesStudied += 1;
      updateUser(this);
      if (this.id === User.getActiveUser().id) {
         User.#updateLocalUser(this);
      }
   }

   /**
    * Gets decks from the database and sorts/filters them as necessary
    * @param {boolean} sorted - Sorts according to time over deadline to study according to spatial repetition
    * @param {boolean} beingStudied - Filters to return only decks currently being studied according to metadata
    * @param {boolean} toStudy - Filters to return only decks that need to be studied according to spatial repetition
    * @param {boolean} owned - Filters to return only decks created by the user. Overrides notOwned
    * @param {boolean} notOwned - Filters to return only decks created by someone other than the user. Overridden by owned
    * @returns {Deck[]} - Array of deck objects
    */
   async getDecks(sorted = false, beingStudied = false, toStudy = false, owned = false, notOwned = false) {
      let decks = await Promise.all(Object.keys(this.metadata).map(getDeck));

      if (beingStudied) {
         decks = decks.filter((deck) => this.metadata[deck.id].beingStudied);
      }

      if (toStudy) {
         decks = decks.filter(deck => this.checkDeck(deck));
      }

      if (owned) {
         decks = decks.filter(deck => deck.creator.id === this.id);
      } else if (notOwned) {
         decks = decks.filter(deck => deck.creator.id !== this.id);
      }

      let sortFunc = ((d1, d2) => {
         let time = Date.now();
         let timeInDay = 86_400_000; // Number of milliseconds in a day

         let d1Time = (time - this.metadata[d1.id].timeLastStudied) - (timeInDay * this.metadata[d1.id].timesStudied);
         let d2Time = (time - this.metadata[d2.id].timeLastStudied) - (timeInDay * this.metadata[d2.id].timesStudied);

         return d1Time - d2Time;
      })

      if (sorted) {
         decks.sort(sortFunc)
      }

      return decks;
   }

   /**
    * @param {Deck} deck - Deck object as defined in structures/deck.js
    */
   async toggleStudy(deck) {
      this.metadata[deck.id].beingStudied = !this.metadata[deck.id].beingStudied;
      await updateUser(this);
      if (this.id === User.getActiveUser().id) {
         User.#updateLocalUser(this);
      }

   }

   /**
    * Judges whether or not this user is following the given user
    * @param {User} user
    * @returns {Boolean} - True if this user is following the other, false if otherwise
    */
   isFollowing(user) {
      return this.following.includes(user.id);
   }

   /**
    * @todo - Update database
    * Registers another user that has started to follow this one
    * Meant to be used by registerFollowing
    * @param {User} other - Other User object
    */
   async #registerFollower(other) {
      this.followers.push(other.id);
      await updateUser(this);
      if (this.id === User.getActiveUser().id) {
         User.#updateLocalUser(this);
         User.#updateLocalFollowers(this, true);
      }
   }

   /**
    * Registers another user that this one has started to follow
    * Triggers other's registerFollower method
    * @param {User} other - Other User object
    */
   async registerFollowing(other) {
      this.following.push(other.id);
      other.#registerFollower(this);
      await updateUser(this);
      if (this.id === User.getActiveUser().id) {
         User.#updateLocalUser(this);
         User.#updateLocalFollowing(other, true);
      }
   }

   /**
    * Removes a user from this user's follower list
    * @param {User} other - Other User object
    */
   async #removeFollower(other) {
      this.followers = this.followers.filter(f => f !== other.id);
      await updateUser(this);
      if (this.id === User.getActiveUser().id) {
         User.#updateLocalUser(this);
         User.#updateLocalFollowers(this, false);
      }
   }

   /**
    * Removes a user from this user's following list
    * @param {User} other - Other User object
    */
   async removeFollowing(other) {
      this.following = this.following.filter(f => f !== other.id);
      other.#removeFollower(this);
      await updateUser(this);
      if (this.id === User.getActiveUser().id) {
         User.#updateLocalUser(this);
         User.#updateLocalFollowing(other, false);
      }
   }

   /**
    * Outputs array of User objects who follow this user
    * @returns {User[]} - Array of User objects
    */
   async getFollowers() {
      return await Promise.all(this.followers.map(getUser));
   }

   /**
    * Outputs array of User objects who are followed by this user
    * @returns {User[]} - Array of User objects
    */
   async getFollowing() {
      return await Promise.all(this.following.map(getUser));
   }
}
