import {
  velocityIncrementInPxPerSecond,
  gravityVelocityIncrementInPxPerSecond,
  uniformlyAcceleratedRectilinearMotionPositionIncrementInPx,
  GRAVITY,
  gravityPositionIncrementInPx,
} from './physics.js';

export const playerUI = document.getElementById('player');

const playerImmage = playerUI.querySelector('img');
playerImmage.src = 'assets/player/student_stand.png'; // '../assets/player/sprite.png';

const PLAYER_HEIGHT = 92;

export const playerData = {
  heightInPixels: PLAYER_HEIGHT,

  verticalSpeed: 0,

  verticalPositionInPixels: 0,

  JUMP_ACCELERATION: 14,
  MAX_JUMP_HEIGHT: 300,
  MAX_SPEED: 1200,
  distanceDuringJumpInPixels: 0,
  jumpBlocked: false,
  jumpState: 'grounded', // "grounded", "jumping", "falling

  timeBetweenFramesInSeconds: 0.016,

  applyGravity() {
    if (this.jumpState === 'grounded') return;

    const velocityIncrement = gravityVelocityIncrementInPxPerSecond(
      this.timeBetweenFramesInSeconds,
      this.verticalSpeed,
    );

    this.updateVelocityByStep(velocityIncrement);
  },

  jump() {
    if (this.jumpBlocked || (!this.canJump() && !this.isJumping())) return;

    this.jumpState = 'jumping';

    const velocityIncrement = velocityIncrementInPxPerSecond(
      this.timeBetweenFramesInSeconds,
      this.verticalSpeed,
      this.JUMP_ACCELERATION,
    );

    this.updateVelocityByStep(velocityIncrement);
  },

  duck() {
    if (this.jumpState !== 'grounded') return;

    this.heightInPixels = PLAYER_HEIGHT / 2;
  },

  standUp() {
    this.heightInPixels = PLAYER_HEIGHT;
  },

  canJump() {
    return this.jumpState === 'grounded';
  },

  blockJump() {
    this.jumpBlocked = true;

    if (this.verticalSpeed > 0) {
      this.verticalSpeed = 0;
    }
  },

  isJumping() {
    return this.jumpState === 'jumping';
  },

  hasReachedMaxJumpHeight() {
    return this.distanceDuringJumpInPixels >= this.MAX_JUMP_HEIGHT;
  },

  setTimeBetweenFramesInSeconds(timeBetweenFramesInSeconds) {
    this.timeBetweenFramesInSeconds = timeBetweenFramesInSeconds;
  },

  updateVelocityByStep(step) {
    const newSpeed = this.verticalSpeed + step;

    if (newSpeed > this.MAX_SPEED) {
      this.verticalSpeed = this.MAX_SPEED;
    } else if (newSpeed < -this.MAX_SPEED) {
      this.verticalSpeed = -this.MAX_SPEED;
    } else {
      this.verticalSpeed = newSpeed;
    }
  },

  updatePosition() {
    let positionIncrement = 0;

    if (this.jumpState === 'jumping') {
      positionIncrement =
        uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
          this.timeBetweenFramesInSeconds,
          this.verticalSpeed,
          this.JUMP_ACCELERATION - GRAVITY,
        );

      const jumpOnlyIncrement =
        uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
          this.timeBetweenFramesInSeconds,
          this.verticalSpeed,
          this.JUMP_ACCELERATION,
        );
      this.distanceDuringJumpInPixels += jumpOnlyIncrement;

      if (this.hasReachedMaxJumpHeight()) {
        this.jumpState = 'falling';
        this.verticalSpeed = 0;
      }
    } else if (this.jumpState === 'falling') {
      positionIncrement = gravityPositionIncrementInPx(
        this.timeBetweenFramesInSeconds,
        this.verticalSpeed,
      );
    } else {
      return;
    }

    this.verticalPositionInPixels += positionIncrement;

    if (this.verticalPositionInPixels <= 0) {
      this.reset();
    }
  },

  reset() {
    this.verticalPositionInPixels = 0;
    this.verticalSpeed = 0;
    this.distanceDuringJumpInPixels = 0;
    this.jumpState = 'grounded';
    this.jumpBlocked = false;
    this.heightInPixels = PLAYER_HEIGHT;
  },
};

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
