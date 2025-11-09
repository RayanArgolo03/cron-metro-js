"use strict";

(function switchFocusedButton() {
  const buttons = [...document.querySelectorAll(".app__card-button")];

  const activeClass = "active";

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const focusedButton = buttons.find((button) =>
        button.classList.contains(activeClass)
      );

      const isTheSameButton = focusedButton === button;

      if (isTheSameButton) return;

      focusedButton.classList.remove(activeClass);
      button.classList.add(activeClass);

      switchContext(button);
    });
  });
})();

const CONTEXT_KEYS = {
  CLASS: Symbol(),
  TITLE: Symbol(),
  STRONG: Symbol(),
  IMAGE_SRC: Symbol(),
  TIMER: Symbol(),
};

const CONTEXTS = [
  {
    [CONTEXT_KEYS.CLASS]: "foco",
    [CONTEXT_KEYS.TITLE]: "Otimize sua produtividade,",
    [CONTEXT_KEYS.STRONG]: "mergulhe no que importa",
    [CONTEXT_KEYS.IMAGE_SRC]: "/imagens/foco.png",
    [CONTEXT_KEYS.TIMER]: "25:00",
  },
  {
    [CONTEXT_KEYS.CLASS]: "descanso-curto",
    [CONTEXT_KEYS.TITLE]: "Que tal dar uma respirada?",
    [CONTEXT_KEYS.STRONG]: "Faça uma pausa curta!",
    [CONTEXT_KEYS.IMAGE_SRC]: "/imagens/descanso-curto.png",
    [CONTEXT_KEYS.TIMER]: "05:00",
  },
  {
    [CONTEXT_KEYS.CLASS]: "descanso-longo",
    [CONTEXT_KEYS.TITLE]: "Hora de voltar à superfície.",
    [CONTEXT_KEYS.STRONG]: "Faça uma pausa longa.",
    [CONTEXT_KEYS.IMAGE_SRC]: "/imagens/descanso-longo.png",
    [CONTEXT_KEYS.TIMER]: "15:00",
  },
];

let interval = null;

function switchContext(button) {
  const buttonContext = button.dataset.contexto;

  const htmlEl = document.documentElement,
    imageEl = document.querySelector(".app__image"),
    titleEl = document.querySelector(".app__title"),
    strongEl = document.querySelector(".app__title-strong"),
    timerEl = document.querySelector(".app__card-timer");

  const newContext = CONTEXTS.find(
    (context) => context[CONTEXT_KEYS.CLASS] === buttonContext
  );

  htmlEl.setAttribute("data-contexto", newContext[CONTEXT_KEYS.CLASS]);
  imageEl.setAttribute("src", newContext[CONTEXT_KEYS.IMAGE_SRC]);
  titleEl.firstChild.textContent = newContext[CONTEXT_KEYS.TITLE];
  strongEl.textContent = newContext[CONTEXT_KEYS.STRONG];
  timerEl.textContent = newContext[CONTEXT_KEYS.TIMER];

  if (interval) pausePomodoro();
}

const TIMER_TEXT_CONTEXTS = {
  START_TEXT_CONTEXT: "Começar",
  PAUSE_TEXT_CONTEXT: "Pausar",
  SAVE_TEXT_CONTEXT: "Salvar",
};

const START_PAUSE_BTN = document.getElementById("start-pause");
const SPAN_BTN = document.querySelector(".app__card-primary-butto-text");
const ICON_BTN = START_PAUSE_BTN.querySelector(".app__card-primary-butto-icon");

(function initPomodoro() {
  START_PAUSE_BTN.addEventListener("click", () => {
    switch (SPAN_BTN.textContent) {
      case TIMER_TEXT_CONTEXTS.START_TEXT_CONTEXT:
        startPomodoro();
        break;
      case TIMER_TEXT_CONTEXTS.PAUSE_TEXT_CONTEXT:
        pausePomodoro();
        break;
      case TIMER_TEXT_CONTEXTS.SAVE_TEXT_CONTEXT:
        break;
      default:
        throw new Error("Error occurred! Try again later");
    }
  });
})();

const PLAY_MUSIC_SRC = "/sons/play.wav";

const TIMER = document.querySelector(".app__card-timer");
const TIMEOUT_IN_MILIS = 500;
const INTERVAL_IN_MILIS = 1000;

function startPomodoro() {
  SPAN_BTN.textContent = TIMER_TEXT_CONTEXTS.PAUSE_TEXT_CONTEXT;
  ICON_BTN.setAttribute("src", TIMER_IMAGES.PAUSE_IMAGE);

  playMusicIfChecked(PLAY_MUSIC_SRC);

  const timeStringArray = TIMER.textContent.split(":");

  const startMinutesString = timeStringArray[0],
    startSecondsString = timeStringArray[1];

  let minutes = parseInt(startMinutesString),
    seconds = parseInt(startSecondsString);

  interval = setInterval(() => {
    const isZeroSecond = seconds === 0;
    if (isZeroSecond) {
      minutes--;
      seconds = 60;
    }

    seconds--;

    const isTimerFinished = minutes === -1;

    if (isTimerFinished) {
      setTimeout(() => {
        pausePomodoro();
        TIMER.textContent = `${startMinutesString}:${startSecondsString}`;
      }, TIMEOUT_IN_MILIS);

      return;
    }

    TIMER.textContent = formatTimeToString(minutes, seconds);
  }, INTERVAL_IN_MILIS);
}

function formatTimeToString(minutes, seconds) {
  const minutesString = String(minutes);
  const secondsString = String(seconds).padStart(2, "0");

  return `${minutesString}:${secondsString}`;
}

const PAUSE_MUSIC_SRC = "/sons/pause.mp3";

function pausePomodoro() {
  SPAN_BTN.textContent = TIMER_TEXT_CONTEXTS.START_TEXT_CONTEXT;
  ICON_BTN.setAttribute("src", TIMER_IMAGES.START_IMAGE);
  playMusicIfChecked(PAUSE_MUSIC_SRC);

  clearInterval(interval);
  interval = null;
}

const MUSIC_CHECKBOX = document.getElementById("alternar-musica");

function playMusicIfChecked(musicSrc) {
  const isMusicSelected = MUSIC_CHECKBOX.checked;
  if (isMusicSelected) new Audio(musicSrc).play();
}
