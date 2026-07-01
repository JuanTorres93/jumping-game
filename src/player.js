import {
  convertMetersToPixels,
  gravityPositionIncrementInPx,
  uniformlyAcceleratedRectilinearMotionPositionIncrementInPx,
} from './physics.js';

export const playerUI = document.getElementById('player');

export const playerData = {
  INITIAL_FALLING_SPEED_M_S: 0,

  verticalPositionInPixels: 0,

  JUMP_ACCELERATION_M_S2: 18,
  MAX_JUMP_HEIGHT_IN_PIXELS: 500,
  distanceDuringJumpInPixels: 0,
  jumpBlocked: false,
  jumpState: 'grounded', // "grounded", "jumping", "falling

  timeBetweenFramesInSeconds: 0.016,

  applyGravity() {
    if (this.verticalPositionInPixels <= 0) {
      this.verticalPositionInPixels = 0;

      this.distanceDuringJumpInPixels = 0;
      this.jumpState = 'grounded';

      this.jumpBlocked = false;

      return;
    }

    const positionIncrement = gravityPositionIncrementInPx(
      this.timeBetweenFramesInSeconds,
      this.INITIAL_FALLING_SPEED_M_S,
    );

    this.verticalPositionInPixels -= positionIncrement;
  },

  jump() {
    if (this.jumpBlocked || (!this.canJump() && !this.isJumping())) return;

    this.jumpState = 'jumping';

    const distanceIncrementInPixels =
      uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
        this.timeBetweenFramesInSeconds,
        this.INITIAL_FALLING_SPEED_M_S,
        convertMetersToPixels(this.JUMP_ACCELERATION_M_S2),
      );

    this.verticalPositionInPixels += distanceIncrementInPixels;
    this.distanceDuringJumpInPixels += distanceIncrementInPixels;

    if (this.hasReachedMaxJumpHeight()) {
      this.jumpState = 'falling';
    }
  },

  canJump() {
    return this.jumpState === 'grounded';
  },

  isJumping() {
    return this.jumpState === 'jumping';
  },

  hasReachedMaxJumpHeight() {
    return this.distanceDuringJumpInPixels >= this.MAX_JUMP_HEIGHT_IN_PIXELS;
  },

  setTimeBetweenFramesInSeconds(timeBetweenFramesInSeconds) {
    this.timeBetweenFramesInSeconds = timeBetweenFramesInSeconds;
  },
};

export const playerInput = {
  jump: {
    key: ' ',
    isPressed: false,
  },
};
