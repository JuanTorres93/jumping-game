import { state } from './engine.js';
import { playerUI, playerData, playerInput } from './player.js';

export function gameLoop(currentTime) {
  if (!state.gameRunning) return;

  if (!state.lastTime) state.lastTime = currentTime;
  const deltaTime = currentTime - state.lastTime;
  state.lastTime = currentTime;

  playerData.setTimeBetweenFramesInSeconds(deltaTime / 1000);
  processPlayerInput();
  playerData.applyGravity();
  playerData.updatePosition();

  playerUI.style.bottom = `${playerData.verticalPositionInPixels}px`;

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
