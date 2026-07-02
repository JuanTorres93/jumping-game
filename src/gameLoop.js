import { state, MAX_LIVES } from './engine.js';
import { updatePlayerPhysics } from './player.js';
import { moveObstacles, moveHearts, createObstacle, createHeart } from './obstacles.js';
import { checkHeartPickup, checkCollision } from './collision-ui.js';

export function gameLoop(currentTime) {
  if (!state.gameRunning) return;

  if (!state.lastTime) state.lastTime = currentTime;
  const deltaTime = currentTime - state.lastTime;
  state.lastTime = currentTime;

  updatePlayerPhysics(state);
  moveObstacles(state, deltaTime);
  moveHearts(state, deltaTime);
  checkHeartPickup(state);

  if (currentTime >= state.nextObstacleAt) createObstacle(state);

  if (currentTime >= state.nextHeartAt) {
    if (state.lives < MAX_LIVES) createHeart(state);
    else state.nextHeartAt = currentTime + 4000;
  }

  checkCollision(state, currentTime);
  if (!state.gameRunning) return;

  state.animationId = requestAnimationFrame(gameLoop);
}
