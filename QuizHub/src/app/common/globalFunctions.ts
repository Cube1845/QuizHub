export function convertTimeInSecondsToTimeString(totalSeconds: number): string {
  const seconds = totalSeconds % 60;
  const minutes = Math.floor(totalSeconds / 60) % 60;
  const hours = Math.floor(totalSeconds / 3600);

  const padWithZero = (num: number): string =>
    num.toString().length === 1 ? `${num}` : num.toString();

  return `${padWithZero(hours)}:${padWithZero(minutes)}:${padWithZero(
    seconds
  )}`;
}

export function splitArrayIntoChunks<T>(array: T[], chunkSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}
