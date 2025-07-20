<script setup lang="ts">
import Game from "./components/pages/Game.vue";
</script>

<template>
  <Game />
</template>

<style>
#app {
  min-height: 100vh;

  font-size: 18px;
  overflow: hidden;
  font-family: system-ui;
}

/* http://meyerweb.com/eric/tools/css/reset/
   v2.0 | 20110126
   License: none (public domain)
*/
html,
body,
div,
span,
applet,
object,
iframe,
h1,
h2,
h3,
h4,
h5,
h6,
p,
blockquote,
pre,
a,
abbr,
acronym,
address,
big,
cite,
code,
del,
dfn,
em,
img,
ins,
kbd,
q,
s,
samp,
small,
strike,
strong,
sub,
sup,
tt,
var,
b,
u,
i,
center,
dl,
dt,
dd,
ol,
ul,
li,
fieldset,
form,
label,
legend,
table,
caption,
tbody,
tfoot,
thead,
tr,
th,
td,
article,
aside,
canvas,
details,
embed,
figure,
figcaption,
footer,
header,
hgroup,
menu,
nav,
output,
ruby,
section,
summary,
time,
mark,
audio,
video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
ol,
ul {
  list-style: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}

/* */
h1,
h2,
h3,
h4 {
  font-family: Eternal;
  color: var(--primary);
}

h4 {
  font-size: 20px;
}

h3 {
  font-size: 24px;
}

h2 {
  font-size: 32px;
}

h1 {
  font-size: 48px;
}

a {
  color: var(--highlight);
  font-weight: bold;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

.checkbox-label {
  flex-direction: row;
  white-space: nowrap;
  position: relative;
  padding-left: 30px;
  line-height: 25px;

  .label {
    margin-right: 10px;
  }

  /* Hide the browser's default checkbox */
  input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
  }

  /* Create a custom checkbox */
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 25px;
    width: 25px;
    background-color: var(--background);
  }

  /* On mouse-over, add a grey background color */
  &:hover input ~ .checkmark {
    background-color: var(--background-dark);
  }

  /* When the checkbox is checked, add a blue background */
  input:checked ~ .checkmark {
    background-color: var(--highlight-background);
  }

  /* Create the checkmark/indicator (hidden when not checked) */
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }

  /* Show the checkmark when checked */
  input:checked ~ .checkmark:after {
    display: block;
  }

  /* Style the checkmark/indicator */
  .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid var(--highlight);
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
  }
}
</style>
