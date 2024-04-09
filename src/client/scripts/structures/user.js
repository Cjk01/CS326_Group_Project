
/** 
 * Class representing a User (of Cachely!)
 */
export class User {
    
    /**
     * Creates a User
     * @param {int} id - a unique identifier 
     * @param {string} username - the username text
     * @param {Object} metadata - to be defined more later
     * @param {string[]} followers - stores followers of the User
     * @param {string[]} following - stores those being followed by the User
     */
   constructor(id = null, username = null, metadata = null, followers = null, following = null) {
      this.id = id;
      this.username = username;
      this.metadata = metadata;
      this.followers = followers;
      this.following = following;
   }
}