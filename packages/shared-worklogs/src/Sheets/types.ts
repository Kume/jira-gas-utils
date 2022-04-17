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
  readonly jobNumber?: string;
  readonly jobType?: string;
}

export interface SQJobOnSheet {
  readonly id: string;
  readonly label: string;
  readonly accountTypes: readonly string[];
}

export interface SQAccountTypeOnSheet {
  readonly id: string;
  readonly label_l1: string;
  readonly label_l2: string;
  readonly label_l3: string;
}

interface IssueOnSheetBase {
  readonly key: string;
  readonly summary: string;
  readonly asigneeEmail: string | null;
  readonly mainAssignee: string | null;
  readonly updatedAt: Date;
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
