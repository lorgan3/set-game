<script setup lang="ts">
import { onMounted, ref, TransitionGroup } from "vue";
import { Card as CardData } from "../../data/card";
import Card from "../molecules/Card.vue";
import { playSound, Sound } from "../../data/sound";

const exampleSet = ref<CardData[]>([]);

const createSet = () => {
  let cards: [CardData, CardData];

  do {
    cards = [CardData.createCard(), CardData.createCard()];
  } while (cards[0].isEqual(cards[1]));

  return [...cards, CardData.createSetCard(cards)];
};

onMounted(() => {
  exampleSet.value = createSet();
});

const handleCreateSet = () => {
  exampleSet.value = createSet();
  playSound(Sound.Correct);
};
</script>

<template>
  <div class="tutorial">
    <p>
      Set is a card game where every card has 4 attributes with 3 possible
      values resulting in 3x3x3x3 = 81 possible combinations.
    </p>
    <p>
      The goal is to find all sets of 3 cards that all either have the same
      attribute or a different attribute.
    </p>
    <p>Click the cards to create a new example set.</p>

    <div class="example-set">
      <TransitionGroup name="cards">
        <Card
          v-for="index in exampleSet.length"
          :key="exampleSet[index - 1].key() + index"
          :card="exampleSet[index - 1]"
          :selected="false"
          @click="handleCreateSet"
          class="example-card"
          :style="{
            '--x': index - 1,
          }"
        />
      </TransitionGroup>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tutorial {
  text-align: center;
  text-wrap: balance;
  position: relative;
  padding-bottom: calc(var(--card-height) + 15px);
  container-type: inline-size;
  width: 100%;

  .example-set {
    --columns: 3;
    --max-width: calc(150px * var(--columns));
    --width: calc(min(100cqw, var(--max-width)) / var(--columns));
    --card-overlap: max(
      0px,
      calc((var(--card-width) - var(--width))) / var(--columns)
    );
    --height: calc(var(--card-height) + 30px);
    --margin: max(0px, calc((100cqw - var(--max-width)) / 2));

    .example-card {
      position: absolute;
      bottom: 0;
      left: 0;
      translate: calc(
          var(--x) * (var(--width) - var(--card-overlap)) +
            max(0px, (var(--width) - var(--card-width)) / 2) + var(--margin)
        )
        0;
    }

    .cards-enter-active,
    .cards-leave-active {
      box-shadow: 1px 1px 5px 2px var(--p-button-contrast-hover-border-color);
    }

    .cards-enter-from {
      translate: calc(var(--card-width) * -1) 0;
    }

    .cards-leave-to {
      translate: calc(100cqw + var(--card-width)) 0;
    }
  }
}
</style>
