import { resetGame, startBtn } from './engine.js';
import { playerInput } from './player.js';

document.addEventListener('keydown', (event) => {
  if (event.key === playerInput.jump.key) {
    playerInput.jump.isPressed = true;
  }

  if (event.key === 'r' || event.key === 'R') {
    resetGame();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === playerInput.jump.key) {
    playerInput.jump.isPressed = false;
  }
});

startBtn.addEventListener('click', resetGame);
