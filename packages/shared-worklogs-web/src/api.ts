import {IssueOnSheet, SQAccountTypeOnSheet, SQJobOnSheet} from './types';
import {flatSampleIssueTree} from '@jira-gas-utils/jira-spread-common/dist/Jira/issueTree';
import dayjs from 'dayjs';

declare const google: any;

function runScriptAsync<T>(functionName: string, ...args: []): Promise<T | undefined> {
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
  const result = await runScriptAsync<SQAccountTypeOnSheet[]>('loadAccountTypes');
  return (
    result ?? [
      {id: '7-1-1', label_l1: 'あ', label_l2: 'い', label_l3: 'う'},
      {id: '7-1-2', label_l1: 'あ', label_l2: 'い', label_l3: 'ウ'},
      {id: '6-2-2', label_l1: 'A', label_l2: 'B', label_l3: 'C'},
    ]
  );
}

export async function fetchRelatedIssues(): Promise<IssueOnSheet[]> {
  const result = await runScriptAsync<IssueOnSheet[]>('loadRelatedIssues');
  return (
    result ??
    flatSampleIssueTree<IssueOnSheet>([
      {
        issue: {
          key: 'I-0100',
          type: 'epic',
          summary: 'エピック1',
          asigneeEmail: null,
          mainAssignee: null,
          epicName: 'エピ1',
          updatedAt: dayjs('2022-04-01').toDate(),
        },
        children: [
          {
            issue: {
              key: 'I-0110',
              type: 'standard',
              summary: 'タスク1-1',
              asigneeEmail: null,
              mainAssignee: null,
              epicLink: undefined,
              updatedAt: dayjs('2022-04-03').toDate(),
            },
          },
          {
            issue: {
              key: 'I-0120',
              type: 'standard',
              summary: 'タスク1-2',
              asigneeEmail: null,
              mainAssignee: null,
              epicLink: undefined,
              updatedAt: dayjs('2022-04-04').toDate(),
            },
          },
        ],
      },
    ])
  );
}
