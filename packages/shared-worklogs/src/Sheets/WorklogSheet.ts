import {ForamttedJiraIsssue, JiraWorklog} from '../Jira/types';
import {SheetBase} from '../SpreadCommon/SheetBase';
import {SpreadJiraClient} from '../SpreadCommon/SpreadJiraClient';
import {getStartOfDate} from '../SpreadCommon/spreadUtils';
import {EndWorkWorkItem, WorklogOnSheet} from '../libs/types';
import {WorklogOnSpreadsheetConverter} from './WorklogOnSpreadsheetConverter';

export type StoredWorklog = WorklogOnSheet & {readonly row: number};

export class WorklogSheet {
  public readonly sheetBase = new SheetBase('共有作業ログ記録', '作業ログ記録');
  private readonly converter = new WorklogOnSpreadsheetConverter();

  public refreshSheet(): void {
    this.sheetBase.refreshSheet();
  }

  public syncJiraToSheet(client: SpreadJiraClient): void {
    const newWorklogs = client.fetchMyWorklogs(this.latestWorklogUpdated());
    Logger.log(`new logs count = ${newWorklogs.length}`);
    // TODO
    // this.writeWorklogs(newWorklogs);
  }

  public writeWorklogs(newWorklogs: readonly EndWorkWorkItem[]): void {
    const storedWorklogs = this.readWorklogs();
    const storedWorklogIdRowMap = new Map(storedWorklogs.map(({id, row}) => [id, row]));
    const sheet = this.sheetBase.getOrCreateSheet();
    let nextRow = Math.max(1, ...storedWorklogs.map(({row}) => row)) + 1;
    for (const newWorklog of newWorklogs) {
      // TODO ちゃんと実装
      // const storedRow = storedWorklogIdRowMap.get(newWorklog[0].id);
      const storedRow = undefined;
      if (storedRow !== undefined) {
        // すでに存在しているログなら更新
        // const rowData = this.converter.rawToSpread(newWorklog);
        // if (rowData.some((cell) => cell === undefined)) {
        //   // undefinedが含まれている場合、そのセルは上書きしないので、セル一つ一つ更新していく
        //   let column = 1;
        //   for (const cell of rowData) {
        //     if (cell !== undefined) {
        //       sheet.getRange(storedRow, column++, 1, 1).setValue(cell);
        //     }
        //   }
        // } else {
        //   sheet
        //     .getRange(storedRow, 1, 1, this.converter.columnCount)
        //     .setValues([this.converter.rawToSpread(newWorklog)]);
        // }
      } else {
        sheet
          .getRange(nextRow, 1, 1, this.converter.columnCount)
          .setValues([
            [
              '',
              new Date(),
              newWorklog.issue.key,
              newWorklog.job,
              newWorklog.accountType,
              newWorklog.content,
              newWorklog.time,
              new Date(),
              '',
            ],
          ]);
        nextRow++;
      }
    }
    this.clearWorklogsCache();
  }

  public writeWorklogsOld(newWorklogs: readonly (readonly [JiraWorklog, ForamttedJiraIsssue | undefined])[]): void {
    const storedWorklogs = this.readWorklogs();
    const storedWorklogIdRowMap = new Map(storedWorklogs.map(({id, row}) => [id, row]));
    const sheet = this.sheetBase.getOrCreateSheet();
    let nextRow = Math.max(1, ...storedWorklogs.map(({row}) => row)) + 1;
    for (const newWorklog of newWorklogs) {
      const storedRow = storedWorklogIdRowMap.get(newWorklog[0].id);
      if (storedRow !== undefined) {
        // すでに存在しているログなら更新
        const rowData = this.converter.rawToSpread(newWorklog);
        if (rowData.some((cell) => cell === undefined)) {
          // undefinedが含まれている場合、そのセルは上書きしないので、セル一つ一つ更新していく
          let column = 1;
          for (const cell of rowData) {
            if (cell !== undefined) {
              sheet.getRange(storedRow, column++, 1, 1).setValue(cell);
            }
          }
        } else {
          sheet
            .getRange(storedRow, 1, 1, this.converter.columnCount)
            .setValues([this.converter.rawToSpread(newWorklog)]);
        }
      } else {
        sheet.getRange(nextRow, 1, 1, this.converter.columnCount).setValues([this.converter.rawToSpread(newWorklog)]);
        nextRow++;
      }
    }
    this.clearWorklogsCache();
  }

  protected _worklogs?: readonly StoredWorklog[];
  public readWorklogs(): readonly StoredWorklog[] {
    if (this._worklogs) {
      return this._worklogs;
    }
    const worklogs: StoredWorklog[] = [];

    const sheet = this.sheetBase.getOrCreateSheet();
    const rows = sheet.getRange(2, 1, sheet.getMaxRows(), this.converter.columnCount).getValues();
    rows.forEach((row, rowIndex) => {
      if (row.some((cell) => cell)) {
        try {
          worklogs.push({...this.converter.spreadToStored(row), row: rowIndex + 2});
        } catch (error) {
          Logger.log(error);
        }
      }
    });

    this._worklogs = worklogs;
    return this._worklogs;
  }
  protected clearWorklogsCache(): void {
    this._worklogs = undefined;
  }

  protected latestWorklogUpdated(): number | undefined {
    const minimum = Date.now() - 14 * 24 * 60 * 60 * 1000;
    return Math.max(minimum, ...this.readWorklogs().map(({updatedAt}) => updatedAt.getTime()));
  }

  public todaysWorklogs(): WorklogOnSheet[] {
    const todayStartAt = getStartOfDate(new Date());
    return this.readWorklogs().filter(({startAt}) => startAt > todayStartAt);
  }
}
