import { TreeNode, MaxSum } from 'src/type';
import { parentPort } from 'worker_threads';

function getMaxSumLeafNode(tree: TreeNode, maxSum: MaxSum): number {
  try {
    // Ensure that tree and maxSum are valid
    if (!tree || !maxSum) {
      throw new Error('Invalid tree or maxSum data');
    }

    // Check for base condition
    if (tree.name === 'Null') {
      return 0;
    }

    // Calculate left and right subtree sums
    const left = tree.children[0]
      ? getMaxSumLeafNode(tree.children[0], maxSum)
      : 0;
    const right = tree.children[1]
      ? getMaxSumLeafNode(tree.children[1], maxSum)
      : 0;

    // Update max sum
    maxSum.value = Math.max(maxSum.value, Number(tree.name) + left + right);

    return Number(tree.name) + Math.max(left, right);
  } catch (error) {
    // Handle error in calculating max sum
    console.error('Error in getMaxSumLeafNode:', error);
    throw error; // Re-throw the error to be caught in the parentPort.on handler
  }
}

// Handle messages from the main thread
parentPort.on('message', (tree: TreeNode) => {
  try {
    const maxSum: MaxSum = {
      value: Number.MIN_VALUE,
    };
    getMaxSumLeafNode(tree, maxSum);
    parentPort.postMessage(maxSum.value);
  } catch (error) {
    // Handle error when processing the tree
    console.error('Error processing the tree:', error);
    parentPort.postMessage({ error: 'Failed to calculate max sum path' }); // Send error message to main thread
  }
});
