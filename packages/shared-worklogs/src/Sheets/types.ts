export interface DataSet {
  readonly worklogs: readonly WorklogOnSheet[];
  readonly issues: readonly IssueOnSheet[];
}

export interface WorklogOnSheet {
  readonly id: string;
  readonly startAt: Date;
  readonly updatedAt: Date;
  readonly spentTimeMinute: number;
  readonly content: string;
  readonly issueKey: string;
  readonly userEmail: string;
}

interface IssueOnSheetBase {
  readonly key: string;
  readonly summary: string;
  readonly asigneeEmail: string | null;
  readonly mainAssignee: string | null;
}

export interface EpicIssueOnSheet extends IssueOnSheetBase {
  readonly type: 'epic';
  readonly epicName: string;
}

export interface StandardIssueOnSheet extends IssueOnSheetBase {
  readonly type: 'standard';
  readonly epicLink: string | undefined;
}

export interface SubTaskIssueOnSheet extends IssueOnSheetBase {
  readonly type: 'subTask';
  readonly parentKey: string;
}

export type IssueOnSheet = EpicIssueOnSheet | StandardIssueOnSheet | SubTaskIssueOnSheet;

export interface Member {
  readonly name: string;
  readonly email: string;
}
