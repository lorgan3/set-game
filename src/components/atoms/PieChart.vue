<script setup lang="ts">
import { computed } from "vue";
import { CHART_COLORS } from "../../data/game";

export interface Part {
  label: string;
  color: string;
  value: number;
}

const props = defineProps<{
  parts: Part[];
  centerLabel?: string;
  size?: string;
}>();

const mappedParts = computed(() => {
  const total = props.parts.reduce((acc, part) => acc + part.value, 0);
  let sum = 0;

  return props.parts.map((part) => {
    sum += part.value;
    return {
      ...part,
      totalPercent: sum / total,
      percent: part.value / total,
    };
  });
});

const gradient = computed(() => {
  if (mappedParts.value.length === 0) {
    return CHART_COLORS[0];
  }

  return `conic-gradient(${mappedParts.value
    .map((part, i) => {
      if (i === 0) {
        return `${part.color} ${part.totalPercent * 100}%`;
      }

      if (i === props.parts.length - 1) {
        return `${part.color} ${mappedParts.value[i - 1].totalPercent * 100}%`;
      }

      return `${part.color} ${mappedParts.value[i - 1].totalPercent * 100}%, ${
        part.color
      } ${part.totalPercent * 100}%`;
    })
    .join(", ")})`;
});
</script>

<template>
  <div class="pie-chart" :style="{ width: size, 'background-image': gradient }">
    <div
      v-for="part in mappedParts"
      class="part"
      :style="{
        '--data-totalPercent': part.totalPercent,
        '--data-percent': part.percent,
      }"
    >
      <div class="label">{{ part.label }}</div>
    </div>
    <div v-if="centerLabel" class="label center-label">{{ centerLabel }}</div>
  </div>
</template>

<style lang="scss" scoped>
.pie-chart {
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  container-type: inline-size;
  margin: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;

  .part {
    --rotation: calc(
      -90deg + (var(--data-totalPercent) - (var(--data-percent) / 2)) * 360deg
    );
    --offset: -40px;

    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(calc(50cqw + var(--offset)), -50%)
      rotate(var(--rotation));
    transform-origin: calc(-50cqw - var(--offset)) 50%;

    .label {
      transform: rotate(calc(-1 * var(--rotation)));
    }
  }

  .label {
    background: #fff9;
    border-radius: 4px;
    padding: 5px;
  }

  .center-label {
    max-width: 50%;
  }
}
</style>
