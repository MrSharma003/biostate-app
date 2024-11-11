import { parentPort } from 'worker_threads';

function hasUniqueChar(str: string): boolean {
  const set = new Set(str);
  if (str.length === set.size) {
    return true;
  }
  return false;
}

//   time complexity O(n^3)
function getAllUniqueCharSubstrings(input: string): string[] {
  const length = input.length;
  const uniqueSubstring = new Set<string>();
  for (let i = 0; i < length; i++) {
    for (let j = i + 1; j <= length; j++) {
      const str = input.slice(i, j);
      if (hasUniqueChar(str)) {
        uniqueSubstring.add(str);
      }
    }
  }
  return Array.from(uniqueSubstring);
}

parentPort.on('message', (input) => {
  const result = getAllUniqueCharSubstrings(input);
  console.log('result worker 2: ', result);
  parentPort.postMessage(result);
});
