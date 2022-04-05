import {getTemplateSheetByName} from './templateSpreadSheet';

export class SheetBase {
  public constructor(
    protected readonly templateSheetName: string,
    protected readonly sheetName: string,
    private readonly getSpreadSheet: () => GoogleAppsScript.Spreadsheet.Spreadsheet = () =>
      SpreadsheetApp.getActiveSpreadsheet(),
  ) {}

  public getTemplateSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    return getTemplateSheetByName(this.templateSheetName);
  }

  private _spraedSheet?: GoogleAppsScript.Spreadsheet.Spreadsheet;
  private get spraedSheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
    if (!this._spraedSheet) {
      this._spraedSheet = this.getSpreadSheet();
    }
    return this._spraedSheet;
  }

  public getOrCreateSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const sheetName = this.sheetName;
    const sheet = this.spraedSheet.getSheetByName(sheetName);
    if (sheet) {
      return sheet;
    }
    const template = this.getTemplateSheet();
    const newSheet = template.copyTo(this.spraedSheet);
    newSheet.setName(sheetName);
    return newSheet;
  }

  public refreshSheet(): GoogleAppsScript.Spreadsheet.Sheet {
    const template = this.getTemplateSheet();
    let sheet = this.spraedSheet.getSheetByName(this.sheetName);
    if (sheet) {
      this.spraedSheet.deleteSheet(sheet);
    }
    sheet = template.copyTo(this.spraedSheet);
    sheet.setName(this.sheetName);
    return sheet;
  }
}
