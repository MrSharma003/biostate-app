import { parentPort } from 'worker_threads';

function findLongestSubstringSlidingWindow(input: string): string {
  let start = 0,
    end = 0,
    maxLength = 0,
    longestStart = 0;
  const map: Record<string, number> = {};
  for (let i = 0; i < input.length; i++) {
    if (map[input[i]] !== undefined) {
      start = map[input[i]] + 1;
    }
    map[input[i]] = i;
    if (maxLength < end - start + 1) {
      maxLength = end - start + 1;
      longestStart = start;
    }
    end++;
  }
  console.log(input.slice(longestStart, longestStart + maxLength));
  return input.slice(longestStart, longestStart + maxLength);
}

parentPort.on('message', (data) => {
  const result = findLongestSubstringSlidingWindow(data);
  parentPort.postMessage(result);
});
