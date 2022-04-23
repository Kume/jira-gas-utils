import {getGasJiraGlobal, setGasJiraGlobal} from './GasJiraCommon/GasJiraGlobal';
import {AccountTypeSheet} from './Sheets/AccountTypeSheet';
import {JobsSheet} from './Sheets/JobsSheet';
import {SettingSheet} from './Sheets/SettingSheet';
import { IssueOnSheet, IssueRelation, IssueWithRelation } from './Sheets/types';
import {WorklogSheet} from './Sheets/WorklogSheet';
import {SpreadJiraClient} from './SpreadCommon/SpreadJiraClient';

function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('管理者操作', [
    {name: '初期化', functionName: 'initialize'},
    {name: 'シート更新', functionName: 'reloadSheets'}
    {name: '開発', functionName: 'dev'},
  ]);
  SpreadsheetApp.getActiveSpreadsheet().addMenu('ユーザー操作', []);
}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('app.html');
}

function initialize() {
  new SettingSheet().refresh();
  // new DailySheet().refreshSheet();
  new WorklogSheet().refreshSheet();
  new JobsSheet().refreshSheet();
  new AccountTypeSheet().refreshSheet();
  initializeVariables();
}

function reloadSheets() {
  new SettingSheet().refresh();
  initializeVariables();
}

function initializeVariables() {
  const settings = new SettingSheet().getSettings();
  if (!settings.jiraHost) {
    throw new Error('設定シートにJIRAホストが未入力です。');
  }
  setGasJiraGlobal({jiraHost: settings.jiraHost});
}

function dev() {
  initializeVariables();
  const worklogSheet = new WorklogSheet();
  const client = new SpreadJiraClient(getGasJiraGlobal());
  worklogSheet.syncJiraToSheet(client);
}

function loadJobs() {
  initializeVariables();
  return new JobsSheet().readJobs();
}

function loadAccountTypes() {
  initializeVariables();
  return new AccountTypeSheet().readAccountTypes();
}

function loadRelatedIssues(): IssueWithRelation[] {
  initializeVariables();
  const client = new SpreadJiraClient(getGasJiraGlobal());
  const worklogSheet = new WorklogSheet();
  const worklogs = worklogSheet.readWorklogs();
  const assignedIssues = client.fetchMyIssues('xx');
  const assignedIssueKeys = new Set(assignedIssues.map(({key}) => key));
  const issueKeysForFetch = new Set<string>();
  for (const recentWorklog of worklogs) {
    if (!assignedIssueKeys.has(recentWorklog.issueKey)) {
      issueKeysForFetch.add(recentWorklog.issueKey);
    }
  }
  const additionalIssues = client.fetchIssuesByIds(Array.from(issueKeysForFetch));
  const issues = [...assignedIssues, ...additionalIssues].map((issue): IssueWithRelation => {
    return {
      key: issue.key,
      summary: issue.summary,
      mainAssignee: issue.mainAssignee,
    }
  })
  // TODO
}
