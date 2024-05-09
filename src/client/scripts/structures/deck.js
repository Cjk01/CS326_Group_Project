import {User} from "./user.js"
import {Card} from "./card.js";

/**
 * Class representing a Deck (of study cards)
 */
export class Deck {
   
    /**
     * Create a deck 
     * @param {int} id - the unique identifier for each deck
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
}