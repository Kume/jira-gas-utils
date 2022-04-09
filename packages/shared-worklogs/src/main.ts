import {getGasJiraGlobal, setGasJiraGlobal} from './GasJiraCommon/GasJiraGlobal';
import {SettingSheet} from './Sheets/SettingSheet';
import {WorklogSheet} from './Sheets/WorklogSheet';
import {SpreadJiraClient} from './SpreadCommon/SpreadJiraClient';

function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('JIRA連携', [
    {name: '初期化', functionName: 'initialize'},
    {name: '開発', functionName: 'dev'},
  ]);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('app.html');
}

function initialize() {
  new SettingSheet().refresh();
  // new DailySheet().refreshSheet();
  new WorklogSheet().refreshSheet();
  // new TimeLogSheet().refreshSheet();
}

function initializeVariables() {
  const settings = new SettingSheet().getSettings();
  if (!settings.jiraHost) {
    throw new Error('設定シートにJIRAホストが未入力です。');
  }
  if (!settings.email) {
    throw new Error('設定シートに電子メールが未入力です。');
  }
  setGasJiraGlobal({jiraHost: settings.jiraHost, email: settings.email});
}

function dev() {
  initializeVariables();
  const worklogSheet = new WorklogSheet();
  const client = new SpreadJiraClient(getGasJiraGlobal());
  worklogSheet.syncJiraToSheet(client);
}
