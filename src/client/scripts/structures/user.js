import { getDeck, getUser, updateUser, deleteDeck } from "../data_interface/data.js";
import { Deck } from "./deck.js";
import { getActiveUser, updateActiveUser, updateActiveDecks, updateActiveFollowing } from "../data_interface/localDB.js"

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
    * Registers a deck's id in the metadata field along with necessary information if it doesn't already exists.
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    * @returns {boolean} - true if user successfully registers, false if already has it
    */
   async registerDeck(deck) {
      if (deck.id in this.metadata) {
         return false;
      } else {
         this.metadata[deck.id] = {timeLastStudied: Date.now(), timesStudied: 0, beingStudied: true};

         await updateUser(this);

         if (this.id === await getActiveUser().then(u => u.id)) {
            await updateActiveUser(this);
            await updateActiveDecks(deck, true);
         }

         return true;
      }
   }

   /**
    * Deletes an owned deck from database
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    * @returns {boolean} - true if user successfully deletes, false if doesn't have or doesn't own
    */
   async deleteOwnedDeck(deck) {
      if (!(deck.id in this.metadata) || (deck.creator.id !== this.id)) {
         return false;
      }

      delete this.metadata[deck.id];
      await deleteDeck(deck.id);

      await updateUser(this);

      if (this.id === await getActiveUser().then(u => u.id)) {
         await updateActiveUser(this);
         await updateActiveDecks(deck, false);
      }

      return true;
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
   async updateDeck(deck) {
      this.metadata[deck.id].timeLastStudied = Date.now();
      this.metadata[deck.id].timesStudied += 1;
      await updateUser(this);
      if (this.id === await getActiveUser().then(u => u.id)) {
         await updateActiveUser(this);
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
      if (decks.length === 0) {
         return decks;
      }

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
      if (this.id === await getActiveUser().then(u => u.id)) {
         await updateActiveUser(this);
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
   }

   /**
    * Registers another user that this one has started to follow
    * Triggers other's registerFollower method
    * @param {User} other - Other User object
    */
   async registerFollowing(other) {
      if (this.following.includes(other.id)) {
         return;
      }
      this.following.push(other.id);
      other.#registerFollower(this);
      await updateUser(this);
      if (this.id === await getActiveUser().then(u => u.id)) {
         await updateActiveUser(this);
         await updateActiveFollowing(other, true);
      }
   }

   /**
    * Removes a user from this user's follower list
    * @param {User} other - Other User object
    */
   async #removeFollower(other) {
      this.followers = this.followers.filter(f => f !== other.id);
      await updateUser(this);
   }

   /**
    * Removes a user from this user's following list
    * @param {User} other - Other User object
    */
   async removeFollowing(other) {
      if (!this.following.includes(other.id)) {
         return;
      }
      this.following = this.following.filter(f => f !== other.id);
      other.#removeFollower(this);
      await updateUser(this);
      if (this.id === await getActiveUser().then(u => u.id)) {
         await updateActiveUser(this);
         await updateActiveFollowing(other, false);
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
