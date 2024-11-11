export interface TreeNode {
  name: string;
  attributes: {
    id: string;
  };
  children: TreeNode[];
}

export interface MaxSum {
  value: number;
}

export interface StringOutput {
  longestSubstring: string;
  uniqueSubstring: string[];
}

export interface TreeOutput {
  input: string;
  longestSubstring: string;
  uniqueSubstrings: string[];
}
