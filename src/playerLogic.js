import { playJumpSound, playDoubleJumpSound } from './audio.js';
export const playerUI = document.getElementById('player');

const PLAYER_HEIGHT = 106;
const DUCK_HEIGHT = 60;
const AIR_HEIGHT = 66;

const GRAVITY = 1200;
const JUMP_VELOCITY = 523;
const DOUBLE_JUMP_VELOCITY = 350;
const FAST_FALL_VELOCITY = -900;

const PLAYER_HITBOX_HORIZONTAL_INSET_RATIO = 0.2;

const WALK_FRAME_DURATION_IN_SECONDS = 0.12;

const playerImage = playerUI.querySelector('img');

export let heightInPixels = PLAYER_HEIGHT;

export let verticalPositionInPixels = 0;
let verticalSpeed = 0;

let jumpState = 'grounded'; // "grounded", "jumping", "falling"
let jumpCount = 0; // 0 = grounded, 1 = single jump used, 2 = double jump used

let walkFrameIndex = 0;
let walkFrameElapsedInSeconds = 0;

let isDucking = false;

let timeBetweenFramesInSeconds = 0.016;

const standImageUrl = new URL(
  '../assets/player/student_stand.png',
  import.meta.url,
).href;

const runImagesUrls = [
  new URL('../assets/player/run-images/run1.webp', import.meta.url).href,
  new URL('../assets/player/run-images/run2.webp', import.meta.url).href,
  new URL('../assets/player/run-images/run3.webp', import.meta.url).href,
];

const jumpImagesUrls = {
  rising: new URL(
    '../assets/player/jump-images/jump-rising.webp',
    import.meta.url,
  ).href,
  top: new URL('../assets/player/jump-images/jump-top.webp', import.meta.url)
    .href,
  falling: new URL(
    '../assets/player/jump-images/jump-falling.webp',
    import.meta.url,
  ).href,
};

const playerSpriteUrls = [
  standImageUrl,
  new URL('../assets/player/student_duck.png', import.meta.url).href,
  ...runImagesUrls,
  jumpImagesUrls.rising,
  jumpImagesUrls.top,
  jumpImagesUrls.falling,
];

playerSpriteUrls.forEach((spriteUrl) => {
  const image = new Image();
  image.src = spriteUrl;
});

function setPlayerSprite(spriteUrl) {
  if (playerImage.src !== spriteUrl) {
    playerImage.src = spriteUrl;
  }
}

export function jump() {
  if (isDucking) return;

  if (jumpCount === 0) {
    playJumpSound();
    jumpState = 'jumping';
    verticalSpeed = JUMP_VELOCITY;
    jumpCount = 1;
    setPlayerSprite(jumpImagesUrls.rising);
  } else if (jumpCount === 1) {
    playDoubleJumpSound();
    verticalSpeed = DOUBLE_JUMP_VELOCITY;
    jumpCount = 2;
    setPlayerSprite(jumpImagesUrls.rising);
  }
}

export function duck() {
  isDucking = true;

  if (jumpState !== 'grounded') {
    verticalSpeed = Math.min(verticalSpeed, FAST_FALL_VELOCITY);
    return;
  }

  playerUI.classList.add('duck');
  setPlayerSprite(playerSpriteUrls[1]);
  heightInPixels = DUCK_HEIGHT;
}

export function standUp() {
  playerUI.classList.remove('duck');
  heightInPixels = PLAYER_HEIGHT;
  isDucking = false;

  setPlayerSprite(runImagesUrls[walkFrameIndex]);
}

export function setPlayerTimeBetweenFramesInSeconds(
  timeBetweenFramesInSeconds,
) {
  timeBetweenFramesInSeconds = timeBetweenFramesInSeconds;
}

export function updatePlayerPosition() {
  if (jumpState === 'grounded') {
    playerUI.classList.remove('jumping');
    if (!isDucking) {
      walkAnimation();
    }
    return;
  }

  playerUI.classList.add('jumping');
  heightInPixels = AIR_HEIGHT;

  const dt = timeBetweenFramesInSeconds;

  verticalPositionInPixels += verticalSpeed * dt;
  verticalSpeed -= GRAVITY * dt;

  if (jumpState === 'jumping' && verticalSpeed <= 0) {
    jumpState = 'falling';
    setPlayerSprite(jumpImagesUrls.top);
  } else if (jumpState === 'jumping') {
    setPlayerSprite(jumpImagesUrls.rising);
  } else {
    setPlayerSprite(jumpImagesUrls.falling);
  }

  if (verticalPositionInPixels <= 0) {
    reset();
  }
}

function walkAnimation() {
  walkFrameElapsedInSeconds += timeBetweenFramesInSeconds;

  if (walkFrameElapsedInSeconds < WALK_FRAME_DURATION_IN_SECONDS) {
    return;
  }

  walkFrameElapsedInSeconds = 0;
  walkFrameIndex = (walkFrameIndex + 1) % runImagesUrls.length;
  setPlayerSprite(runImagesUrls[walkFrameIndex]);
}

export function reset() {
  verticalPositionInPixels = 0;
  verticalSpeed = 0;
  jumpState = 'grounded';
  jumpCount = 0;
  heightInPixels = PLAYER_HEIGHT;
  isDucking = false;
  walkFrameIndex = 0;
  walkFrameElapsedInSeconds = 0;

  playerUI.classList.remove('duck', 'jumping');
  setPlayerSprite(standImageUrl);
}

export function getPlayerHitbox() {
  const playerRect = playerUI.getBoundingClientRect();
  const horizontalInset =
    playerRect.width * PLAYER_HITBOX_HORIZONTAL_INSET_RATIO;
  return {
    top: playerRect.top,
    right: playerRect.right - horizontalInset,
    bottom: playerRect.bottom,
    left: playerRect.left + horizontalInset,
  };
}

export const playerInput = {
  jump: {
    key: ' ',
    isPressed: false,
  },

  duck: {
    key: 'ArrowDown',
    isPressed: false,
  },
};
