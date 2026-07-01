import {
  convertMetersToPixels,
  gravityPositionIncrementInPx,
  uniformlyAcceleratedRectilinearMotionPositionIncrementInPx,
} from './physics.js';

export const playerUI = document.getElementById('player');

export const playerData = {
  fallinSpeedInMetersPerSecond: 0,
  verticalPositionInPixels: 0,

  JUMP_ACCELERATION_M_S2: 18,
  MAX_JUMP_HEIGHT_IN_PIXELS: 500,
  distanceDuringJumpInPixels: 0,

  applyGravity(timeBetweenFramesInSeconds) {
    if (this.verticalPositionInPixels <= 0) {
      if (!this.canJump()) {
        this.distanceDuringJumpInPixels = 0;
      }

      return;
    }

    this.verticalPositionInPixels -= gravityPositionIncrementInPx(
      timeBetweenFramesInSeconds,
      this.fallinSpeedInMetersPerSecond,
    );
  },

  jump(timeBetweenFramesInSeconds) {
    if (!this.canJump()) return;

    const distanceIncrementInPixels =
      uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
        timeBetweenFramesInSeconds,
        this.fallinSpeedInMetersPerSecond,
        convertMetersToPixels(this.JUMP_ACCELERATION_M_S2),
      );

    this.verticalPositionInPixels += distanceIncrementInPixels;
    this.distanceDuringJumpInPixels += distanceIncrementInPixels;
  },

  canJump() {
    return this.distanceDuringJumpInPixels < this.MAX_JUMP_HEIGHT_IN_PIXELS;
  },
};
