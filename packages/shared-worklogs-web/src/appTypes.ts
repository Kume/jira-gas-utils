import {IssueOnSheet, IssueRelation} from './types';

export type IssueWithRelation = IssueOnSheet & {relation: IssueRelation};
