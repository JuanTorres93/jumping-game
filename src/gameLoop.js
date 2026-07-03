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
  playerData.applyGravity();
  playerData.updatePosition();

  if (state.nextObstacleAt <= 0) {
    createObstacle();
    state.nextObstacleAt = 2000; // 1000 ms = 1 second
  }

  if (state.nextHeartAt <= 0) {
    createHeart();
    state.nextHeartAt = 10000;
  }

  moveObstacles(timeBetweenFramesInSeconds);
  moveHeart(timeBetweenFramesInSeconds);

  checkCollision(currentTime);
  checkHeartPickup();

  playerUI.style.bottom = `${playerData.verticalPositionInPixels}px`;

  // Stop condition, change as needed during development
  //if (playerData.verticalPositionInPixels <= 0) {
  //  return;
  //}

  state.nextObstacleAt -= timeBetweenFramesInSeconds * 1000;
  state.nextHeartAt -= timeBetweenFramesInSeconds * 1000;

  state.animationId = requestAnimationFrame(gameLoop);
}

export function processPlayerInput() {
  if (playerInput.jump.isPressed) {
    playerData.jump();
  }

  if (!playerInput.jump.isPressed && !playerData.canJump()) {
    playerData.blockJump();
  }
}
