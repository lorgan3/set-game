import { Card } from "./card";
import { Deck } from "./deck";

export class PlayArea {
  static DEFAULT_CARDS_IN_PLAY = 12;
  static DEFAULT_WIDTH = 4;

  private area: Array<Array<Card | undefined>> = [];
  private _width = 0;
  private _height = 0;
  private _cardsInPlay = 0;

  constructor(private deck: Deck) {}

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  get cardsInPlay() {
    return this._cardsInPlay;
  }

  get cardsInDeck() {
    return this.deck.allCards.length;
  }

  getCardAt(x: number, y: number): Card | undefined {
    if (!this.area[x]) {
      return undefined;
    }

    return this.area[x][y];
  }

  setCardAt(x: number, y: number, card: Card) {
    if (!this.area[x]) {
      this.area[x] = [];
    }

    if (!this.area[x][y]) {
      this._cardsInPlay++;
    }

    this.area[x][y] = card;
  }

  removeCard(card: Card) {
    for (let x = 0; x < this.width; x++) {
      for (let y = 0; y < this.height; y++) {
        if (this.getCardAt(x, y) === card) {
          delete this.area[x][y];
          this._cardsInPlay--;
          return;
        }
      }
    }
  }

  fill() {
    this._width = Math.max(PlayArea.DEFAULT_WIDTH, this._width);
    this._height = Math.max(
      Math.ceil(PlayArea.DEFAULT_CARDS_IN_PLAY / PlayArea.DEFAULT_WIDTH),
      this._height
    );

    if (this._cardsInPlay < PlayArea.DEFAULT_CARDS_IN_PLAY) {
      for (let x = 0; x < this.width; x++) {
        for (let y = 0; y < this.height; y++) {
          if (!this.getCardAt(x, y)) {
            const card = this.deck.draw();

            if (card) {
              this.setCardAt(x, y, card);
            }
          }
        }
      }
    }
  }

  addColumn() {
    const x = this.width;
    this._width++;

    for (let y = 0; y < this.height; y++) {
      if (!this.getCardAt(x, y)) {
        const card = this.deck.draw();

        if (card) {
          this.setCardAt(x, y, card);
        }
      }
    }
  }

  private getCards() {
    return this.area.flat().filter((card) => card !== undefined) as Card[];
  }

  hasSets() {
    const cards = this.getCards();

    for (let i = 0; i < cards.length; i++) {
      for (let j = i + 1; j < cards.length; j++) {
        for (let k = j + 1; k < cards.length; k++) {
          if (Card.isSet([cards[i], cards[j], cards[k]])) {
            console.log({ ...cards[i] }, { ...cards[j] }, { ...cards[k] });
            return true;
          }
        }
      }
    }

    return false;
  }

  removeSet(cards: Card[]) {
    for (let card of cards) {
      this.removeCard(card);
    }
  }
}
