import {createFetcher} from '../GasJiraCommon/fetcher';
import {JiraFetcher} from '../Jira/api';
import {JiraIssueFormatter} from '../Jira/issue';
import {ForamttedJiraIsssue, JiraField, JiraWorklog, JiraWorklogCreateRequest} from '../Jira/types';

export interface SpreadJiraClientSettings {
  readonly jiraHost: string;
}

export class SpreadJiraClient {
  private fetcher: JiraFetcher;
  private email: string;

  public constructor(private settings: SpreadJiraClientSettings) {
    // googleアカウントのメールアドレス = Jiraに登録してあるメールアドレスである前提
    this.email = Session.getActiveUser().getEmail();
    this.fetcher = createFetcher({host: settings.jiraHost, email: this.email});
  }

  private _fields?: JiraField[];
  private get fields(): JiraField[] {
    if (!this._fields) {
      this._fields = this.fetcher.getFields();
    }
    return this._fields;
  }

  public fetchMyWorklogs(
    since: number | undefined,
  ): readonly (readonly [JiraWorklog, ForamttedJiraIsssue | undefined])[] {
    const worklogList = this.fetcher.getWorklogList({since});
    const worklogs = this.fetcher
      .getWorklogs(worklogList.values.map(({worklogId}) => worklogId))
      .filter(({author}) => author.emailAddress === this.email);
    const issueIds = new Set<string>(worklogs.map(({issueId}) => issueId));
    const issues = this.fetchIssuesByIds(Array.from(issueIds));
    const issuesById: Map<string, ForamttedJiraIsssue> = new Map(issues.map((issue) => [issue.id, issue] as const));
    return worklogs.map((worklog) => [worklog, issuesById.get(worklog.issueId)]);
  }

  public fetchIssuesByIds(ids: readonly string[]): readonly ForamttedJiraIsssue[] {
    const issues =
      ids.length === 0 ? undefined : this.fetcher.searchIssues(`id in (${Array.from(ids.values()).join(',')})`);
    const formatter = new JiraIssueFormatter(this.fields);
    return issues ? issues.issues.map((issue) => formatter.format(issue)) : [];
  }

  public fetchMyIssues(developerName: string | undefined): readonly ForamttedJiraIsssue[] {
    const developerCondition = developerName ? ` OR "担当者(実装)[Labels]" = ${developerName}` : '';
    const issues = this.fetcher.searchIssues(
      `resolution = Unresolved AND (assignee in (currentUser())${developerCondition})`,
    );
    const formatter = new JiraIssueFormatter(this.fields);
    return issues.issues.map((issue) => formatter.format(issue));
  }

  public postWorklog(issueKeyOrId: string, worklog: JiraWorklogCreateRequest): JiraWorklog {
    const result = this.fetcher.postWorklog(issueKeyOrId, worklog);
    if ('errors' in result) {
      Logger.log(result);
      throw new Error(result.errorMessages.join('\n'));
    }
    return result;
  }
}
