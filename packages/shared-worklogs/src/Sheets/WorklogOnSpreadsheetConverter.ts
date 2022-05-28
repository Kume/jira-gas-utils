import {jiraIssueLinkSpreadCell, timeSecondsToHour, timeSecoundsToMinute} from '../GasJiraCommon/spreadJiraUtil';
import {formatJiraDocumentToPlainString} from '../Jira/document';
import {ForamttedJiraIsssue, JiraWorklog} from '../Jira/types';
import {ConverterBase, ConveterFunctions, SpreadSheetValue} from '../GasJiraCommon/ConverterBase';
import {WorklogOnSheet} from '../libs/types';

type RawItem = readonly [JiraWorklog, ForamttedJiraIsssue | undefined];

export class WorklogOnSpreadsheetConverter {
  private readonly base = new ConverterBase<RawItem, WorklogOnSheet>([
    {
      label: 'ID',
      rawToSpread: ([{id}]): string => id,
      spreadToStored: (worklog, value): void => {
        worklog.id = `${ConveterFunctions.parseNumber('ID', true, value)}`;
      },
    },
    {
      label: '開始日時',
      rawToSpread: ([{started}]): Date => new Date(started),
      spreadToStored: (worklog, value) => {
        worklog.startAt = ConveterFunctions.parseDate('開始日時', true, value);
      },
    },
    {
      label: 'チケット番号',
      rawToSpread: ([, issue]) => (issue ? jiraIssueLinkSpreadCell(issue) : 'チケットなし'),
      spreadToStored: (worklog, value) => {
        worklog.issueKey = ConveterFunctions.parseString('チケット番号', true, value);
      },
    },
    {
      label: '作業内容',
      rawToSpread: ([{comment}]) => (comment ? formatJiraDocumentToPlainString(comment) : ''),
      spreadToStored: (worklog, value) => {
        worklog.content = ConveterFunctions.parseString('作業内容', true, value);
      },
    },
    {
      label: '時間',
      rawToSpread: ([{timeSpentSeconds}]) => timeSecoundsToMinute(timeSpentSeconds),
      spreadToStored: (worklog, value) => {
        worklog.spentTimeMinute = ConveterFunctions.parseNumber('経過時間', true, value);
      },
    },
    {
      label: '更新日時',
      rawToSpread: ([{updated}]) => new Date(updated),
      spreadToStored: (worklog, value) => {
        worklog.updatedAt = ConveterFunctions.parseDate('更新日時', true, value);
      },
    },
    {
      label: 'ユーザーメールアドレス',
      rawToSpread: ([{author}]) => author.emailAddress,
      spreadToStored: (worklog, value) => {
        worklog.userEmail = ConveterFunctions.parseString('ユーザーメールアドレス', true, value);
      },
    },
    {
      label: 'ジョブNo',
      rawToSpread: () => undefined,
      spreadToStored: (worklog, value) => {
        worklog.jobNumber = ConveterFunctions.parseString('ジョブNo', false, value);
      },
    },
    {
      label: '分類',
      rawToSpread: () => undefined,
      spreadToStored: (worklog, value) => {
        worklog.jobType = ConveterFunctions.parseString('分類', false, value);
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
