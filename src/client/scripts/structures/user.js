import { getUserByID, getDeckByID } from "../../../server/db.js"

/** 
 * Class representing a User (of Cachely!)
 */
export class User {
    /**
     * Creates a User
     * @param {int} id - a unique identifier 
     * @param {string} username - the username text
     * @param {int[]} followers - stores IDs of followers of the User
     * @param {int[]} following - stores IDs of those being followed by the User
     * @param {Object} metadata - Object mapping Deck IDs to study information
     * Study information is an object including two keys
     * timeLastStudied - The time in milliseconds since the Epoch at the time the deck was last studied
     * timesStudied - The number of times the deck has been studied, to be used for spatial repetition
     */
   constructor(id = null, username = null, followers = null, following = null, metadata = {},) {
      this.id = id;
      this.username = username;
      this.followers = followers;
      this.following = following;
      this.metadata = metadata;
   }

   /**
    * @todo - Update database after registry
    * Registers a deck's id in the metadata field along with necessary information
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    */
   registerDeck(deck) {
      this.metadata[deck.id] = {};
      this.metadata[deck.id].timeLastStudied = Date.now();
      this.metadata[deck.id].timesStudied = 0;
   }

   /**
    * Checks whether the user needs to study a given deck based on spatial repetition
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    * @returns {boolean} - true if the user needs to study this deck, false otherwise
    */
   checkDeck(deck) {
      let time = Date.now();
      let timeInDay = Number("8.64e+7"); // Number of milliseconds in a day
      return ((time - this.metadata[deck.id].timeLastStudied) >= (timeInDay * this.metadata[deck.id].timesStudied));
   }

   /**
    * @todo - Modify to update database
    * Updates the given deck in metadata, to be used after the user studies it
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    */
   updateDeck(deck) {
      this.metadata[deck.id].timeLastStudied = Date.now();
      this.metadata[deck.id].timesStudied += 1;
   }

   /**
    * Gets decks from the database and sorts/filters them as necessary
    * @param {boolean} sorted - Sorts according to time over deadline to study according to spatial repetition
    * @param {boolean} toStudy - Filters to return only decks that need to be studied according to spatial repetition
    * @param {boolean} owned - Filters to return only decks created by the user. Overrides notOwned
    * @param {boolean} notOwned - Filters to return only decks created by someone other than the user. Overridden by owned
    * @returns 
    */
   async getDecks(sorted = false, toStudy = false, owned = false, notOwned = false) {
      let deckIds = Object.keys(this.metadata);
      
      if (toStudy) {
         deckIds = deckIds.filter(this.checkDeck);
      }

      let sortFunc = ((id1, id2) => {
         let time = Date.now();
         let timeInDay = Number("8.64e+7"); // Number of milliseconds in a day

         let d1Time = (time - this.metadata[id1].timeLastStudied) - (timeInDay * this.metadata[d1].timesStudied);
         let d2Time = (time - this.metadata[id2].timeLastStudied) - (timeInDay * this.metadata[d2].timesStudied);

         return d1Time - d2Time;
      })

      if (sorted) {
         deckIds.sort(sortFunc)
      }

      let decks = await Promise.all(deckIds.map(getDeckByID));

      if (owned) {
         decks = decks.filter(deck => deck.creator.id === this.id);
      } else if (notOwned) {
         decks = decks.filter(deck => deck.creator.id !== this.id);
      }

      return decks;
   }
   

   /**
    * Outputs array of User objects who follow this user
    * @returns {User[]} - Array of User objects
    */
   async getFollowers() {
      return await Promise.all(this.followers.map(getUserByID));
   }

   /**
    * Outputs array of User objects who this user follows
    * @returns {User[]} - Array of User objects
    */
   async getFollowing() {
      return await Promise.all(this.following.map(getUserByID));
   }
}