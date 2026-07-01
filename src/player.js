import {
  convertMetersToPixels,
  gravityPositionIncrementInPx,
  uniformlyAcceleratedRectilinearMotionPositionIncrementInPx,
} from './physics.js';

export const playerUI = document.getElementById('player');

export const playerData = {
  fallinSpeedInMetersPerSecond: 0,
  verticalPositionInPixels: 1000,

  JUMP_ACCELERATION_M_S2: 18,
  MAX_JUMP_HEIGHT_IN_PIXELS: 500,
  distanceDuringJumpInPixels: 0,

  timeBetweenFramesInSeconds: 0.016,

  applyGravity() {
    if (this.verticalPositionInPixels <= 0) {
      if (!this.canJump()) {
        this.distanceDuringJumpInPixels = 0;
      }

      return;
    }

    this.verticalPositionInPixels -= gravityPositionIncrementInPx(
      this.timeBetweenFramesInSeconds,
      this.fallinSpeedInMetersPerSecond,
    );
  },

  jump() {
    // TODO DELETE THESE DEBUG LOGS
    console.log('JUMP!');

    if (!this.canJump()) return;

    const distanceIncrementInPixels =
      uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
        this.timeBetweenFramesInSeconds,
        this.fallinSpeedInMetersPerSecond,
        convertMetersToPixels(this.JUMP_ACCELERATION_M_S2),
      );

    // TODO DELETE THESE DEBUG LOGS
    console.log('distance');
    console.log(distanceIncrementInPixels);

    this.verticalPositionInPixels += distanceIncrementInPixels;
    this.distanceDuringJumpInPixels += distanceIncrementInPixels;
  },

  canJump() {
    return this.distanceDuringJumpInPixels < this.MAX_JUMP_HEIGHT_IN_PIXELS;
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
