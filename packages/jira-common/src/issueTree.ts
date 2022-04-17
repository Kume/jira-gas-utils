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

type SelectByType<T, Type> = T extends {type: Type} ? T : never;

export interface StandardIssueTreeNode<Issue extends SimpleIssue> {
  readonly issue: SelectByType<Issue, 'standard'>;
  readonly children?: readonly SubTaskIssueTreeNode<Issue>[];
}

export interface SubTaskIssueTreeNode<Issue extends SimpleIssue> {
  readonly issue: SelectByType<Issue, 'subTask'>;
}

export interface EpickIssueTreeNode<Issue extends SimpleIssue> {
  readonly issue: SelectByType<Issue, 'epic'>;
  readonly children?: readonly StandardIssueTreeNode<Issue>[];
}

export type IssueTreeNode<Issue extends SimpleIssue> =
  | EpickIssueTreeNode<Issue>
  | StandardIssueTreeNode<Issue>
  | SubTaskIssueTreeNode<Issue>;

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

  for (const node of [...nodeByKey.values()] as any as IssueTreeNode<Issue>[]) {
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

type SelectByIssueType<Node extends {issue: SimpleIssue}, Type extends SimpleIssue['type']> = Node extends {
  issue: {type: Type};
}
  ? Node
  : never;

function issueTreeNodeTypeIs<Issue extends SimpleIssue, Type extends SimpleIssue['type']>(
  issue: IssueTreeNode<Issue>,
  type: Type,
): issue is SelectByIssueType<IssueTreeNode<Issue>, Type> {
  return issue.issue.type === type;
}

export function flatSampleIssueTree<Issue extends SimpleIssue>(rootNodes: readonly IssueTreeNode<Issue>[]): Issue[] {
  const issues: Issue[] = [];
  for (let rootNode of rootNodes) {
    issues.push(rootNode.issue);
    if (issueTreeNodeTypeIs(rootNode, 'epic')) {
      addEpicIssueChildren(rootNode, issues);
    } else if (issueTreeNodeTypeIs(rootNode, 'standard')) {
      addStandardIssueChildren(rootNode, issues);
    }
  }
  return issues;
}

function addEpicIssueChildren<Issue extends SimpleIssue>(node: EpickIssueTreeNode<Issue>, issues: Issue[]): void {
  if (node.children) {
    for (const child of node.children) {
      issues.push({...child.issue, epicLink: node.issue.key});
      addStandardIssueChildren(child, issues);
    }
  }
}

function addStandardIssueChildren<Issue extends SimpleIssue>(
  node: StandardIssueTreeNode<Issue>,
  issues: Issue[],
): void {
  if (node.children) {
    for (const child of node.children) {
      issues.push({...child.issue, parentKey: node.issue.key});
    }
  }
}
