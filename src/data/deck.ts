import { Card, Color, Count, Fill, Shape } from "./card";
import { enumKeys } from "./util";

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = [];

    for (let color of enumKeys(Color)) {
      for (let shape of enumKeys(Shape)) {
        for (let fill of enumKeys(Fill)) {
          for (let count of enumKeys(Count)) {
            this.cards.push(
              new Card(Color[color], Shape[shape], Fill[fill], Count[count])
            );
          }
        }
      }
    }
  }

  get allCards() {
    return this.cards;
  }

  draw() {
    return this.cards.pop();
  }

  insert(cards: Card[], random = false) {
    if (!random) {
      this.cards.unshift(...cards);
      return;
    }

    for (let card of cards) {
      this.cards.splice(Math.floor(Math.random() * this.cards.length), 0, card);
    }
  }

  shuffle() {
    let currentIndex = this.cards.length;
    let temporaryValue: Card;
    let randomIndex: number;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = this.cards[currentIndex];
      this.cards[currentIndex] = this.cards[randomIndex];
      this.cards[randomIndex] = temporaryValue;
    }
  }
}
