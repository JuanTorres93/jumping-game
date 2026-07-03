import { state } from './engine.js';
import { playerUI, playerData, playerInput } from './player.js';
import {
  createObstacle,
  moveObstacles,
  moveHeart,
  createHeart,
} from './obstacle.js';
import { checkCollision, checkHeartPickup } from './collision-ui.js';

let lastTime = 0;

export function gameLoop(currentTime) {
  if (!state.gameRunning) return;

  if (!state.lastTime) state.lastTime = currentTime;
  const deltaTime = currentTime - state.lastTime;
  state.lastTime = currentTime;

  const timeBetweenFramesInSeconds = deltaTime / 1000;

  playerData.setTimeBetweenFramesInSeconds(timeBetweenFramesInSeconds);
  processPlayerInput();
  playerData.updatePosition();

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

  playerUI.style.bottom = `${playerData.verticalPositionInPixels}px`;
  playerUI.style.height = `${playerData.heightInPixels}px`;

  state.animationId = requestAnimationFrame(gameLoop);
}

export function processPlayerInput() {
  if (playerInput.duck.isPressed) {
    playerData.duck();
  } else {
    playerData.standUp();
  }
}
