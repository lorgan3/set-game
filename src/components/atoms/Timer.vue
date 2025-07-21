<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps<{
  paused: boolean;
  duration?: number;
  onEnd?: () => void;
}>();

const time = ref(props.duration || 0);

watch(
  () => props.duration,
  (newDuration) => {
    if (newDuration !== undefined) {
      time.value = newDuration;
    }
  }
);

const update = () => {
  if (props.paused) {
    return;
  }

  if (props.duration) {
    time.value--;

    if (time.value === 0) {
      props.onEnd?.();
    }
    return;
  }

  time.value++;
};

let timerId: number;
onMounted(() => {
  timerId = window.setInterval(update, 1000);
});

onUnmounted(() => {
  window.clearInterval(timerId);
});
</script>

<template>
  <div class="timer">
    <div class="minutes">
      {{
        Math.floor(time / 60)
          .toString()
          .padStart(2, "0")
      }}
    </div>
    :
    <div class="seconds">{{ (time % 60).toString().padStart(2, "0") }}</div>
  </div>
</template>

<style lang="scss" scoped>
.timer {
  display: flex;
  align-items: baseline;
  background: #e7e7e7;
  padding: 3px 12px;
  border-radius: 32px;
  width: fit-content;
  margin: auto;

  .minutes {
    font-size: 24px;
  }
}
</style>
