import {
  positionIncrementInPx,
  gravityPositionIncrementInPx,
} from './physics.js';
import { playerUI, playerData, playerInput } from './player.js';

let lastTime = 0;

export function gameLoop(currentTimeInMs) {
  const timeBetweenFramesInSeconds = (currentTimeInMs - lastTime) / 1000;
  lastTime = currentTimeInMs;

  playerData.setTimeBetweenFramesInSeconds(timeBetweenFramesInSeconds);

  processPlayerInput();

  playerData.applyGravity();

  playerUI.style.bottom = `${playerData.verticalPositionInPixels}px`;

  // Stop condition, change as needed during development
  //if (playerData.verticalPositionInPixels <= 0) {
  //  return;
  //}

  requestAnimationFrame(gameLoop);
}

export function processPlayerInput() {
  if (playerInput.jump.isPressed) {
    playerData.jump();
  }
}
