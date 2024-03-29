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

export interface SQJobMasters {
  readonly jobs: readonly SQJobOnSheet[];
  readonly accountTypes: readonly SQAccountTypeOnSheet[];
}

interface IssueOnSheetBase {
  readonly key: string;
  readonly summary: string;
  readonly assigneeEmail: string | null;
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

export type PlainIssueOnSheet = ToPlainObject<IssueOnSheet>;

export interface Member {
  readonly name: string;
  readonly email: string;
}

type ToPlainObject<T> = T extends Date
  ? string
  : T extends (infer Item)[]
  ? ToPlainObject<Item>[]
  : T extends {[P in keyof T]: unknown}
  ? {[P in keyof T]: ToPlainObject<T[P]>}
  : T;

export type IssueWithRelation = PlainIssueOnSheet & {readonly relation: IssueRelation};

/**
 * 自身に関連のあるIssueの関係性を表します。
 */
export interface IssueRelation {
  /** 最近作業したことを表します。 */
  readonly recentlyWorked?: {readonly at: string};

  /** 自身が担当になっていることを表します。 */
  readonly assigned?: boolean;

  /** お気に入りに入れたことを表します。 */
  readonly bookmark?: boolean;
}

export type WorkLocation = 'office' | 'home';

export interface StartWorkFormValue {
  readonly startTime: string;
  readonly location: WorkLocation;
  readonly messageForMeeting: string;
  readonly workItems: readonly StartWorkWorkItem[];
}

export interface StartWorkParams extends StartWorkFormValue {
  readonly emailTitle?: string;
  readonly emailContent?: string;
}

export interface StartWorkWorkItem {
  readonly issue: PlainIssueOnSheet;
  readonly content: string;
  readonly time: string;
}

export interface EndWorkFormValue {
  readonly worklogItems: readonly EndWorkWorkItem[];
  readonly endTime: string;
  readonly message: string;
}

export interface EndWorkParams extends EndWorkFormValue {
  readonly emailTitle?: string;
  readonly emailContent?: string;
}

export interface EndWorkWorkItem {
  readonly issue: PlainIssueOnSheet;
  readonly content: string;
  readonly time: string;
  readonly job: string;
  readonly accountType: string;
}

export interface SettingsForFrontend {
  selfName: string;
  startEmailSubjectTemplate?: string;
  startEmailContentTemplate?: string;
  endEmailSubjectTemplate?: string;
  endEmailContentTemplate?: string;
}
