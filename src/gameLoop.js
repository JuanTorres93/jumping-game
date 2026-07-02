import { state } from './engine.js';
import { playerUI, playerData, playerInput } from './player.js';
import {
  createObstacle,
  moveObstacles,
  moveHeart,
  createHeart,
} from './obstacle.js';

let lastTime = 0;

let createObstacleTimeout = 0;

let createHeartTimeout = 0;

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

  if (createObstacleTimeout <= 0) {
    createObstacle();
    createObstacleTimeout = 2000; // 1000 ms = 1 second
  }

  if (createHeartTimeout <= 0) {
    createHeart();
    createHeartTimeout = 10000;
  }

  moveObstacles(timeBetweenFramesInSeconds);
  moveHeart(timeBetweenFramesInSeconds);

  playerUI.style.bottom = `${playerData.verticalPositionInPixels}px`;

  // Stop condition, change as needed during development
  //if (playerData.verticalPositionInPixels <= 0) {
  //  return;
  //}

  createObstacleTimeout -= timeBetweenFramesInSeconds * 1000;
  createHeartTimeout -= timeBetweenFramesInSeconds * 1000;

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
