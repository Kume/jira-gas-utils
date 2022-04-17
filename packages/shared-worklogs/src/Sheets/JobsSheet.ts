import {ConveterFunctions} from '../GasJiraCommon/ConverterBase';
import {SheetBase} from '../SpreadCommon/SheetBase';
import {SQJobOnSheet} from './types';

const MAX_ACCOUNT_TYPE = 10;

export class JobsSheet {
  public readonly sheetBase = new SheetBase('ジョブ一覧', 'ジョブ一覧');

  public refreshSheet(): void {
    this.sheetBase.refreshSheet();
  }

  private _jobs?: readonly SQJobOnSheet[];
  public readJobs(): readonly SQJobOnSheet[] {
    if (this._jobs) {
      return this._jobs;
    }

    const jobs: SQJobOnSheet[] = [];
    const sheet = this.sheetBase.getOrCreateSheet();
    const rows = sheet.getRange(2, 1, sheet.getMaxRows(), 2 + MAX_ACCOUNT_TYPE).getValues();
    for (const row of rows) {
      if (!row.some(Boolean)) {
        continue;
      }
      try {
        const accountTypes: string[] = [];
        for (let i = 0; i < MAX_ACCOUNT_TYPE; i++) {
          const index = i + 2;
          const accountType = ConveterFunctions.parseString(`内訳${i + 1}`, false, row[i + 2]);
          if (accountType) {
            accountTypes.push(accountType);
          }
        }
        jobs.push({
          id: ConveterFunctions.parseString('ジョブNo', true, row[0]),
          label: ConveterFunctions.parseString('ジョブ名', true, row[1]),
          accountTypes,
        });
      } catch (error) {
        Logger.log(error);
      }
    }

    this._jobs = jobs;
    return jobs;
  }

  private clearJobsCache(): void {
    this._jobs = undefined;
  }
}
