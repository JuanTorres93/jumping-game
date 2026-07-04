import { state } from './engine.js';
import {
  createObstacle,
  moveObstacles,
  moveHeart,
  createHeart,
} from './obstacle.js';
import { checkCollision, checkHeartPickup } from './collision-ui.js';
import {
  duck,
  heightInPixels,
  setPlayerTimeBetweenFramesInSeconds,
  standUp,
  updatePlayerPosition,
  verticalPositionInPixels,
  playerUI,
  playerInput,
} from './playerLogic.js';

let lastTime = 0;

export function gameLoop(currentTime) {
  if (!state.gameRunning) return;

  if (!state.lastTime) state.lastTime = currentTime;
  const deltaTime = currentTime - state.lastTime;
  state.lastTime = currentTime;

  const timeBetweenFramesInSeconds = deltaTime / 1000;

  setPlayerTimeBetweenFramesInSeconds(timeBetweenFramesInSeconds);
  processPlayerInput();
  updatePlayerPosition();

  if (currentTime >= state.nextObstacleAt) {
    createObstacle();
  }

  if (currentTime >= state.nextHeartAt) {
    createHeart();
  }

  moveObstacles(timeBetweenFramesInSeconds);
  moveHeart(timeBetweenFramesInSeconds);

  checkCollision(currentTime);
  checkHeartPickup();

  playerUI.style.bottom = `${verticalPositionInPixels}px`;
  playerUI.style.height = `${heightInPixels}px`;

  state.animationId = requestAnimationFrame(gameLoop);
}

export function processPlayerInput() {
  if (playerInput.duck.isPressed) {
    duck();
  } else {
    standUp();
  }
}
