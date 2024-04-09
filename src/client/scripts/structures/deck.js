/**
 * Class representing a Deck (of study cards)
 */
class Deck {

    /**
     * Create a deck 
     * @param {int} id - the unique identifier
     * @param {string} topic - the study topic (ex. Math)
     * @param {Card[]} cards - the cards themselves (defined in card.js)
     * @param {User} creator - the creator of the deck(defined in user.js)
     */
    constructor(id = null , topic = null, cards = null, creator = null) {
        this.id = id;
        this.topic = topic;
        this.cards = cards;
        this.creator = creator;
    }
    //add more later if needed
}