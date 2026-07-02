import { playerSprites, updatePlayerPosition } from './player.js';
import { updateLivesDisplay, showMessage, hideMessage, updateBestScore } from './collision-ui.js';
import { gameLoop } from './gameLoop.js';

export const game = document.getElementById('game');
export const player = document.getElementById('player');
export const playerImg = document.getElementById('playerImg');
export const obstaclesContainer = document.getElementById('obstacles');
export const heartsContainer = document.getElementById('hearts');
export const lifeIcons = Array.from(document.querySelectorAll('#lives .heart'));
export const scoreElement = document.getElementById('score');
export const bestScoreElement = document.getElementById('bestScore');
export const message = document.getElementById('message');
export const startBtn = document.getElementById('startBtn');

export const GROUND_Y = 76;
export const GRAVITY = 1.15;
export const JUMP_FORCE = 15;
export const DOUBLE_JUMP_FORCE = 20;
export const FAST_FALL_VELOCITY = -26;
export const MAX_PLAYER_Y = 230;
export const MAX_LIVES = 3;
export const HEART_BOTTOM = 270;
export const HEART_SIZE = 40;
export const INVULNERABLE_DURATION = 1100;

export const state = {
  gameRunning: false,
  gameOver: false,
  playerY: 0,
  velocityY: 0,
  isJumping: false,
  isDucking: false,
  jumpCount: 0,
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

export function resetGame() {
  state.gameRunning = true;
  state.gameOver = false;
  state.playerY = 0;
  state.velocityY = 0;
  state.isJumping = false;
  state.isDucking = false;
  state.jumpCount = 0;
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

  scoreElement.textContent = state.score;
  obstaclesContainer.innerHTML = '';
  heartsContainer.innerHTML = '';
  player.classList.remove('duck', 'invulnerable');
  playerImg.src = playerSprites.run;

  updatePlayerPosition(state);
  updateLivesDisplay(state);
  hideMessage();

  if (state.animationId) cancelAnimationFrame(state.animationId);
  state.animationId = requestAnimationFrame(gameLoop);
}

export function endGame() {
  state.gameRunning = false;
  state.gameOver = true;
  cancelAnimationFrame(state.animationId);
  playerImg.src = playerSprites.stand;

  updateBestScore(state);

  showMessage(
    'Game Over',
    [
      'You got caught in the hallway!',
      `Final score: ${state.score}`,
      'Press R or the button to try again.',
    ],
    'Restart Game',
  );
}
