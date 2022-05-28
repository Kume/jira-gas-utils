import {
  IssueWithRelation,
  PlainIssueOnSheet,
  SettingsForFrontend,
  SQAccountTypeOnSheet,
  SQJobOnSheet,
  StartWorkFormValue,
  StartWorkParams,
} from './libs/types';
import {WorkEmail} from './models/WorkEmail';
import {flatSampleIssueTree} from '@jira-gas-utils/jira-spread-common/dist/Jira/issueTree';
// @ts-ignore ブラウザ用のビルドはdistディレクトリにあるが、型定義がされていないため必ずエラーが出る
import handlebars from 'handlebars/dist/handlebars';
import dayjs from 'dayjs';

handlebars.registerHelper('formatDate', (date: Date | string, format: string): string => {
  return dayjs(date).format(format);
});

declare const google: any;

function runScriptAsync<T>(functionName: string, ...args: unknown[]): Promise<T | undefined> {
  if (typeof google === 'undefined') {
    return Promise.resolve(undefined);
  }
  return new Promise<T>((resolve, reject) => {
    google.script.run
      .withFailureHandler(reject)
      .withSuccessHandler(resolve)
      [functionName](...args);
  });
}

export async function fetchJobs(): Promise<SQJobOnSheet[]> {
  const result = await runScriptAsync<SQJobOnSheet[]>('loadJobs');
  return (
    result ?? [
      {label: 'ジョブ1', id: 'JOB_00001', accountTypes: ['7-1-1', '7-1-2', '6-2-2']},
      {label: 'ジョブ2', id: 'JOB_00002', accountTypes: ['7-1-1']},
      {label: 'ジョブ3', id: 'JOB_00003', accountTypes: ['7-1-1']},
    ]
  );
}

export async function fetchAccountTypes(): Promise<SQAccountTypeOnSheet[]> {
  const result = await runScriptAsync<SQAccountTypeOnSheet[]>('loadAfccountTypes');
  return (
    result ?? [
      {id: '7-1-1', label_l1: 'あ', label_l2: 'い', label_l3: 'う'},
      {id: '7-1-2', label_l1: 'あ', label_l2: 'い', label_l3: 'ウ'},
      {id: '6-2-2', label_l1: 'A', label_l2: 'B', label_l3: 'C'},
    ]
  );
}

export async function fetchRelatedIssues(): Promise<IssueWithRelation[]> {
  const result = await runScriptAsync<IssueWithRelation[]>('loadRelatedIssues');
  return (
    result ??
    flatSampleIssueTree<IssueWithRelation>([
      {
        issue: {
          key: 'I-0100',
          type: 'epic',
          summary: 'エピック1',
          assigneeEmail: null,
          mainAssignee: null,
          epicName: 'エピ1',
          updatedAt: '2022-04-01',
          relation: {assigned: true, recentlyWorked: {at: '2022-04-01'}},
        },
        children: [
          {
            issue: {
              key: 'I-0110',
              type: 'standard',
              summary: 'タスク1-1',
              assigneeEmail: null,
              mainAssignee: null,
              epicLink: undefined,
              updatedAt: '2022-04-03',
              relation: {assigned: true},
            },
            children: [
              {
                issue: {
                  key: 'I-0111',
                  type: 'subTask',
                  summary: 'サブタスク1-1-1',
                  assigneeEmail: null,
                  mainAssignee: null,
                  parentKey: 'dummy',
                  updatedAt: '2022-04-03',
                  relation: {recentlyWorked: {at: '2022-04-05'}},
                },
              },
              {
                issue: {
                  key: 'I-0112',
                  type: 'subTask',
                  summary: 'サブタスク1-1-2-とても長いタスク名のテストのために とても長いタスク名をつけてみます。',
                  assigneeEmail: null,
                  mainAssignee: null,
                  parentKey: 'dummy',
                  updatedAt: '2022-04-03',
                  relation: {recentlyWorked: {at: '2022-04-10'}},
                },
              },
              {
                issue: {
                  key: 'I-0113',
                  type: 'subTask',
                  summary: 'サブタスク1-1-3',
                  assigneeEmail: null,
                  mainAssignee: null,
                  parentKey: 'dummy',
                  updatedAt: '2022-04-03',
                  relation: {recentlyWorked: {at: '2022-05-01'}},
                },
              },
            ],
          },
          {
            issue: {
              key: 'I-0120',
              type: 'standard',
              summary: 'タスク1-2',
              assigneeEmail: null,
              mainAssignee: null,
              epicLink: undefined,
              updatedAt: '2022-04-04',
              relation: {bookmark: true, recentlyWorked: {at: '2022-04-01'}},
            },
          },
          {
            issue: {
              key: 'I-0130',
              type: 'standard',
              summary: 'タスク1-3',
              assigneeEmail: null,
              mainAssignee: null,
              epicLink: undefined,
              updatedAt: '2022-04-04',
              relation: {bookmark: true},
            },
          },
        ],
      },
    ])
  );
}

export async function searchIssues(searchWord: string): Promise<PlainIssueOnSheet[]> {
  const result = await runScriptAsync<PlainIssueOnSheet[]>('searchIssues', searchWord);
  return (
    result ?? [
      {
        key: 'I-1001',
        type: 'standard',
        summary: '検索結果タスク1',
        assigneeEmail: null,
        mainAssignee: null,
        epicLink: undefined,
        updatedAt: '2022-04-04',
      },
      {
        key: 'I-1002',
        type: 'standard',
        summary: '検索結果タスク2',
        assigneeEmail: null,
        mainAssignee: null,
        epicLink: undefined,
        updatedAt: '2022-04-04',
      },
      {
        key: 'I-1003',
        type: 'standard',
        summary: '検索結果タスク3',
        assigneeEmail: null,
        mainAssignee: null,
        epicLink: undefined,
        updatedAt: '2022-04-04',
      },
    ]
  );
}

export async function postStartWork(params: StartWorkFormValue): Promise<void> {
  const settings = await fetchSettings();
  const templateParameter = WorkEmail.makeParameterForStart(params, settings);
  const emailTitle =
    settings.startEmailSubjectTemplate && handlebars.compile(settings.startEmailSubjectTemplate)(templateParameter);
  const emailContent =
    settings.startEmailContentTemplate && handlebars.compile(settings.startEmailContentTemplate)(templateParameter);
  const postParams: StartWorkParams = {...params, emailTitle, emailContent};
  await runScriptAsync<void>('startWork', postParams);
}

export async function fetchSettings(): Promise<SettingsForFrontend> {
  const result = await runScriptAsync<SettingsForFrontend>('getSettings');
  return (
    result || {
      selfName: 'テスト姓',
      startEmailSubjectTemplate: '【勤怠】{{formatDate now "YYYYMMDD"}}_{{name}} ({{workMethod}}開始)',
      startEmailContentTemplate: '■開始時間\n{{startAtTime}}\n\n■業務内容{{workItems}}',
      endEmailSubjectTemplate: '【勤怠】{{formatDate now "YYYYMMDD"}}_{{name}} ({{workMethod}}終了)',
      endEmailContentTemplate: '■終了時間\n{{endAtTime}}\n\n■業務内容{{workItems}}',
    }
  );
}
