import { state, player, endGame, lifeIcons } from "./engine.js";
import { getPlayerHitbox, playerData } from "./player.js";
import { getObstacleHitbox, getHeartHitbox, removeGameObject } from "./obstacle.js";

/* ---------- Constants ---------- */

const MAX_LIVES = 3;
const INVULNERABILITY_DURATION = 1500;
const BEST_SCORE_KEY = "bestScore";

/* ---------- Collision ---------- */

/**
 * Represents the collision area of a game object.
 *
 * @typedef {Object} Hitbox
 * @property {number} left
 * @property {number} right
 * @property {number} top
 * @property {number} bottom
 */

/**
 * Determines whether two hitboxes overlap.
 *
 * @param {Hitbox} firstHitbox
 * @param {Hitbox} secondHitbox
 * @returns {boolean} True if the hitboxes overlap, otherwise false.
 */
function rectanglesOverlap(firstHitbox, secondHitbox) {
  return (
    firstHitbox.left < secondHitbox.right &&
    firstHitbox.right > secondHitbox.left &&
    firstHitbox.top < secondHitbox.bottom &&
    firstHitbox.bottom > secondHitbox.top
  );
}

function checkCollision(currentTime) {
  if (currentTime < state.invulnerableUntil) {
    return;
  }

  const playerHitbox = getPlayerHitbox();

  for (const obstacle of state.obstacles) {
    const obstacleHitbox = getObstacleHitbox(obstacle);

    if (!rectanglesOverlap(playerHitbox, obstacleHitbox)) {
      continue;
    }

    removeGameObject(obstacle, state.obstacles);

    state.lives--;

    updateLivesDisplay("lost");

    if (state.lives <= 0) {
      endGame();
      return;
    }

    state.invulnerableUntil = currentTime + INVULNERABILITY_DURATION;

    // TODO: Replace with the player element accessor once implemented.
    player.classList.add("blinking");

    setTimeout(() => {
      player.classList.remove("blinking");
    }, INVULNERABILITY_DURATION);

    return;
  }
}

function checkHeartPickup() {
  const playerHitbox = getPlayerHitbox();

  for (const heart of state.hearts) {
    const heartHitbox = getHeartHitbox(heart);

    if (!rectanglesOverlap(playerHitbox, heartHitbox)) {
      continue;
    }

    removeGameObject(heart, state.hearts);

    state.lives = Math.min(state.lives + 1, MAX_LIVES);

    updateLivesDisplay("gained");

    return;
  }
}

/* ---------- UI ---------- */

function updateLivesDisplay(result) {
  if (!lifeIcons) {
    return;
  }

  if(result === "lost")
  {
    for (let i = lifeIcons.length - 1; i >= 0 ; i--) {
    if(!lifeIcons[i].classList.contains("lost"))
    {
      lifeIcons[i].classList.add("lost");
      break;
    }
      
  }
  }
  else
  {
    for (let i = 0; i < lifeIcons.length; i++) {
    if(lifeIcons[i].classList.contains("lost"))
    {
      lifeIcons[i].classList.remove("lost");
      break;
    }
  }
  }
}

function showMessage(title, lines, buttonText) {
  const messageElement = document.getElementById("message");
  const titleElement = document.getElementById("messageTitle");
  const bodyElement = document.getElementById("messageBody");
  const buttonElement = document.getElementById("startBtn");

  if (!messageElement || !titleElement || !bodyElement || !buttonElement) {
    return;
  }

  titleElement.textContent = title;

  bodyElement.replaceChildren();

  for (const line of lines) {
    const paragraph = document.createElement("p");
    paragraph.textContent = line;
    bodyElement.appendChild(paragraph);
  }

  buttonElement.textContent = buttonText;

  messageElement.classList.remove("hidden");
}

function hideMessage() {
  const messageElement = document.getElementById("message");

  if (!messageElement) {
    return;
  }

  messageElement.classList.add("hidden");
}

function requestRestart() {
  return confirm("Do you want to restart the game?");
}

/* ---------- Best score ---------- */

function loadBestScore() {
  const storedScore = localStorage.getItem(BEST_SCORE_KEY);

  if (storedScore === null) {
    return 0;
  }

  return Number(storedScore);
}

function saveBestScore(score) {
  localStorage.setItem(BEST_SCORE_KEY, score);
}

/* ---------- Initialization ---------- */

function initializeGameUI() {
  updateLivesDisplay();
  hideMessage();
}

/* ---------- Exports ---------- */

export {
  checkCollision,
  checkHeartPickup,
  updateLivesDisplay,
  showMessage,
  hideMessage,
  requestRestart,
  loadBestScore,
  saveBestScore,
  initializeGameUI,
};
