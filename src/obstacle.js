import {
  game,
  player,
  obstaclesContainer,
  heartsContainer,
  state,
  scoreElement,
  randomBetween,
  HEART_BOTTOM,
  HEART_SIZE,
} from './engine.js';

const FRAMES_PER_SECOND_REFERENCE = 60;

const BACKPACK = {
  name: 'Backpack',
  src: '../assets/obstacles/backpack.png',
  heightType: 'low',
  width: 49,
  height: 60,
  points: 1,
};

const BASKETBALL = {
  name: 'Basketball',
  src: '../assets/obstacles/basketball.png',
  heightType: 'high',
  width: 54,
  height: 54,
  points: 1,
};

const BOOKS = {
  name: 'Books',
  src: '../assets/obstacles/books.png',
  heightType: 'low',
  width: 56,
  height: 56,
  points: 1,
};

const NOTEBOOK = {
  name: 'Flying Notebook',
  src: '../assets/obstacles/notebook.png',
  heightType: 'high',
  width: 58,
  height: 48,
  points: 1,
};

const PAPERPLANE = {
  name: 'Paper Plane',
  src: '../assets/obstacles/paper_plane.png',
  heightType: 'high',
  width: 70,
  height: 30,
  points: 1,
};

const WETFLOOR = {
  name: 'Wet Floor Sign',
  src: '../assets/obstacles/wet_floor.png',
  heightType: 'low',
  width: 38,
  height: 63,
  points: 1,
};

const obstacleTypes = [BACKPACK, BASKETBALL, BOOKS, NOTEBOOK, PAPERPLANE, WETFLOOR];

const MIN_HEART_HIGH_OBSTACLE_GAP = 260;

function chooseObstacleType(startX) {
  let available = obstacleTypes;

  if (state.lastObstacleHeightType === 'high' && Math.random() < 0.6) {
    available = obstacleTypes.filter((type) => type.heightType === 'low');
  }

  const heartTooClose = state.hearts.some(
    (heart) => Math.abs(startX - heart.x) < MIN_HEART_HIGH_OBSTACLE_GAP,
  );
  if (heartTooClose) {
    available = available.filter((type) => type.heightType === 'low');
  }

  const obstacleType = available[randomBetween(0, available.length - 1)];
  state.lastObstacleHeightType = obstacleType.heightType;
  return obstacleType;
}

function createObstacle() {
  const startX = game.clientWidth + randomBetween(10, 90);
  const obstacleType = chooseObstacleType(startX);
  const obstacle = document.createElement('div');
  const obstacleImage = document.createElement('img');

  obstacle.classList.add('obstacle', obstacleType.heightType);
  obstacle.style.width = `${obstacleType.width}px`;
  obstacle.style.height = `${obstacleType.height}px`;
  obstacle.style.left = `${startX}px`;

  obstacleImage.setAttribute('src', obstacleType.src);
  obstacleImage.alt = obstacleType.name;
  obstacleImage.draggable = false;
  obstacle.appendChild(obstacleImage);
  obstaclesContainer.appendChild(obstacle);

  state.obstacles.push({
    element: obstacle,
    x: startX,
    width: obstacleType.width,
    heightType: obstacleType.heightType,
    scored: false,
    points: obstacleType.points,
  });

  const minimumGap = Math.max(720, 1450 - state.speed * 55);
  const maximumGap = Math.max(1050, 2400 - state.speed * 70);
  state.nextObstacleAt = performance.now() + randomBetween(minimumGap, maximumGap);
}

function moveObstacles(timeBetweenFramesInSeconds) {
  const movement = state.speed * timeBetweenFramesInSeconds * FRAMES_PER_SECOND_REFERENCE;

  state.obstacles.forEach((obstacle) => {
    obstacle.x -= movement;
    obstacle.element.style.left = `${obstacle.x}px`;

    if (!obstacle.scored && obstacle.x + obstacle.width < player.offsetLeft) {
      obstacle.scored = true;
      state.score += obstacle.points;
      scoreElement.textContent = state.score;

      if (state.score % 8 === 0) state.speed += 0.45;
    }
  });

  state.obstacles = state.obstacles.filter((obstacle) => {
    if (obstacle.x + obstacle.width < -100) {
      obstacle.element.remove();
      return false;
    }
    return true;
  });
}

function createHeart() {
  const heart = document.createElement('div');

  heart.classList.add('life-pickup');
  heart.textContent = '♥';
  heart.style.bottom = `${HEART_BOTTOM}px`;

  let startX = heartsContainer.clientWidth + 60;

  for (const obstacle of state.obstacles) {
    if (obstacle.heightType !== 'high') continue;
    if (Math.abs(startX - obstacle.x) < MIN_HEART_HIGH_OBSTACLE_GAP) {
      startX = Math.max(startX, obstacle.x + MIN_HEART_HIGH_OBSTACLE_GAP);
    }
  }

  heart.style.left = `${startX}px`;

  heartsContainer.appendChild(heart);

  state.hearts.push({ element: heart, x: startX, width: HEART_SIZE });

  state.nextHeartAt = performance.now() + randomBetween(11000, 17000);
}

function moveHeart(timeBetweenFramesInSeconds) {
  const movement = state.speed * timeBetweenFramesInSeconds * FRAMES_PER_SECOND_REFERENCE;

  for (const heart of state.hearts) {
    heart.x -= movement;
    heart.element.style.left = `${heart.x}px`;

    if (heart.x + heart.width < 0) {
      removeGameObject(heart, state.hearts);
    }
  }
}

function getObstacleHitbox(obstacle) {
  return obstacle.element.getBoundingClientRect();
}

function getHeartHitbox(heart) {
  return heart.element.getBoundingClientRect();
}

function removeGameObject(gameObject, gameObjectArray) {
  const index = gameObjectArray.indexOf(gameObject);
  if (index !== -1) {
    gameObjectArray.splice(index, 1);
    gameObject.element.remove();
  }
}

export {
  createObstacle,
  moveObstacles,
  createHeart,
  moveHeart,
  getObstacleHitbox,
  getHeartHitbox,
  removeGameObject,
};
