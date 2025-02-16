export function convertTimeInSecondsToTimeString(totalSeconds: number): string {
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const padWithZero = (num: number): string =>
    num.toString().length === 1 ? `0${num}` : num.toString();

  return `${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(
    seconds
  )}`;
}
