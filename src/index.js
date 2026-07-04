import { resetGame, startBtn } from './engine.js';
import { heightInPixels, jump, playerInput, playerUI } from './playerLogic.js';

document.addEventListener('keydown', (event) => {
  if (event.key === playerInput.jump.key) {
    playerInput.jump.isPressed = true;

    if (!event.repeat) {
      jump();
    }
  }

  if (event.key === playerInput.duck.key) {
    playerInput.duck.isPressed = true;
  }

  if (event.key === 'r' || event.key === 'R' || event.key === 'Enter') {
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

playerUI.style.height = `${heightInPixels}px`;
playerUI.style.width = `${heightInPixels}px`;

startBtn.addEventListener('click', resetGame);
