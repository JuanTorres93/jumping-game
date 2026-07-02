import { resetGame, startBtn } from './engine.js';
import { playerInput, playerUI, playerData } from './player.js';

document.addEventListener('keydown', (event) => {
  if (event.key === playerInput.jump.key) {
    playerInput.jump.isPressed = true;
  }

  if (event.key === playerInput.duck.key) {
    playerInput.duck.isPressed = true;
  }

  if (event.key === 'r' || event.key === 'R') {
    resetGame();
  }
});

document.addEventListener('keyup', (event) => {
  if (event.key === playerInput.jump.key) {
    playerInput.jump.isPressed = false;
  }

  if (event.key === playerInput.duck.key) {
    playerInput.duck.isPressed = false;
  }
});

playerUI.style.height = `${playerData.heightInPixels}px`;

startBtn.addEventListener('click', resetGame);
