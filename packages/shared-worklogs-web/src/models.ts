import dayjs from 'dayjs';
import {IssueRelation, IssueWithRelation} from './libs/types';

export function sortIssueByRelation(issues: readonly IssueWithRelation[]): IssueWithRelation[] {
  const clone = [...issues];
  clone.sort((a, b) => {
    // bookmarkが最優先
    if (a.relation.bookmark) {
      if (!b.relation.bookmark) {
        return -1;
      }
      return 0;
    }
    if (b.relation.bookmark) {
      return 1;
    }

    // assignedが次の優先
    if (a.relation.assigned) {
      if (!b.relation.assigned) {
        return -1;
      }
      return 0;
    }
    if (b.relation.assigned) {
      return 1;
    }

    // recentlyWorkedは作業日降順にソート
    if (!a.relation.recentlyWorked) {
      return 1;
    }
    if (!b.relation.recentlyWorked) {
      return -1;
    }
    const aWorkedAt = dayjs(a.relation.recentlyWorked.at).toDate();
    const bWorkedAt = dayjs(b.relation.recentlyWorked.at).toDate();
    if (aWorkedAt > bWorkedAt) {
      return -1;
    } else if (aWorkedAt < bWorkedAt) {
      return 1;
    }
    return 0;
  });
  return clone;
}

export function issueRelationToLabel(relation: IssueRelation): string {
  const labels: string[] = [];

  if (relation.bookmark) {
    labels.push('☆');
  }

  if (relation.assigned) {
    labels.push('担当');
  }

  if (relation.recentlyWorked) {
    labels.push(`最近作業(${dayjs(relation.recentlyWorked.at).format('MM/DD')})`);
  }

  return labels.join(', ');
}

export const LocalStorageKey_WorklogsOnStart = 'worklogsOnStart';
