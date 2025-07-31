import { enumKeys } from "./util";

export enum Sound {
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

export const playSound = (sound: Sound) => {
  if (sounds[sound]) {
    const source = audioContext.createBufferSource();
    source.buffer = sounds[sound];
    source.connect(audioContext.destination);

    source.start();
  }
};
