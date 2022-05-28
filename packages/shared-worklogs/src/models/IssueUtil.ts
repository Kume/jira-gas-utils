import {ForamttedJiraIsssue} from '../Jira/types';
import {IssueRelation, IssueWithRelation, PlainIssueOnSheet, WorklogOnSheet} from '../libs/types';

export class IssueUtil {
  public static issueToWithRelation(
    issues: readonly ForamttedJiraIsssue[],
    worklogsByIssueKey = new Map<string, WorklogOnSheet[]>(),
    assignedIssueKeys: Set<string>,
  ): IssueWithRelation[] {
    return issues.map((issue): IssueWithRelation => {
      const relatedWorklogs = worklogsByIssueKey.get(issue.key);
      relatedWorklogs?.sort((a, b) => b.startAt.getTime() - a.startAt.getTime());
      const lastWorklog = relatedWorklogs?.[0];
      const relation: IssueRelation = {
        recentlyWorked: lastWorklog ? {at: lastWorklog.startAt.toISOString()} : undefined,
        assigned: assignedIssueKeys.has(issue.key),
      };
      return {...this.formattedToPlain(issue), relation};
    });
  }

  public static formattedToPlain(issue: ForamttedJiraIsssue): PlainIssueOnSheet {
    const base = {
      key: issue.key,
      summary: issue.summary,
      mainAssignee: issue.mainAssignee,
      assigneeEmail: issue.assignee?.emailAddress ?? '',
      updatedAt: issue.updatedAt,
    };
    switch (issue.type) {
      case 'epic':
        return {...base, type: 'epic', epicName: issue.epicName};
      case 'standard':
        return {...base, type: 'standard', epicLink: issue.epicLink};
      case 'subTask':
        return {...base, type: 'subTask', parentKey: issue.parentKey};
    }
  }
}
