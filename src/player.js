import {
  convertMetersToPixels,
  gravityPositionIncrementInPx,
} from './physics.js';

export const playerUI = document.getElementById('player');

export const playerData = {
  fallinSpeedInMetersPerSecond: 0,
  verticalPositionInPixels: 1000,

  applyGravity(timeBetweenFramesInSeconds) {
    if (this.verticalPositionInPixels <= 0) return;

    this.verticalPositionInPixels -= gravityPositionIncrementInPx(
      timeBetweenFramesInSeconds,
      this.fallinSpeedInMetersPerSecond,
    );
  },
};
