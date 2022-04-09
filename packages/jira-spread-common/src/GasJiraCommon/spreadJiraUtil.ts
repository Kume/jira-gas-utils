import {ForamttedJiraIsssue} from '../Jira/types';
import {getGasJiraGlobal} from './GasJiraGlobal';

export function jiraIssueLinkSpreadCell(issue: ForamttedJiraIsssue): string {
  return jiraIssueLinkSpreadCellForKey(issue.key);
}

export function jiraIssueLinkSpreadCellForKey(key: string): string {
  return `=HYPERLINK("${getGasJiraGlobal().jiraHost}browse/${key}","${key}")`;
}

export function timeSecondsToHour(timeSecound: number): number {
  return Math.floor((timeSecound / 60 / 60) * 100) / 100;
}

export function timeSecoundsToMinute(timeSecound: number): number {
  return Math.floor(timeSecound / 60);
}

export function compareBy<T>(getProperty: (value: T) => number | string | Date): (a: T, b: T) => number {
  return (a, b) => {
    if (getProperty(a) < getProperty(b)) {
      return 1;
    }
    if (getProperty(a) > getProperty(b)) {
      return -1;
    }
    return 0;
  };
}
