/////////////////////////////////////////////////////////////////////////////////////
// JiraIssue
/////////////////////////////////////////////////////////////////////////////////////

export interface JiraAuthor {
  self: string;
  accountId: string;
  displayName: string;
  emailAddress: string;
  active: boolean;
}

export interface JiraField {
  id: string;
  key: string;
  name: string;
  untranslatedName?: string;
  custom: boolean;
  orderable: true;
  navigable: true;
  searchable: boolean;
  clauseNames: readonly string[];
  schema: unknown;
}

/////////////////////////////////////////////////////////////////////////////////////
// JiraIssue
/////////////////////////////////////////////////////////////////////////////////////

export interface JiraIssue {
  id: string;
  self: string;
  key: string;
  maxResults: number;
  total: number;
  fields: {[key: string]: unknown};
}

export interface FormattedJiraIssueBase {
  id: string;
  key: string;
  self: string;
  summary: string;
  assignee: JiraAuthor | null;
  mainAssignee: string | null;
  updatedAt: string;
}

export interface FormattedJiraEpicIssue extends FormattedJiraIssueBase {
  type: 'epic';
  epicName: string;
}

export interface FormattedJiraStandardIssue extends FormattedJiraIssueBase {
  type: 'standard';
  epicLink: string | undefined;
}

export interface FormattedJiraSubTaskIssue extends FormattedJiraIssueBase {
  type: 'subTask';
  parentKey: string;
}

export interface JiraIssueType {
  self: string;
  id: string;
  description: string;
  iconUrl: string;
  name: string;
  subtask: boolean;
  avaterId: number;
}

export type ForamttedJiraIsssue = FormattedJiraEpicIssue | FormattedJiraStandardIssue | FormattedJiraSubTaskIssue;

/////////////////////////////////////////////////////////////////////////////////////
// JiraWorklog
/////////////////////////////////////////////////////////////////////////////////////

export interface JiraWorklogList {
  values: readonly JiraWorklogListItem[];
  since: number;
  untile: number;
  self: string;
  nextPage?: string;
  lastPage: boolean;
}

export interface JiraWorklogListItem {
  worklogId: number;
  updatedTime: number;
  properties: unknown[];
}

export interface JiraWorklogResult {
  startAt: number;
  total: number;
  maxResults: number;
  worklogs: readonly JiraWorklog[];
}

export interface JiraApiErrorResponse {
  errors: Record<string, string>;
  errorMessages: string[];
}

export interface JiraWorklog {
  id: string;
  self: string;
  author: JiraAuthor;
  updateAuthor: JiraAuthor;
  timeSpentSeconds: number;
  issueId: string;
  created: string;
  updated: string;
  started: string;
  comment: JiraDocument | null;
}

export interface JiraWorklogCreateRequest {
  comment?: JiraDocument;
  timeSpentSeconds: number;
}

export interface JiraIssueSearchResult {
  startAt: number;
  total: number;
  maxResults: number;
  issues: JiraIssue[];
}

/////////////////////////////////////////////////////////////////////////////////////
// Document
/////////////////////////////////////////////////////////////////////////////////////

// see https://developer.atlassian.com/cloud/jira/platform/apis/document/structure/

export interface JiraDocument {
  version: 1;
  type: 'doc';
  content: JiraDocumentTopLevelNode[];
}

export type JiraDocumentTopLevelNode =
  | JiraDocumentParagraphNode
  | JiraDocumentBulletListNode
  | JiraDocumentOrderedListNode;

export interface JiraDocumentParagraphNode {
  type: 'paragraph';
  content: JiraDocumentInlineNode[];
}

export interface JiraDocumentBulletListNode {
  type: 'bulletList';
  content: JiraDcoumentListItem[];
}

export interface JiraDocumentOrderedListNode {
  type: 'orderedList';
  content: JiraDcoumentListItem[];
}

export interface JiraDcoumentListItem {
  type: 'listItem';
  content: (JiraDocumentBulletListNode | JiraDocumentParagraphNode | JiraDocumentOrderedListNode)[];
}

export interface JiraDocumentTextNode {
  type: 'text';
  text: string;
}

export interface JiraDocumentHardBreakNode {
  type: 'hardBreak';
}

export type JiraDocumentInlineNode = JiraDocumentTextNode | JiraDocumentHardBreakNode;
