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
}
