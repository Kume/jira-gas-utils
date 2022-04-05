interface SimpleIssueCommon {
  readonly key: string;
}

interface SimpleEpicIssue extends SimpleIssueCommon {
  readonly type: 'epic';
}

interface SimpleStandardIssue extends SimpleIssueCommon {
  readonly type: 'standard';
  readonly epicLink?: string | null;
}

interface SimpleSubTaskIssue extends SimpleIssueCommon {
  readonly type: 'subTask';
  readonly parentKey: string;
}

type SimpleIssue = SimpleEpicIssue | SimpleStandardIssue | SimpleSubTaskIssue;

export interface IssueTreeNode<Issue extends SimpleIssue> {
  readonly issue: Issue;
  readonly children: readonly IssueTreeNode<Issue>[];
}

interface WritableTreeNode<Issue extends SimpleIssue> {
  readonly issue: Issue;
  readonly children: IssueTreeNode<Issue>[];
}

export function buildIssueTree<Issue extends SimpleIssue>(issues: readonly Issue[]): readonly IssueTreeNode<Issue>[] {
  const treeRoutes: IssueTreeNode<Issue>[] = [];
  const nodeByKey = new Map<string, WritableTreeNode<Issue>>();

  for (const issue of issues) {
    nodeByKey.set(issue.key, {issue, children: []});
  }

  for (const node of [...nodeByKey.values()]) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
    const issue = node.issue as SimpleIssue;
    switch (issue.type) {
      case 'epic':
        treeRoutes.push(node);
        break;

      case 'standard': {
        const epicNode = issue.epicLink && nodeByKey.get(issue.epicLink);
        if (epicNode) {
          epicNode.children.push(node);
        } else {
          treeRoutes.push(node);
        }
        break;
      }

      case 'subTask': {
        nodeByKey.get(issue.parentKey)?.children.push(node);
        break;
      }
    }
  }

  return treeRoutes;
}
