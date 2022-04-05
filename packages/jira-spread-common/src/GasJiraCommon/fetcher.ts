import {JiraFetcher} from '../Jira/api';
import {getOrInputUserProperty, refreshUserProperty} from '../SpreadCommon/spreadUtils';

const jiraTokenKey = 'JIRA_TOKEN';

export function getOrInputJiraToken(): string {
  return getOrInputUserProperty('JIRAアクセストークン', jiraTokenKey);
}

export function refreshJiraToken(): void {
  refreshUserProperty('JIRAアクセストークン', jiraTokenKey);
}

export interface FetcherParams {
  host: string;
  email: string;
}

function createHeader(params: FetcherParams) {
  const basicToken = `${params.email}:${getOrInputJiraToken()}`;
  return {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    Authorization: `Basic ${Utilities.base64Encode(basicToken)}`,
  };
}

export function createFetcher(params: FetcherParams): JiraFetcher {
  const headers = createHeader(params);
  return new JiraFetcher({
    log: (text) => Logger.log(text),
    fetch: (path) => {
      Logger.log('url = ' + `${params.host}${path}`);
      const response = UrlFetchApp.fetch(`${params.host}${path}`, {headers});
      return JSON.parse(response.getContentText('UTF-8'));
    },
    post: (path, body) => {
      const response = UrlFetchApp.fetch(`${params.host}${path}`, {
        headers,
        method: 'post',
        payload: JSON.stringify(body),
        muteHttpExceptions: true,
      });
      return JSON.parse(response.getContentText('UTF-8'));
    },
  });
}
