/**
 * Class representing a Card for a particular question/answer
 */
export class Card {

    /**
     * Creates a Card
     * @param {string} card_type - multiple choice, true/false, etc
     * @param {string} question - the question text
     * @param {string} answer - the question answer
     * @param {Object} metadata - to be defined more clearly later (maybe turn into a class)
     */
   constructor(card_type = null, question = null, answer = null, metadata = null) {
     this.card_type = card_type;
     this.question = question;
     this.answer = answer;
     this.metadata = metadata;
   }
}