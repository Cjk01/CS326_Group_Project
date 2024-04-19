
/** 
 * Class representing a User (of Cachely!)
 */
export class User {
    
    /**
     * Creates a User
     * @param {int} id - a unique identifier 
     * @param {string} username - the username text
     * @param {Number[]} followers - stores followers of the User
     * @param {Number[]} following - stores those being followed by the User
     * @param {Object} metadata - Object mapping Deck IDs to study information
     * Study information is an object including three keys
     * timeLastStudied - The time in milliseconds since the Epoch at the time the deck was last studied
     * timesStudied - The number of times the deck has been studied, to be used for spatial repetition
     * beingStudied - A boolean indicating whether the deck is being actively studied
     * 
     */
   constructor(id = null, username = null, followers = null, following = null, metadata = {}) {
      this.id = id;
      this.username = username;
      this.followers = followers;
      this.following = following;
      this.metadata = metadata;
   }

   /**
    * An abstraction to get the active user from local storage. Unnecessary, but there if you want it.
    * @returns {User} - The active (logged in) user object
    */
   static getActiveUser() {
      return localStorage.getItem("active-user");
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
      this.metadata[deck.id].beingStudied = true;
   }

   /**
    * Checks whether the user needs to study a given deck based on spatial repetition
    * @param {Deck} deck - Deck object as defined in /structures/deck.js
    * @returns {boolean} - true if the user needs to study this deck, false otherwise
    */
   checkDeck(deck) {
      let time = Date.now();
      let timeInDay = 86400000; // Number of milliseconds in a day
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
    * Utility method for comparing the current state of a user's deck list to local storage.
    * Not needed elsewhere
    * @param {Number[]} d1 - Array of Deck IDs
    * @param {Number[]} d2 - Array of Deck IDs
    * @returns 
    */
   _compareUserDecks(d1, d2) {
      if (d1.length !== d2.length) {
         return false;
      }
      for (let i = 0; i < d1.length; i++) {
         if (d1[i] !== d2[i]) {
            return false;
         }
      }
      return true
   }

   /**
    * Loads in decks saved or created by the user. If the user is the active user, stores in/fetches from localStorage
    * @returns {Deck[]} - Array of Deck objects
    */
   async loadDecks() {
      if (this.id === localStorage.getItem("active-user").id) { // Check if user is active user
         if (this._compareUserDecks(Object.keys(this.metadata), localStorage.getItem("user-decks"))) { // Check for changes, probably a better way to do it
            return localStorage.getItem("user-decks");
         } else {
            let decks = await Promise.all(Object.keys(this.metadata).map(getDeck));
            localStorage.setItem("user-decks", decks);
         }
      } else {
         return await Promise.all(Object.keys(this.metadata).map(getDeck));
      }
   }

   /**
    * Gets decks from the database and sorts/filters them as necessary
    * With no parameters, functions the same as loadDecks. You do not need to call load decks before using this.
    * @param {boolean} sorted - Sorts according to time over deadline to study according to spatial repetition
    * @param {boolean} toStudy - Filters to return only decks that need to be studied according to spatial repetition
    * @param {boolean} owned - Filters to return only decks created by the user. Overrides notOwned
    * @param {boolean} notOwned - Filters to return only decks created by someone other than the user. Overridden by owned
    * @returns {Deck[]} - Array of deck objects 
    */
   async filterDecks(sorted = false, toStudy = false, owned = false, notOwned = false) {
      let decks = await this.loadDecks();
      
      if (toStudy) {
         decks = decks.filter(this.checkDeck);
      }

      let sortFunc = ((d1, d2) => {
         let time = Date.now();
         let timeInDay = 86400000; // Number of milliseconds in a day

         let d1Time = (time - this.metadata[d1.id].timeLastStudied) - (timeInDay * this.metadata[d1.id].timesStudied);
         let d2Time = (time - this.metadata[d2.id].timeLastStudied) - (timeInDay * this.metadata[d2.id].timesStudied);

         return d1Time - d2Time;
      })

      if (sorted) {
         decks.sort(sortFunc)
      }

      if (owned) {
         decks = decks.filter(deck => deck.creator.id === this.id);
      } else if (notOwned) {
         decks = decks.filter(deck => deck.creator.id !== this.id);
      }

      return decks;
   }

   /**
    * @todo - Update database
    * @param {Deck} deck - Deck object as defined in structures/deck.js
    */
   async toggleStudy(deck) {
      this.metadata[deck.id].beingStudied = !this.metadata[deck.id].beingStudied;

   }
   
   /**
    * @todo - Update database
    * Registers another user that has started to follow this one
    * Meant to be used by registerFollowing
    * @param {User} other - Other User object
    */
   async _registerFollower(other) {
      this.followers.push(other.id);
   }

   /**
    * @todo - Update database
    * Registers another user that this one has started to follow
    * Triggers other's registerFollower method
    * @param {User} other - Other User object
    */
   async registerFollowing(other) {
      this.followers.push(other.id);
      other._registerFollower(this);
   }
   
   /**
    * @todo - Update database
    * Removes a user from this user's follower list
    * @param {User} other - Other User object 
    */
   async _removeFollower(other) {
      this.followers = this.followers.filter(f => f !== other.id);
   }

   /**
    * @todo - Update database
    * Removes a user from this user's following list
    * @param {User} other - Other User object 
    */
   async removeFollowing(other) {
      this.following = this.following.filter(f => f !== other.id);
      other._removeFollower(this);
   }

   /**
    * Utility method for comparing the current state of a user's follow lists to local storage.
    * Not needed elsewhere
    * @param {Number[]} f1 - Array of user IDs
    * @param {Number[]} f2 - Array of user IDs
    * @returns boolean - true if arrays are the same, false if not
    */
   _compareUsersArrs(f1, f2) {
      if (f1.length !== f2.length) {
         return false;
      }
      for (let i = 0; i < f1.length; i++) {
         if (f1[i] !== f2[i]) {
            return false;
         }
      }
      return true;
   }

   /**
    * Outputs array of User objects who follow this user
    * Stores in/Retrieves from local storage for active user
    * @returns {User[]} - Array of User objects
    */
   async loadFollowers() {
      if (this.id === localStorage.getItem("active-user")) {
         if (this._compareUsersArrs(this.followers, localStorage.getItem("user-followers").map(u => u.id))) {
            return localStorage.get("user-followers");
         } else {
            let followers = await Promise.all(this.followers.map(getUser));
            localStorage.setItem("user-followers", followers);
            return followers
         }
      }
      return await Promise.all(this.followers.map(getUser));
   }

   /**
    * Outputs array of User objects who are followed by this user
    * Stores in/Retrieves from local storage for active user
    * @returns {User[]} - Array of User objects
    */
   async loadFollowing() {
      if (this.id === localStorage.getItem("active-user")) {
         if (this._compareUsersArrs(this.following, localStorage.getItem("user-following").map(u => u.id))) {
            return localStorage.get("user-following");
         } else {
            let following = await Promise.all(this.following.map(getUser));
            localStorage.setItem("user-followers", following);
            return following
         }
      }
      return await Promise.all(this.following.map(getUser));
   }
}