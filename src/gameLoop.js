import {
  positionIncrementInPx,
  gravityPositionIncrementInPx,
} from './physics.js';
import { playerUI, playerData } from './player.js';

let lastTime = 0;

export function gameLoop(currentTimeInMs) {
  const timeBetweenFramesInSeconds = (currentTimeInMs - lastTime) / 1000;
  lastTime = currentTimeInMs;

  playerData.applyGravity(timeBetweenFramesInSeconds);

  playerUI.style.bottom = `${playerData.verticalPositionInPixels}px`;

  requestAnimationFrame(gameLoop);
}
