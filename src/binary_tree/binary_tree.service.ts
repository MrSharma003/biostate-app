import { Injectable } from '@nestjs/common';
import { TreeNode } from 'src/type';
import { GenericWorkerHost } from 'src/worker/worker.host';

@Injectable()
export class BinaryTreeService {
  constructor(private readonly workerHost: GenericWorkerHost) {}

  async calculateMaxSumPathAnyNode(tree: TreeNode[] | TreeNode) {
    try {
      const [maxSumAnyNode, maxSumLeafNode] = await Promise.all([
        this.workerHost.run('anyNode', tree as TreeNode),
        this.workerHost.run('leafNode', tree as TreeNode),
      ]);

      console.log(maxSumAnyNode, maxSumLeafNode);

      // Return the result if everything is successful
      return { maxSumAnyNode, maxSumLeafNode };
    } catch (error) {
      // Handle specific errors if known, or catch all generic errors
      console.error('Error calculating max sum path:', error);

      // Optionally, throw an error to be handled by the caller
      throw new Error(
        'Failed to calculate max sum path from leaf to any node.',
      );
    }
  }
}
