export const playerUI = document.getElementById('player');

const runImagesUrls = [
  '../assets/player/run-images/run1.webp',
  '../assets/player/run-images/run2.webp',
  '../assets/player/run-images/run3.webp',
];

const jumpImagesUrls = {
  rising: '../assets/player/jump-images/jump-rising.webp',
  top: '../assets/player/jump-images/jump-top.webp',
  falling: '../assets/player/jump-images/jump-falling.webp',
};

const playerImage = playerUI.querySelector('img');
playerImage.src = '../assets/player/student_stand.png';

const PLAYER_HEIGHT = 106;
const DUCK_HEIGHT = 60;
const AIR_HEIGHT = 66;
const GRAVITY = 1200;
const JUMP_VELOCITY = 523;
const DOUBLE_JUMP_VELOCITY = 300;
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
      this.jumpState = 'jumping';
      this.verticalSpeed = JUMP_VELOCITY;
      this.jumpCount = 1;
      playerImage.src = jumpImagesUrls.rising;
    } else if (this.jumpCount === 1) {
      this.verticalSpeed = DOUBLE_JUMP_VELOCITY;
      this.jumpCount = 2;
      playerImage.src = jumpImagesUrls.rising;
    }
  },

  duck() {
    this.isDucking = true;

    if (this.jumpState !== 'grounded') {
      this.verticalSpeed = Math.min(this.verticalSpeed, FAST_FALL_VELOCITY);
      return;
    }

    playerUI.classList.add('duck');
    playerImage.src = '../assets/player/student_duck.png';
    this.heightInPixels = DUCK_HEIGHT;
  },

  standUp() {
    playerUI.classList.remove('duck');
    this.heightInPixels = PLAYER_HEIGHT;
    this.isDucking = false;

    if (this.walkFrameIndex === 0) {
      playerImage.src = runImagesUrls[this.walkFrameIndex];
    }
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
      playerImage.src = jumpImagesUrls.top;
    } else if (this.jumpState === 'jumping') {
      playerImage.src = jumpImagesUrls.rising;
    } else {
      playerImage.src = jumpImagesUrls.falling;
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
    playerImage.src = runImagesUrls[this.walkFrameIndex];
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
    playerImage.src = '../assets/player/student_stand.png';
  },
};

export function getPlayerHitbox() {
  return playerUI.getBoundingClientRect();
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
