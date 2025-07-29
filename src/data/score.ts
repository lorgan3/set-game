import { Mode } from "./game";

export interface Score {
  date: Date;
  score: number;
  time: number;
  hints: number;
}

const MAX_SCORES = 10;
const SCORE_KEY = "score";
const SCORE_COUNT_KEY = "scoreCount";

export const loadScores = () => {
  try {
    const scores = localStorage.getItem(SCORE_KEY);
    if (scores) {
      return JSON.parse(scores) as {
        [Mode.Normal]: Score[];
        [Mode.Timed]: Score[];
      };
    }

    return { [Mode.Normal]: [], [Mode.Timed]: [] };
  } catch (error) {
    return { [Mode.Normal]: [], [Mode.Timed]: [] };
  }
};

export const saveScore = (mode: Mode, score: Score) => {
  const allScores = loadScores();
  if (mode === Mode.Infinite) {
    return allScores;
  }

  const scores = allScores[mode];
  const lowestScore = scores.at(-1);

  if (
    scores.length < MAX_SCORES ||
    (mode === Mode.Normal
      ? score.time < lowestScore!.time
      : score.score < lowestScore!.score)
  ) {
    scores.push(score);
  }

  if (mode === Mode.Normal) {
    scores.sort(
      (a, b) => a.time - b.time || b.score - a.score || a.hints - b.hints
    );
  } else {
    scores.sort((a, b) => b.score - a.score || a.hints - b.hints);
  }

  allScores[mode] = scores.slice(0, MAX_SCORES);

  try {
    localStorage.setItem(SCORE_KEY, JSON.stringify(allScores));
  } catch {}

  return allScores;
};

export const loadScoreCount = () => {
  try {
    const count = localStorage.getItem(SCORE_COUNT_KEY);
    if (count) {
      return JSON.parse(count) as Record<number, number>;
    }

    return {};
  } catch (error) {
    return {};
  }
};

export const increaseScoreCount = (score: Score) => {
  const scoreCount = loadScoreCount();
  scoreCount[score.score] = (scoreCount[score.score] || 0) + 1;

  try {
    localStorage.setItem(SCORE_COUNT_KEY, JSON.stringify(scoreCount));
  } catch {}

  return scoreCount;
};
