import {getGasJiraGlobal, setGasJiraGlobal} from './GasJiraCommon/GasJiraGlobal';
import {AccountTypeSheet} from './Sheets/AccountTypeSheet';
import {JobsSheet} from './Sheets/JobsSheet';
import {SettingSheet} from './Sheets/SettingSheet';
import {IssueWithRelation, PlainIssueOnSheet, SettingsForFrontend, StartWorkParams, WorklogOnSheet} from './libs/types';
import {WorklogSheet} from './Sheets/WorklogSheet';
import {SpreadJiraClient} from './SpreadCommon/SpreadJiraClient';
import {EMail} from './models/EMail';
import {IssueUtil} from './models/IssueUtil';

function onOpen() {
  SpreadsheetApp.getActiveSpreadsheet().addMenu('管理者操作', [
    {name: '初期化', functionName: 'initialize'},
    {name: 'シート更新', functionName: 'reloadSheets'},
    {name: '開発', functionName: 'dev'},
  ]);
  SpreadsheetApp.getActiveSpreadsheet().addMenu('ユーザー操作', [
    // fetcher.tsのrefreshJiraTokenを呼び出す
    {name: 'JIRAトークン更新', functionName: 'refreshJiraToken'},
  ]);
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
  const assignedIssues = client.fetchMyIssues('久米');
  const assignedIssueKeys = new Set(assignedIssues.map(({key}) => key));
  const issueKeysForFetch = new Set<string>();
  const worklogsByIssueKey = new Map<string, WorklogOnSheet[]>();
  for (const recentWorklog of worklogs) {
    if (!assignedIssueKeys.has(recentWorklog.issueKey)) {
      let worklogs = worklogsByIssueKey.get(recentWorklog.issueKey);
      if (!worklogs) {
        worklogs = [];
        worklogsByIssueKey.set(recentWorklog.issueKey, worklogs);
      }
      worklogs.push(recentWorklog);
      issueKeysForFetch.add(recentWorklog.issueKey);
    }
  }
  const additionalIssues = client.fetchIssuesByIds(Array.from(issueKeysForFetch));
  return IssueUtil.issueToWithRelation([...assignedIssues, ...additionalIssues], worklogsByIssueKey, assignedIssueKeys);
}

function startWork(params: StartWorkParams): void {
  initializeVariables();
  const settings = new SettingSheet().getSettings();
  EMail.createStartWorkDraft(settings, params);
}

function searchIssues(searchWord: string): readonly PlainIssueOnSheet[] {
  initializeVariables();
  const settings = new SettingSheet().getSettings();
  const client = new SpreadJiraClient(getGasJiraGlobal());
  return client
    .searchIssues(SettingSheet.myProject(settings), searchWord)
    .map((formatted) => IssueUtil.formattedToPlain(formatted));
}

function getSettings(): SettingsForFrontend {
  initializeVariables();
  const settings = new SettingSheet().getSettings();
  return {
    selfName: SettingSheet.selfName(settings),
    startEmailSubjectTemplate: settings.startEmailSubjectTemplate,
    startEmailContentTemplate: settings.startEmailContentTemplate,
    endEmailSubjectTemplate: settings.endEmailSubjectTemplate,
    endEmailContentTemplate: settings.endEmailContentTemplate,
  };
}
