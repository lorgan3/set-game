<script setup lang="ts">
import { Color, Fill, Shape } from "../../data/card";

defineProps<{
  shape: Shape;
  fill: Fill;
  color: Color;
}>();
</script>

<template>
  <div :class="`suit shape-${shape} fill-${fill} color-${color}`">
    <div class="border"></div>
    <div class="shape"></div>
  </div>
</template>

<style lang="scss" scoped>
.suit {
  position: relative;
  width: 55px;
  height: 20px;

  div {
    position: absolute;
    top: 0;
    left: 0;

    width: 55px;
    height: 20px;
    background-color: #000;
  }

  .shape {
    scale: 0.9;
  }

  .border {
    scale: 1 1.1;
  }

  &.shape-0 div {
    clip-path: path(
      "M 5,10 A 10,10 0 0 1 15,0 H 40 A 10,10 0 0 1 50,10 V 10 A 10,10 0 0 1 40,20 H 10 A 10,10 0 0 1 5,10 Z"
    );
  }

  &.shape-1 div {
    clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);
  }

  &.shape-2 div {
    clip-path: polygon(
      0% 0%,
      0% 20%,
      12.5% 10%,
      25% 0%,
      37.5% 10%,
      50% 20%,
      62.5% 10%,
      75% 0%,
      87.5% 10%,
      100% 20%,
      100% 0%,
      100% 80%,
      87.5% 90%,
      75% 100%,
      62.5% 90%,
      50% 80%,
      37.5% 90%,
      25% 100%,
      12.5% 90%,
      0% 80%,
      0% 100%
    );
  }

  &.color-0 div {
    background-color: #ec1212;
  }

  &.color-1 div {
    background-color: #0da10d;
  }

  &.color-2 div {
    background-color: #c010c0;
  }

  &.fill-0 .shape {
    background-color: var(--card-color);
  }

  &.fill-1 .shape {
    background-image: repeating-linear-gradient(
      to right,
      transparent,
      transparent 1px,
      var(--card-color) 1px,
      var(--card-color)
    );
    background-size: 3px 3px;
  }
}
</style>
