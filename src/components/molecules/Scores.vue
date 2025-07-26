<script setup lang="ts">
import { Tag } from "primevue";
import { Score } from "../../data/score";

defineProps<{
  title: string;
  score: Score[];
  includeTime?: boolean;
}>();

const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "short",
  timeStyle: "short",
});
</script>

<template>
  <div class="scores">
    <h4>{{ title }}</h4>
    <ol>
      <li v-for="item in score" :key="item.date.toString()" class="score">
        <div class="primary">
          <Tag v-if="includeTime" class="time">{{ formatTime(item.time) }}</Tag>
          <Tag v-else class="time">{{ item.score }} points</Tag>
          <span class="date">{{
            dateFormatter.format(new Date(item.date))
          }}</span>
        </div>
        <div class="meta">
          <span v-if="includeTime">{{ item.score }} points - </span
          >{{ item.hints }}
          hints used
        </div>
      </li>
    </ol>
  </div>
</template>

<style lang="scss" scoped>
.scores {
  h4 {
    margin-bottom: 6px;
  }

  ol {
    list-style: decimal;
    margin-left: 20px;
  }

  .score {
    max-width: 270px;
    padding: 4px;

    .primary {
      display: flex;
      justify-content: space-between;
    }

    .meta {
      font-size: 0.8em;
      color: #999;
    }
  }
}
</style>
