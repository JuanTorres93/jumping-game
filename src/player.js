import {
  velocityIncrementInPxPerSecond,
  gravityVelocityIncrementInPxPerSecond,
  uniformlyAcceleratedRectilinearMotionPositionIncrementInPx,
  GRAVITY,
  gravityPositionIncrementInPx,
} from './physics.js';

export const playerUI = document.getElementById('player');

export const playerData = {
  verticalSpeed: 0,

  verticalPositionInPixels: 500,

  JUMP_ACCELERATION: 14,
  MAX_JUMP_HEIGHT: 200,
  MAX_SPEED: 1200,
  distanceDuringJumpInPixels: 0,
  jumpBlocked: false,
  jumpState: 'grounded', // "grounded", "jumping", "falling

  timeBetweenFramesInSeconds: 0.016,

  applyGravity() {
    if (this.verticalPositionInPixels <= 0) {
      this.verticalPositionInPixels = 0;
      this.verticalSpeed = 0;

      this.distanceDuringJumpInPixels = 0;
      this.jumpState = 'grounded';

      this.jumpBlocked = false;

      return;
    }

    const velocityIncrement = gravityVelocityIncrementInPxPerSecond(
      this.timeBetweenFramesInSeconds,
      this.verticalSpeed,
    );

    this.updateVelocityByStep(velocityIncrement);

    this.updatePosition();
  },

  jump() {
    if (this.jumpBlocked || (!this.canJump() && !this.isJumping())) return;

    // TODO DELETE THESE DEBUG LOGS
    console.log('JUMPING');

    this.jumpState = 'jumping';

    const velocityIncrement = velocityIncrementInPxPerSecond(
      this.timeBetweenFramesInSeconds,
      this.verticalSpeed,
      this.JUMP_ACCELERATION,
    );

    this.updateVelocityByStep(velocityIncrement);

    this.updatePosition();
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
    const absoluteSpeed = Math.abs(this.verticalSpeed);

    const expectedSpeed = absoluteSpeed + step;

    const absoluteExpectedSpeed = Math.abs(expectedSpeed);

    if (absoluteExpectedSpeed > this.MAX_SPEED) return;

    this.verticalSpeed += step;
  },

  updatePosition() {
    let jumpPositionIncrement = 0;

    const gravityPositionIncrement = gravityPositionIncrementInPx(
      this.timeBetweenFramesInSeconds,
      this.verticalSpeed,
    );

    if (this.jumpState === 'jumping') {
      jumpPositionIncrement =
        uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
          this.timeBetweenFramesInSeconds,
          this.verticalSpeed,
          this.JUMP_ACCELERATION,
        );

      this.distanceDuringJumpInPixels += jumpPositionIncrement;

      if (this.hasReachedMaxJumpHeight()) {
        this.jumpState = 'falling';
        this.verticalSpeed = 0;
      }
    }

    const totalPositionIncrement =
      gravityPositionIncrement + jumpPositionIncrement;

    this.verticalPositionInPixels += totalPositionIncrement;
  },
};

export const playerInput = {
  jump: {
    key: ' ',
    isPressed: false,
  },
};
