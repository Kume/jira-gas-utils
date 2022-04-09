import {jiraIssueLinkSpreadCell, timeSecondsToHour, timeSecoundsToMinute} from '../GasJiraCommon/spreadJiraUtil';
import {formatJiraDocumentToPlainString} from '../Jira/document';
import {ForamttedJiraIsssue, JiraWorklog} from '../Jira/types';
import {ConverterBase, SpreadSheetValue} from '../GasJiraCommon/ConverterBase';
import {WorklogOnSheet} from './types';

type RawItem = readonly [JiraWorklog, ForamttedJiraIsssue | undefined];

export class WorklogOnSpreadsheetConverter {
  private readonly base = new ConverterBase<RawItem, WorklogOnSheet>([
    {
      label: 'ID',
      rawToSpread: ([{id}]): string => id,
      spreadToStored: (worklog, value): void => {
        if (typeof value !== 'number') {
          throw new Error(`idの型が違います。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
        }
        worklog.id = `${value}`;
      },
    },
    {
      label: '開始日時',
      rawToSpread: ([{started}]): Date => new Date(started),
      spreadToStored: (worklog, value) => {
        if (!(value instanceof Date)) {
          throw new Error(`開始日時の型が違います。 ${typeof value} ${value ?? 'undefined'}`);
        }
        worklog.startAt = value;
      },
    },
    {
      label: 'チケット番号',
      rawToSpread: ([, issue]) => (issue ? jiraIssueLinkSpreadCell(issue) : 'チケットなし'),
      spreadToStored: (worklog, value) => {
        if (value !== null && typeof value !== 'string') {
          throw new Error(`チケット番号の型が違います。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
        }
        worklog.issueKey = value ?? undefined;
      },
    },
    {
      label: '作業内容',
      rawToSpread: ([{comment}]) => (comment ? formatJiraDocumentToPlainString(comment) : ''),
      spreadToStored: (worklog, value) => {
        if (typeof value !== 'string') {
          throw new Error(`作業内容の型が違います。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
        }
        worklog.content = value ?? undefined;
      },
    },
    {
      label: '時間',
      rawToSpread: ([{timeSpentSeconds}]) => timeSecoundsToMinute(timeSpentSeconds),
      spreadToStored: (worklog, value) => {
        if (typeof value !== 'number') {
          throw new Error(`経過時間の型が間違っています。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
        }
        worklog.spentTimeMinute = value;
      },
    },
    {
      label: '更新日時',
      rawToSpread: ([{updated}]) => new Date(updated),
      spreadToStored: (worklog, value) => {
        if (!(value instanceof Date)) {
          throw new Error(`更新日時の型が違います。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
        }
        worklog.updatedAt = value;
      },
    },
    {
      label: 'ユーザーメールアドレス',
      rawToSpread: ([{author}]) => author.emailAddress,
      spreadToStored: (worklog, value) => {
        if (typeof value !== 'string') {
          throw new Error(`ユーザーメールアドレスの型が違います。 ${typeof value} ${value?.toString() ?? 'undefined'}`);
        }
        worklog.userEmail = value ?? undefined;
      },
    },
  ]);

  public get columnCount(): number {
    return this.base.definitions.length;
  }

  public rawToSpread(raw: RawItem): SpreadSheetValue[] {
    return this.base.rawToSpread(raw);
  }

  public spreadToStored(spreadValues: readonly SpreadSheetValue[]): WorklogOnSheet {
    return this.base.spreadToStored(spreadValues);
  }
}
