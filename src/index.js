import { gameLoop, processPlayerInput } from './gameLoop.js';
import { playerInput } from './player.js';

document.addEventListener('keydown', (event) => {
  if (event.key === playerInput.jump.key) {
    playerInput.jump.isPressed = true;
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === playerInput.jump.key) {
    playerInput.jump.isPressed = false;
  }
});

requestAnimationFrame(gameLoop);
