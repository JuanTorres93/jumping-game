import { playJumpSound, playDoubleJumpSound } from './audio.js';
export const playerUI = document.getElementById('player');

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

const playerImage = playerUI.querySelector('img');

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

const PLAYER_HEIGHT = 106;
const DUCK_HEIGHT = 60;
const AIR_HEIGHT = 66;
const GRAVITY = 1200;
const JUMP_VELOCITY = 523;
const DOUBLE_JUMP_VELOCITY = 350;
const FAST_FALL_VELOCITY = -900;

export const playerData = {
  heightInPixels: PLAYER_HEIGHT,

  verticalSpeed: 0,

  verticalPositionInPixels: 0,

  jumpState: 'grounded', // "grounded", "jumping", "falling"
  jumpCount: 0, // 0 = grounded, 1 = single jump used, 2 = double jump used

  walkFrameIndex: 0,
  walkFrameElapsedInSeconds: 0,
  WALK_FRAME_DURATION_IN_SECONDS: 0.12,

  isDucking: false,

  timeBetweenFramesInSeconds: 0.016,

  jump() {
    if (this.isDucking) return;

    if (this.jumpCount === 0) {
      playJumpSound();
      this.jumpState = 'jumping';
      this.verticalSpeed = JUMP_VELOCITY;
      this.jumpCount = 1;
      setPlayerSprite(jumpImagesUrls.rising);
    } else if (this.jumpCount === 1) {
      playDoubleJumpSound();
      this.verticalSpeed = DOUBLE_JUMP_VELOCITY;
      this.jumpCount = 2;
      setPlayerSprite(jumpImagesUrls.rising);
    }
  },

  duck() {
    this.isDucking = true;

    if (this.jumpState !== 'grounded') {
      this.verticalSpeed = Math.min(this.verticalSpeed, FAST_FALL_VELOCITY);
      return;
    }

    playerUI.classList.add('duck');
    setPlayerSprite(playerSpriteUrls[1]);
    this.heightInPixels = DUCK_HEIGHT;
  },

  standUp() {
    playerUI.classList.remove('duck');
    this.heightInPixels = PLAYER_HEIGHT;
    this.isDucking = false;

    setPlayerSprite(runImagesUrls[this.walkFrameIndex]);
  },

  setTimeBetweenFramesInSeconds(timeBetweenFramesInSeconds) {
    this.timeBetweenFramesInSeconds = timeBetweenFramesInSeconds;
  },

  updatePosition() {
    if (this.jumpState === 'grounded') {
      playerUI.classList.remove('jumping');
      if (!this.isDucking) {
        this.walkAnimation();
      }
      return;
    }

    playerUI.classList.add('jumping');
    this.heightInPixels = AIR_HEIGHT;

    const dt = this.timeBetweenFramesInSeconds;

    this.verticalPositionInPixels += this.verticalSpeed * dt;
    this.verticalSpeed -= GRAVITY * dt;

    if (this.jumpState === 'jumping' && this.verticalSpeed <= 0) {
      this.jumpState = 'falling';
      setPlayerSprite(jumpImagesUrls.top);
    } else if (this.jumpState === 'jumping') {
      setPlayerSprite(jumpImagesUrls.rising);
    } else {
      setPlayerSprite(jumpImagesUrls.falling);
    }

    if (this.verticalPositionInPixels <= 0) {
      this.reset();
    }
  },

  walkAnimation() {
    this.walkFrameElapsedInSeconds += this.timeBetweenFramesInSeconds;

    if (this.walkFrameElapsedInSeconds < this.WALK_FRAME_DURATION_IN_SECONDS) {
      return;
    }

    this.walkFrameElapsedInSeconds = 0;
    this.walkFrameIndex = (this.walkFrameIndex + 1) % runImagesUrls.length;
    setPlayerSprite(runImagesUrls[this.walkFrameIndex]);
  },

  reset() {
    this.verticalPositionInPixels = 0;
    this.verticalSpeed = 0;
    this.jumpState = 'grounded';
    this.jumpCount = 0;
    this.heightInPixels = PLAYER_HEIGHT;
    this.isDucking = false;
    this.walkFrameIndex = 0;
    this.walkFrameElapsedInSeconds = 0;

    playerUI.classList.remove('duck', 'jumping');
    setPlayerSprite(standImageUrl);
  },
};

const PLAYER_HITBOX_HORIZONTAL_INSET_RATIO = 0.2;

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
