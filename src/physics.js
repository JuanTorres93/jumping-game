const PIXELS_PER_METER = 100;

const GRAVITY_M_S2 = 7;

export function positionIncrementInPx(
  timeBetweenFramesInSeconds,
  velocityInMetersPerSecond,
) {
  const distanceInMeters =
    velocityInMetersPerSecond * timeBetweenFramesInSeconds;

  return convertMetersToPixels(distanceInMeters);
}

export function gravityPositionIncrementInPx(
  timeBetweenFramesInSeconds,
  initialFallingSpeedInMetersPerSecond = 0,
) {
  return uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
    timeBetweenFramesInSeconds,
    initialFallingSpeedInMetersPerSecond,
    convertMetersToPixels(GRAVITY_M_S2),
  );
}

export function uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
  timeBetweenFramesInSeconds,
  initialVelocityInMetersPerSecond,
  accelerationInMetersPerSecondSquared,
) {
  const distanceInMeters =
    initialVelocityInMetersPerSecond * timeBetweenFramesInSeconds +
    0.5 *
      accelerationInMetersPerSecondSquared *
      timeBetweenFramesInSeconds ** 2;

  return convertMetersToPixels(distanceInMeters);
}

export function convertMetersToPixels(meters) {
  return meters * PIXELS_PER_METER;
}
