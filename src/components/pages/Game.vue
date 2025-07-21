<script setup lang="ts">
import Page from "../atoms/Page.vue";
import { Button, Panel } from "primevue";
import Card from "../molecules/Card.vue";
import { Deck } from "../../data/deck";
import { computed, ref } from "vue";
import { PlayArea } from "../../data/playArea";
import { Card as CardData } from "../../data/card";
import { useToast } from "primevue/usetoast";

enum Sound {
  Correct = "/correct.mp3",
  Wrong = "/wrong.wav",
  Paper = "/paper.wav",
  Select = "/select.wav",
}

const playSound = (sound: Sound) => {
  new Audio(sound).play();
};

const toast = useToast();

const deck = new Deck();
deck.shuffle();

const playArea = ref(new PlayArea(deck));
const selectedCards = ref<CardData[]>([]);
const score = ref(0);
const scale = ref(1);

playArea.value.fill();

const handleClick = (card: CardData) => {
  if (selectedCards.value.includes(card)) {
    selectedCards.value = selectedCards.value.filter((c) => c !== card);
  } else {
    selectedCards.value.push(card);
  }

  if (selectedCards.value.length === 3) {
    const isSet = CardData.isSet(
      selectedCards.value as [CardData, CardData, CardData]
    );

    if (isSet) {
      playArea.value.removeSet(selectedCards.value);
      selectedCards.value = [];
      score.value++;
      toast.add({
        summary: "This was a set!",
        life: 3000,
        severity: "success",
      });
      playSound(Sound.Correct);
    } else {
      selectedCards.value = [];
      score.value = Math.max(0, score.value - 1);
      toast.add({
        summary: "This was NOT a set!",
        life: 3000,
        severity: "error",
      });
      playSound(Sound.Wrong);
    }
  } else {
    playSound(Sound.Select);
  }
};

const handleDrawMore = () => {
  if (playArea.value.getFirstSet()) {
    toast.add({
      summary: "Cards in play area still contain a set!",
      life: 3000,
      severity: "error",
    });

    return;
  }

  if (playArea.value.cardsInPlay < PlayArea.DEFAULT_CARDS_IN_PLAY) {
    playArea.value.fill();
  } else {
    playArea.value.addColumn();
  }

  playSound(Sound.Paper);
};

const cardPositions = computed(() => {
  const cardPositions: Array<{ x: number; y: number; card: CardData }> = [];
  for (let x = 0; x < playArea.value.width; x++) {
    for (let y = 0; y < playArea.value.height; y++) {
      if (playArea.value.getCardAt(x, y)) {
        cardPositions.push({ x, y, card: playArea.value.getCardAt(x, y)! });
      }
    }
  }

  return cardPositions;
});

const handleHint = () => {
  const set = playArea.value.getFirstSet();

  if (set) {
    selectedCards.value = [set[0]];
  } else {
    toast.add({
      summary: "No more sets, draw some cards!",
      life: 3000,
      severity: "info",
    });
  }
};
</script>

<template>
  <Page>
    <h1>Set</h1>
    <div class="void">
      <Panel>
        <div class="score">
          <h3>Score {{ score }}</h3>
          <span>Cards in deck {{ playArea.cardsInDeck }}</span>
        </div>

        <div
          class="play-area"
          :style="{ '--columns': playArea.width, '--scale': scale }"
        >
          <TransitionGroup name="cards">
            <Card
              v-for="data in cardPositions"
              :key="data.card.key()"
              :card="data.card"
              :selected="selectedCards.includes(data.card)"
              @click="handleClick(data.card)"
              class="open-card"
              :style="{ '--x': data.x, '--y': data.y }"
            />
          </TransitionGroup>
        </div>

        <div class="buttons">
          <Button @click="handleDrawMore" :disabled="playArea.cardsInDeck === 0"
            >Draw More</Button
          >
          <Button @click="handleHint">Hint</Button>
        </div>
      </Panel>
    </div>
  </Page>
</template>

<style lang="scss">
.play-area {
  --card-width: 79px;
  --card-height: 110px;
  --max-width: calc(150px * var(--columns));
  --width: calc(min(100cqw, var(--max-width)) / var(--columns));
  --height: calc(var(--card-height) + 30px);
  --margin: max(0px, calc((100cqw - var(--max-width)) / 2));

  position: relative;
  container-type: inline-size;
  height: calc(var(--height) * 3);
  transform-origin: 50% 0;
}

.void {
  overflow: hidden;
}

.buttons {
  display: flex;
  gap: 10px;
}

.open-card {
  position: absolute;
  top: 0;
  left: 0;
  translate: calc(
      var(--x) * var(--width) + max(0px, (var(--width) - var(--card-width)) / 2) +
        var(--margin)
    )
    calc(var(--y) * var(--height) + 15px);
}

.score {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.cards-enter-active,
.cards-leave-active {
  z-index: 1;
  box-shadow: 1px 1px 5px 2px #444;
}

.cards-enter-from,
.cards-leave-to {
  translate: calc((min(100cqw, var(--max-width))) / 2 + var(--margin))
    calc(var(--height) * 3 + 100px);
}
</style>
