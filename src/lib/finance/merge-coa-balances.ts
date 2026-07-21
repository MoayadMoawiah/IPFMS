import type { CoaTreeNode } from '@/lib/api/finance';

export interface CoaTreeNodeWithBalance extends CoaTreeNode {
  balance: number;
  children?: CoaTreeNodeWithBalance[];
}

/** Roll posted trial-balance amounts into the chart-of-accounts tree. */
export function mergeCoaBalances(
  nodes: CoaTreeNode[],
  balanceByAccountId: Map<string, number>,
): CoaTreeNodeWithBalance[] {
  return nodes.map((node) => {
    const children = node.children?.length
      ? mergeCoaBalances(node.children, balanceByAccountId)
      : [];
    const childSum = children.reduce((sum, child) => sum + child.balance, 0);
    const ownBalance = balanceByAccountId.get(node.id) ?? 0;
    const balance = node.isLeaf ? ownBalance : childSum;

    return { ...node, children, balance };
  });
}
