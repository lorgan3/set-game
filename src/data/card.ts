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

export enum PropertyEvaluation {
  AllEqual,
  AllDifferent,
  Mixed,
}

export class Card {
  public appearOrder = 0;

  static propertyNames = ["color", "shape", "fill", "count"];

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

  static isSet(cards: [Card, Card, Card]) {
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

  static evaluateSet(cards: [Card, Card, Card]) {
    const cardProperties = cards.map((card) => card.properties);
    const properties = new Array(4)
      .fill(0)
      .map((_, i) => cardProperties.map((props) => props[i]));

    return properties.map((props) => {
      if (props.every((prop) => prop === props[0])) {
        return PropertyEvaluation.AllEqual;
      }

      const sum = props.reduce((sum, prop) => sum + prop, 0);
      if (sum % 3 === 0) {
        return PropertyEvaluation.AllDifferent;
      }

      return PropertyEvaluation.Mixed;
    });
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
