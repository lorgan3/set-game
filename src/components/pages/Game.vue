<script setup lang="ts">
import Page from "../atoms/Page.vue";
import { Button, Panel } from "primevue";
import Card from "../molecules/Card.vue";
import { Deck } from "../../data/deck";
import { computed, Ref, ref } from "vue";
import { PlayArea } from "../../data/playArea";
import { Card as CardData } from "../../data/card";
import { useToast } from "primevue/usetoast";
import Timer from "../atoms/Timer.vue";
import { enumKeys } from "../../data/util";
import { CHART_COLORS, Mode } from "../../data/game";
import {
  increaseScoreCount,
  loadScoreCount,
  loadScores,
  saveScore,
  Score,
} from "../../data/score";
import Scores from "../molecules/Scores.vue";
import PieChart from "../atoms/PieChart.vue";

enum Sound {
  Correct = "correct.mp3",
  Wrong = "wrong.wav",
  Paper = "paper.wav",
  Select = "select.wav",
  Ding = "ding.wav",
  GameOver = "gameOver.wav",
}

const audioContext = new AudioContext();
const sounds = {} as Record<Sound, AudioBuffer>;
for (const key of enumKeys(Sound)) {
  const sound = Sound[key];

  fetch(`${import.meta.env.BASE_URL}${sound}`)
    .then((res) => res.arrayBuffer())
    .then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer))
    .then((audioBuffer) => {
      sounds[sound] = audioBuffer;
    });
}

const playSound = (sound: Sound) => {
  if (sounds[sound]) {
    const source = audioContext.createBufferSource();
    source.buffer = sounds[sound];
    source.connect(audioContext.destination);

    source.start();
  }
};

const toast = useToast();

const playArea = ref<PlayArea>() as Ref<PlayArea, PlayArea>;
const selectedCards = ref<CardData[]>([]);
const score = ref(0);
const mode = ref<Mode | undefined>(undefined);
const paused = ref(true);
const hints = ref(0);
const lastHint = ref<CardData>();

const scores = ref(loadScores());
const scoreCount = ref(loadScoreCount());

const handleSelectMode = (newMode: Mode) => {
  mode.value = newMode;
  paused.value = false;

  const deck = new Deck();
  deck.shuffle();
  playArea.value = new PlayArea(deck, newMode === Mode.Infinite);

  window.requestAnimationFrame(() => {
    playArea.value.fill();
    playSound(Sound.Paper);
  });
};

const handleGameEnd = (time: number) => {
  paused.value = true;

  playSound(mode.value === Mode.Timed ? Sound.Ding : Sound.GameOver);
  toast.add({
    summary: "Game over!",
    severity: "info",
  });

  const scoreData: Score = {
    date: new Date(),
    score: score.value,
    time,
    hints: hints.value,
  };

  scores.value = saveScore(mode.value!, scoreData);
  if (mode.value === Mode.Normal) {
    scoreCount.value = increaseScoreCount(scoreData);
  }
};

const handleReset = () => {
  score.value = 0;
  hints.value = 0;
  lastHint.value = undefined;
  selectedCards.value = [];

  toast.removeAllGroups();
  playArea.value.clear();
  playSound(Sound.Paper);

  window.setTimeout(() => {
    paused.value = true;
    mode.value = undefined;
  }, 1000);
};

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
      lastHint.value = undefined;
      playArea.value.removeSet(selectedCards.value);
      selectedCards.value = [];
      score.value++;
      toast.add({
        summary: "This was a set!",
        life: 3000,
        severity: "success",
      });

      if (!playArea.value.getFirstSet() && playArea.value.cardsInDeck === 0) {
        paused.value = true;
      } else {
        playSound(Sound.Correct);
      }

      window.setTimeout(() => {
        playArea.value.fill();
      }, 700);
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
  if (!lastHint.value) {
    hints.value++;

    const set = playArea.value.getFirstSet()!;
    lastHint.value = set[Math.floor(Math.random() * set.length)];
  }

  selectedCards.value = [lastHint.value];
};

const pieTotal = computed(() =>
  Object.values(scoreCount.value).reduce((acc, value) => acc + value, 0)
);

const pieParts = computed(() =>
  Object.entries(scoreCount.value).map(([key, value], index) => ({
    label: `${value}x${key} points`,
    value,
    color: CHART_COLORS[index],
  }))
);
</script>

<template>
  <Page>
    <h1>Set</h1>
    <div class="void">
      <Panel>
        <div v-if="mode !== undefined" class="score">
          <h3>Score: {{ score }}</h3>
          <span>
            <Timer
              :key="mode"
              :paused="paused"
              :duration="mode === Mode.Timed ? 120 : 0"
              @end="handleGameEnd"
            />
          </span>
          <span class="right"
            >Cards in deck: {{ playArea?.cardsInDeck || 0 }}</span
          >
        </div>

        <div v-if="mode === undefined" class="mode-select">
          <h2>Select Mode</h2>
          <div class="modes">
            <div>
              <Button @click="handleSelectMode(Mode.Normal)">Normal</Button>
              <p>
                Try finding all sets of 3 cards that all either have the same
                attribute or a different attribute.
              </p>
            </div>
            <div>
              <Button @click="handleSelectMode(Mode.Timed)" severity="danger"
                >Timed</Button
              >
              <p>
                Try finding as many sets within the time limit of 2 minutes.
              </p>
            </div>
            <div>
              <Button @click="handleSelectMode(Mode.Infinite)" severity="help"
                >Infinite</Button
              >
              <p>
                Play as long as you like, found sets are shuffled back into the
                deck.
              </p>
            </div>
          </div>
        </div>

        <div v-else>
          <div class="play-area" :style="{ '--columns': playArea.width }">
            <TransitionGroup name="cards">
              <Card
                v-for="data in cardPositions"
                :key="data.card.key()"
                :card="data.card"
                :selected="selectedCards.includes(data.card)"
                @click="
                  !paused && data.card !== lastHint
                    ? handleClick(data.card)
                    : undefined
                "
                class="open-card"
                :style="{
                  '--x': data.x,
                  '--y': data.y,
                  '--appear-order': data.card.appearOrder,
                }"
              />
            </TransitionGroup>
          </div>

          <div class="buttons">
            <Button @click="handleHint">Hint</Button>
            <Button @click="handleReset" severity="danger">Reset</Button>
          </div>
        </div>
      </Panel>
    </div>
    <Panel v-if="pieTotal" header="High scores" toggleable>
      <div class="high-scores">
        <div class="pie-wrapper">
          <PieChart
            :parts="pieParts"
            :centerLabel="`${pieTotal} normal games played`"
          />
        </div>
        <div class="scores-wrapper">
          <Scores
            v-if="scores[Mode.Normal].length"
            title="Normal"
            :score="scores[Mode.Normal]"
            includeTime
          />
          <Scores
            v-if="scores[Mode.Timed].length"
            title="Timed"
            :score="scores[Mode.Timed]"
          />
        </div>
      </div>
    </Panel>
  </Page>
</template>

<style lang="scss" scoped>
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
  margin-bottom: 20px;
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
  margin-bottom: 20px;

  & > * {
    flex: 1;
  }

  .right {
    text-align: right;
  }
}

.mode-select {
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .modes {
    display: flex;
    padding-top: 20px;
    gap: 20px;

    @media (max-width: 720px) {
      flex-direction: column;
      text-align: center;
      max-width: 400px;
    }

    & > * {
      flex: 1;
    }

    button {
      margin-bottom: 10px;
    }

    p {
      color: #999;
      font-style: italic;
    }
  }
}

.high-scores {
  display: flex;
  gap: 20px;

  @media (max-width: 720px) {
    flex-direction: column;
  }

  .pie-wrapper {
    flex: 1;
    max-width: 500px;
  }

  .scores-wrapper {
    flex: 1;
    display: flex;
    gap: 10px;
    flex-direction: column;
  }
}

.cards-enter-active,
.cards-leave-active {
  z-index: 1;
  box-shadow: 1px 1px 5px 2px var(--p-button-contrast-hover-border-color);
}

.cards-leave-active {
  transition-delay: 0;
}

.cards-enter-from,
.cards-leave-to {
  translate: calc((min(100cqw, var(--max-width))) / 2 + var(--margin))
    calc(var(--height) * 3 + 100px);
}
</style>
