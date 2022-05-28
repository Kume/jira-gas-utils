import React, {useState} from 'react';
import {Button, Flex, Input, Stack, Table, TableContainer, Tbody, Td, Text, Th, Thead, Tr} from '@chakra-ui/react';
import {PlainIssueOnSheet} from '../libs/types';
import {useForm} from 'react-hook-form';
import {searchIssues} from '../api';

interface Props {
  onAppend(issue: PlainIssueOnSheet): void;
}

interface FormValue {
  readonly searchWord: string;
}

export const SearchIssueView: React.FC<Props> = ({onAppend}) => {
  const [issues, setIssues] = useState<readonly PlainIssueOnSheet[]>([]);
  const {register, handleSubmit} = useForm<FormValue>();
  const search = async (formValue: FormValue) => {
    setIssues(await searchIssues(formValue.searchWord));
  };

  return (
    <Stack>
      <form onSubmit={handleSubmit(search)}>
        <Flex>
          <Input {...register('searchWord')} />
          <Button type="submit" marginLeft={6} size="md" paddingLeft={6} paddingRight={6}>
            検索
          </Button>
        </Flex>
      </form>
      <TableContainer whiteSpace="normal">
        <Table size="sm">
          <Thead>
            <Tr>
              <Th>タイトル</Th>
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
    </Stack>
  );
};
