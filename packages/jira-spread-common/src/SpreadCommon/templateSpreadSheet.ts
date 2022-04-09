import {getOrInputUserProperty} from './spreadUtils';

export function getTemplateSpreadSheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  const sheetId = getOrInputUserProperty('テンプレートスプレッドシートID', 'templateSpreadSheetId', (id) => {
    try {
      SpreadsheetApp.openById(id);
      return undefined;
    } catch (error) {
      return 'テンプレートスプレッドシートにアクセス出来ませんでした。';
    }
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
