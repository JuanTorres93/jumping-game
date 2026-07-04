import { reset } from './playerLogic.js';
import { gameLoop } from './gameLoop.js';
import { updateLivesDisplay } from './collision-ui.js';
import {
  startBackgroundMusic,
  stopBackgroundMusic,
  playGameOverSound,
  setMusicVolume,
  setSfxVolume,
} from './audio.js';

export const game = document.getElementById('game');
export const player = document.getElementById('player');
export const playerImg = document.getElementById('playerImg');
export const obstaclesContainer = document.getElementById('obstacles');
export const heartsContainer = document.getElementById('hearts');
export const lifeIcons = Array.from(document.querySelectorAll('#lives .heart'));
export const scoreElement = document.getElementById('score');
export const bestScoreElement = document.getElementById('bestScore');
export const message = document.getElementById('message');
export const messageTitle = document.getElementById('messageTitle');
export const messageBody = document.getElementById('messageBody');
export const startBtn = document.getElementById('startBtn');
export const musicSlider = document.getElementById('musicSlider');
export const sfxSlider = document.getElementById('sfxSlider');

export const MAX_LIVES = 3;
export const HEART_BOTTOM = 290;
export const HEART_SIZE = 50;
export const INVULNERABLE_DURATION = 500;

export const state = {
  gameRunning: false,
  gameOver: false,
  isDucking: false,
  lives: MAX_LIVES,
  invulnerableUntil: 0,
  score: 0,
  bestScore: 0,
  speed: 5.5,
  lastTime: 0,
  nextObstacleAt: 0,
  nextHeartAt: 0,
  obstacles: [],
  hearts: [],
  animationId: null,
  lastObstacleHeightType: null,
};

export function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function showMessage(title, lines, buttonLabel) {
  messageTitle.textContent = title;
  messageBody.innerHTML = '';
  lines.forEach((line) => {
    const p = document.createElement('p');
    p.textContent = line;
    messageBody.appendChild(p);
  });
  startBtn.textContent = buttonLabel;
  message.classList.remove('hidden');
}

export function hideMessage() {
  message.classList.add('hidden');
}

export function resetGame() {
  state.gameRunning = true;
  state.gameOver = false;
  state.isDucking = false;
  state.lives = MAX_LIVES;
  state.invulnerableUntil = 0;
  state.score = 0;
  state.speed = 5.5;
  state.lastTime = 0;
  state.obstacles = [];
  state.hearts = [];
  state.lastObstacleHeightType = null;
  state.nextObstacleAt = performance.now() + 900;
  state.nextHeartAt = performance.now() + randomBetween(9000, 14000);

  reset();
  updateLivesDisplay(state);

  scoreElement.textContent = state.score;
  obstaclesContainer.innerHTML = '';
  heartsContainer.innerHTML = '';
  player.classList.remove('duck', 'invulnerable');
  player.style.bottom = '0px';
  hideMessage();

  if (state.animationId) cancelAnimationFrame(state.animationId);
  state.animationId = requestAnimationFrame(gameLoop);
  startBackgroundMusic();
}

export function endGame() {
  state.gameRunning = false;
  state.gameOver = true;

  stopBackgroundMusic();
  playGameOverSound();

  cancelAnimationFrame(state.animationId);

  if (state.score > state.bestScore) {
    state.bestScore = state.score;
    bestScoreElement.textContent = state.bestScore;
  }

  showMessage(
    'Game Over',
    [
      'You got caught in the hallway!',
      `Final score: ${state.score}`,
      'Press R, Enter, or the button to try again.',
    ],
    'Restart Game',
  );
}

musicSlider.oninput = () => {
  setMusicVolume(musicSlider.value / 100);
};

sfxSlider.oninput = () => {
  setSfxVolume(sfxSlider.value / 100);
};
