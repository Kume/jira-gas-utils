import {getTemplateSpreadSheetId} from './getTemplateSpreadSheetId';

export function getTemplateSpreadSheet(): GoogleAppsScript.Spreadsheet.Spreadsheet {
  return SpreadsheetApp.openById(getTemplateSpreadSheetId());
}

export function getTemplateSheetByName(name: string): GoogleAppsScript.Spreadsheet.Sheet {
  const sheet = getTemplateSpreadSheet().getSheetByName(name);
  if (!sheet) {
    throw new Error(`テンプレートの ${name} シートが見つかりません。`);
  }
  return sheet;
}
