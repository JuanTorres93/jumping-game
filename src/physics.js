export const GRAVITY = 10;

export function velocityIncrementInPxPerSecond(
  timeBetweenFramesInSeconds,
  initialVelocityPxSecond,
  accelerationPxSecondSquared,
) {
  return (
    initialVelocityPxSecond +
    accelerationPxSecondSquared * timeBetweenFramesInSeconds
  );
}

export function gravityVelocityIncrementInPxPerSecond(
  timeBetweenFramesInSeconds,
  initialVelocityPxSecond,
) {
  return velocityIncrementInPxPerSecond(
    timeBetweenFramesInSeconds,
    initialVelocityPxSecond,
    -GRAVITY,
  );
}

export function gravityPositionIncrementInPx(
  timeBetweenFramesInSeconds,
  initialVelocityPxSecond,
) {
  return uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
    timeBetweenFramesInSeconds,
    initialVelocityPxSecond,
    -GRAVITY,
  );
}

export function uniformlyAcceleratedRectilinearMotionPositionIncrementInPx(
  timeBetweenFramesInSeconds,
  initialVelocityPxSecond,
  accelerationPxSecondSquared,
) {
  return (
    initialVelocityPxSecond * timeBetweenFramesInSeconds +
    0.5 * accelerationPxSecondSquared * timeBetweenFramesInSeconds ** 2
  );
}
