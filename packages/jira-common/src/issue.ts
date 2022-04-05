import {ForamttedJiraIsssue, FormattedJiraIssueBase, JiraField, JiraIssue, JiraIssueType} from './types';

const EPIC_ISSUE_TYPE_ID = '10000';

export class JiraIssueFormatter {
  private fieldMap: Map<string, JiraField>;
  private fieldMapByUntranslatedName: Map<string, JiraField>;
  private fieldMapByName: Map<string, JiraField>;
  private epicNameKey: string;
  private epicLinkKey: string;
  private mainAsigneeKey: string;

  public constructor(fields: JiraField[]) {
    this.fieldMap = new Map(fields.map((field) => [field.key, field]));
    this.fieldMapByUntranslatedName = new Map(
      fields.filter(({untranslatedName}) => !!untranslatedName).map((field) => [field.untranslatedName || '', field]),
    );
    this.fieldMapByName = new Map(fields.filter(({name}) => !!name).map((field) => [field.name || '', field]));
    this.epicNameKey = this.getFieldByUntranslatedNameOrFail('Epic Name').key;
    this.epicLinkKey = this.getFieldByUntranslatedNameOrFail('Epic Link').key;
    this.mainAsigneeKey = this.getFieldByNameOrFail('実装担当者').key;
  }

  private getFieldByUntranslatedNameOrFail(name: string): JiraField {
    const field = this.fieldMapByUntranslatedName.get(name);
    if (!field) {
      throw new Error(`Cannot found field untranslatedName=${name}`);
    }
    return field;
  }

  private getFieldByNameOrFail(name: string): JiraField {
    const field = this.fieldMapByUntranslatedName.get(name);
    if (!field) {
      throw new Error(`Cannot found field untranslatedName=${name}`);
    }
    return field;
  }

  public format(issue: JiraIssue): ForamttedJiraIsssue {
    const base: FormattedJiraIssueBase = {
      id: issue.id,
      key: issue.key,
      self: issue.self,
      summary: issue.fields['summary'] as string,
      assignee: issue.fields['assignee'] as any,
      mainAssignee: issue.fields[this.mainAsigneeKey] as string,
    };

    if (this.isEpic(issue)) {
      return {
        ...base,
        type: 'epic',
        epicName: issue.fields[this.epicNameKey] as string,
      };
    } else if (this.isSubTask(issue)) {
      return {
        ...base,
        type: 'subTask',
        parentKey: this.getParentIssueKey(issue),
      };
    } else {
      return {
        ...base,
        type: 'standard',
        epicLink: issue.fields[this.epicLinkKey] as string,
      };
    }
  }

  private isEpic(issue: JiraIssue): boolean {
    const issueType = issue.fields['issuetype'] as JiraIssueType;
    return issueType.id === EPIC_ISSUE_TYPE_ID;
  }

  private isSubTask(issue: JiraIssue): boolean {
    const issueType = issue.fields['issuetype'] as JiraIssueType;
    return issueType.subtask;
  }

  private getParentIssueKey(issue: JiraIssue): string {
    const parent = issue.fields['parent'] as JiraIssue | undefined;
    if (!parent || typeof parent.key !== 'string') {
      throw new Error('unexpected subtask format');
    }
    return parent.key;
  }
}
