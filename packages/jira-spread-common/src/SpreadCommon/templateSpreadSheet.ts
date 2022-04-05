import {getOrInputUserProperty} from './spreadUtils';

export function getTemplateSpreadSheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  const sheetId = getOrInputUserProperty('テンプレートスプレッドシートID', 'templateSpreadSheetId', (id) => {
    try {
      const spreadSheet = SpreadsheetApp.openById(sheetId);
      if (!spreadSheet) {
        return 'テンプレートスプレッドシートにアクセス出来ませんでした。(2)';
      }
    } catch (error) {
      return 'テンプレートスプレッドシートにアクセス出来ませんでした。';
    }
    return undefined;
  });
  return SpreadsheetApp.openById(sheetId);
}

export function getTemplateSheetByName(name: string): GoogleAppsScript.Spreadsheet.Sheet {
  const sheet = getTemplateSpreadSheet().getSheetByName(name);
  if (!sheet) {
    throw new Error(`テンプレートの ${name} シートが見つかりません。`);
  }
  return sheet;
}
