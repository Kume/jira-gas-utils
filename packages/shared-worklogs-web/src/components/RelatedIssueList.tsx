import React from 'react';
import {Button, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr} from '@chakra-ui/react';
import {IssueWithRelation} from '../libs/types';
import {issueRelationToLabel} from '../models';

interface Props {
  readonly issues: readonly IssueWithRelation[] | undefined;
  onAppend(issue: IssueWithRelation): void;
}

export const RelatedIssueList: React.FC<Props> = ({issues, onAppend}) => {
  return (
    <TableContainer whiteSpace="normal">
      <Table size="sm">
        <Thead>
          <Tr>
            <Th>タイトル</Th>
            <Th>関連</Th>
            <Th>詳細</Th>
            <Th>追加</Th>
          </Tr>
        </Thead>
        <Tbody>
          {issues?.map((issue) => (
            <Tr key={issue.key}>
              <Td>
                <Text noOfLines={2} title={issue.summary}>
                  {issue.summary}
                </Text>
              </Td>
              <Td>{issueRelationToLabel(issue.relation)}</Td>
              <Td>
                <Button size="sm" onClick={() => append({issue})}>
                  詳細
                </Button>
              </Td>
              <Td>
                <Button size="sm" bg="blue.400" color="white" onClick={() => onAppend(issue)}>
                  追加
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
};
