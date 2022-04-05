import {
  JiraWorklogResult,
  JiraIssueSearchResult,
  JiraIssue,
  JiraField,
  JiraWorklogList,
  JiraWorklog,
  JiraWorklogCreateRequest,
  JiraApiErrorResponse,
} from './types';

export interface JiraFetcherProps {
  // readonly host: string;
  readonly log: (text: string) => void;
  // readonly getToken: () => string;
  // readonly getEmail: () => string;
  readonly fetch: (path: string) => unknown;
  readonly post: (path: string, data: unknown) => unknown;
}

export function encodeQueryParameter(query: {[key: string]: string | number | undefined} | undefined): string {
  let queryString = '';
  if (query && Object.keys(query).length) {
    queryString += '?';
    for (const key of Object.keys(query)) {
      const queryValue = query[key];
      if (queryValue !== undefined) {
        queryString += `${key}=${encodeURIComponent(queryValue)}&`;
      }
    }
  }
  return queryString;
}

export interface AuthorizationTokenForJiraFetcherParams {
  readonly token: string;
  readonly email: string;
  readonly base64Encode: (source: string) => string;
}

export function authorizationTokenForJiraFetcher(params: AuthorizationTokenForJiraFetcherParams): string {
  const basicToken = `${params.email}:${params.token}`;
  return `Basic ${params.base64Encode(basicToken)}`;
}

type PromiseResult<IsPromise, T> = IsPromise extends true ? Promise<T> : T;

export class JiraFetcher<IsPromise = false> {
  private props: JiraFetcherProps;
  public constructor(props: JiraFetcherProps) {
    this.props = props;
  }

  public fetch(path: string, {query}: {query?: {[key: string]: string | number | undefined}} = {}): unknown {
    const queryString = encodeQueryParameter(query);
    const fullPath = `/rest/api/3/${path}${queryString}`;
    this.props.log('jira access ' + fullPath);
    return this.props.fetch(fullPath);
  }

  public post(path: string, {body}: {body?: unknown} = {}): unknown {
    const fullPath = `/rest/api/3/${path}`;
    this.props.log('jira access [POST] ' + fullPath);
    return this.props.post(fullPath, body);
  }

  public getFields(): PromiseResult<IsPromise, JiraField[]> {
    return this.fetch('field') as any;
  }

  public searchIssues(query: string): PromiseResult<IsPromise, JiraIssueSearchResult> {
    return this.fetch('search', {query: {jql: query, maxResults: '100'}}) as any;
  }

  public getIssue(id: string): PromiseResult<IsPromise, JiraIssue> {
    return this.fetch('issue/' + id) as any;
  }

  public getWorklogOfIssue(issueId: string): PromiseResult<IsPromise, JiraWorklogResult> {
    return this.fetch(`issue/${issueId}/worklog`) as any;
  }

  public getWorklogList(params: {since?: number; expand?: string} = {}): PromiseResult<IsPromise, JiraWorklogList> {
    return this.fetch(`worklog/updated`, {query: params}) as any;
  }

  public getWorklogs(worklogIds: readonly number[]): PromiseResult<IsPromise, JiraWorklog[]> {
    return this.post(`worklog/list`, {body: {ids: worklogIds}}) as any;
  }

  public postWorklog(
    issueIdOeKey: string,
    worklog: JiraWorklogCreateRequest,
  ): PromiseResult<IsPromise, JiraWorklog | JiraApiErrorResponse> {
    return this.post(`issue/${issueIdOeKey}/worklog`, {body: worklog}) as any;
  }
}
