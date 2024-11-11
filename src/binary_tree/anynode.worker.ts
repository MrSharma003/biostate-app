import { MaxSum, TreeNode } from 'src/type';
import { parentPort } from 'worker_threads';

function getMaxSumAnyNode(tree: TreeNode, maxSum: MaxSum): number {
  try {
    // Ensure that tree and maxSum are valid
    if (!tree || !maxSum) {
      throw new Error('Invalid tree or maxSum data');
    }

    // Check for base case
    if (tree.name === 'Null') {
      return 0;
    }

    // Calculate left and right subtree sums, only considering positive values
    const left = tree.children[0]
      ? Math.max(getMaxSumAnyNode(tree.children[0], maxSum), 0)
      : 0;
    const right = tree.children[1]
      ? Math.max(getMaxSumAnyNode(tree.children[1], maxSum), 0)
      : 0;

    // Update the max sum
    maxSum.value = Math.max(maxSum.value, Number(tree.name) + left + right);

    return Number(tree.name) + Math.max(left, right);
  } catch (error) {
    // Log and re-throw the error if it occurs during max sum calculation
    console.error('Error in getMaxSumAnyNode:', error);
    throw error; // Re-throw the error to be caught in the parentPort.on handler
  }
}

// Handle messages from the main thread
parentPort.on('message', (tree: TreeNode) => {
  try {
    const maxSum: MaxSum = {
      value: Number.MIN_VALUE,
    };
    getMaxSumAnyNode(tree, maxSum);
    parentPort.postMessage(maxSum.value);
  } catch (error) {
    // Log error and send error message to main thread
    console.error('Error processing the tree:', error);
    parentPort.postMessage({ error: 'Failed to calculate max sum path' }); // Send error message to main thread
  }
});
