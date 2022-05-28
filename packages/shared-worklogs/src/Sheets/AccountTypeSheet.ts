import {ConveterFunctions} from '../GasJiraCommon/ConverterBase';
import {SheetBase} from '../SpreadCommon/SheetBase';
import {SQAccountTypeOnSheet} from '../libs/types';

export class AccountTypeSheet {
  public readonly sheetBase = new SheetBase('ジョブ内訳一覧', 'ジョブ内訳一覧');

  public refreshSheet(): void {
    this.sheetBase.refreshSheet();
  }

  private _accountTypes?: readonly SQAccountTypeOnSheet[];
  public readAccountTypes(): readonly SQAccountTypeOnSheet[] {
    if (this._accountTypes) {
      return this._accountTypes;
    }

    const accountTypes: SQAccountTypeOnSheet[] = [];
    const sheet = this.sheetBase.getOrCreateSheet();
    const rows = sheet.getRange(2, 1, sheet.getMaxRows(), 6).getValues();
    for (const row of rows) {
      if (!row.some(Boolean)) {
        continue;
      }
      try {
        const id1 = ConveterFunctions.parseNumber('ID1', true, row[0]);
        const id2 = ConveterFunctions.parseNumber('ID2', true, row[2]);
        const id3 = ConveterFunctions.parseNumber('ID3', true, row[4]);
        accountTypes.push({
          id: `${id1}-${id2}-${id3}`,
          label_l1: ConveterFunctions.parseString('名称1', true, row[1]),
          label_l2: ConveterFunctions.parseString('名称2', true, row[3]),
          label_l3: ConveterFunctions.parseString('名称3', true, row[5]),
        });
      } catch (error) {
        Logger.log(error);
      }
    }

    this._accountTypes = accountTypes;
    return accountTypes;
  }
}
