<script setup lang="ts">
import { Card } from "../../data/card";
import Suit from "../atoms/Suit.vue";

defineProps<{
  card: Card;
  selected: boolean;
}>();
</script>

<template>
  <div :class="{ card: true, 'card--selected': selected }">
    <Suit
      v-for="index in card.count + 1"
      :fill="card.fill"
      :shape="card.shape"
      :color="card.color"
    />
  </div>
</template>

<style lang="scss" scoped>
.card {
  --card-color: #f3f5eb;

  width: var(--card-width, 63px);
  height: var(--card-height, 88px);
  border: 1px solid black;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10%;
  background-color: var(--card-color);
  cursor: pointer;
  transition: transform 0.2s, translate 1s, box-shadow 0.2s;
  box-shadow: 0 0 5px -1px #444;

  &:hover {
    transform: translateY(-4px);
  }

  &--selected {
    box-shadow: 1px 1px 5px 2px #444;
  }
}
</style>
