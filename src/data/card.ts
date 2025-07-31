import { getRandomValue, getSetProperty } from "./util";

export enum Color {
  Red,
  Green,
  Purple,
}

export enum Shape {
  Pill,
  Diamond,
  Squiggly,
}

export enum Fill {
  Empty,
  Lines,
  Filled,
}

export enum Count {
  One,
  Two,
  Three,
}

export class Card {
  public appearOrder = 0;

  constructor(
    public color: Color,
    public shape: Shape,
    public fill: Fill,
    public count: Count
  ) {}

  get properties() {
    return [this.color, this.shape, this.fill, this.count];
  }

  key() {
    return this.properties.join("-");
  }

  setAppearOrder(order: number) {
    this.appearOrder = order;
  }

  isEqual(other: Card) {
    const otherProperties = other.properties;
    for (let index in this.properties) {
      if (otherProperties[index] !== this.properties[index]) {
        return false;
      }
    }

    return true;
  }

  static isSet(cards: [Card, Card, Card]): boolean {
    const sums = cards.reduce(
      (sums, card) => {
        card.properties.forEach((property, index) => {
          sums[index] += property;
        });
        return sums;
      },
      [0, 0, 0, 0]
    );

    return sums.every((sum) => sum % 3 === 0);
  }

  static createSetCard(cards: [Card, Card]) {
    return new Card(
      getSetProperty(cards[0].color, cards[1].color, Color),
      getSetProperty(cards[0].shape, cards[1].shape, Shape),
      getSetProperty(cards[0].fill, cards[1].fill, Fill),
      getSetProperty(cards[0].count, cards[1].count, Count)
    );
  }

  static createCard() {
    return new Card(
      getRandomValue(Color),
      getRandomValue(Shape),
      getRandomValue(Fill),
      getRandomValue(Count)
    );
  }
}
