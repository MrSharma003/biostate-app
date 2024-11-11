import { Body, Controller, Post } from '@nestjs/common';
import { TreeNode } from 'src/type';
import { BinaryTreeService } from './binary_tree.service';

@Controller()
export class BinaryTreeController {
  constructor(private binraryTreeService: BinaryTreeService) {}

  @Post('/binary-tree')
  async calculateMaxSumPath(@Body() body: { tree: TreeNode[] | TreeNode }) {
    const tree = body.tree;

    return this.binraryTreeService.calculateMaxSumPathAnyNode(tree);
  }
}
