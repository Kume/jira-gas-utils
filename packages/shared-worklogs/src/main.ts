import {SettingSheet} from './SettingSheet';

function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('JIRA連携', [{name: '初期化', functionName: 'initialize'}]);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('app.html');
}

function initialize() {
  new SettingSheet().refresh();
  // new DailySheet().refreshSheet();
  // new WorklogSheet().refreshSheet();
  // new TimeLogSheet().refreshSheet();
}
