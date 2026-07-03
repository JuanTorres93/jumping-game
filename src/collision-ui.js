import { gameState } from "./engine.js";

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
  if (currentTime < gameState.invulnerableUntil) {
    return;
  }

  const playerHitbox = getPlayerHitbox();

  for (const obstacle of gameState.obstacles) {
    const obstacleHitbox = getObstacleHitbox(obstacle);

    if (!rectanglesOverlap(playerHitbox, obstacleHitbox)) {
      continue;
    }

    removeGameObject(obstacle, gameState.obstacles);

    gameState.lives--;

    updateLivesDisplay();

    if (gameState.lives <= 0) {
      endGame();
      return;
    }

    gameState.invulnerableUntil = currentTime + INVULNERABILITY_DURATION;

    // TODO: Replace with the player element accessor once implemented.
    player.element.classList.add("blinking");

    setTimeout(() => {
      player.element.classList.remove("blinking");
    }, INVULNERABILITY_DURATION);

    return;
  }
}

function checkHeartPickup() {
  const playerHitbox = getPlayerHitbox();

  for (const heart of gameState.hearts) {
    const heartHitbox = getHeartHitbox(heart);

    if (!rectanglesOverlap(playerHitbox, heartHitbox)) {
      continue;
    }

    removeGameObject(heart, gameState.hearts);

    gameState.lives = Math.min(gameState.lives + 1, MAX_LIVES);

    updateLivesDisplay();

    return;
  }
}

/* ---------- UI ---------- */

function updateLivesDisplay() {
  const heartsElement = document.getElementById("hearts");

  if (!heartsElement) {
    return;
  }

  heartsElement.textContent = "❤️".repeat(gameState.lives);
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
