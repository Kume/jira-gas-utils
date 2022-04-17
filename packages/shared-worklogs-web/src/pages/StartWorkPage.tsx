import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  SimpleGrid,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Textarea,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import React from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import {fetchRelatedIssues} from '../api';
import {IssueOnSheet} from '../types';

interface FormValue {
  readonly startTime: string;
  readonly location: 'office' | 'home';
  readonly messageForMeeting: string;
  readonly workItems: readonly WorkItem[];
}

interface WorkItem {
  readonly issue: IssueOnSheet;
  readonly content: string;
  readonly minute: number;
}

interface Props {}

export const StartWorkPage: React.FC<Props> = () => {
  const {
    register,
    control,
    formState: {errors},
  } = useForm<FormValue>();
  const {fields, append} = useFieldArray({control, name: 'workItems'});
  const {isLoading, data: relatedIssues} = useQuery('relatedIssues', fetchRelatedIssues);
  console.log('xxxx', {isLoading, relatedIssues});

  return (
    <SimpleGrid columns={2} spacing={6} p={6}>
      <Stack borderWidth="1px" p={6}>
        <Heading as="h3" size="md">
          業務開始報告入力
        </Heading>
        <FormControl isInvalid={!!errors.startTime}>
          <FormLabel>開始時間</FormLabel>
          <Flex>
            <Input
              id="startTime"
              placeholder="10:00"
              {...register('startTime', {
                required: true,
                pattern: /[0-2][0-9]:[0-9][0-9]/,
              })}
            />
            <Button marginLeft={6} size="md" paddingLeft={6} paddingRight={6}>
              現時刻にセット
            </Button>
          </Flex>
          <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
        </FormControl>
        <FormControl>
          <FormLabel>業務場所</FormLabel>
          <Select>
            <option />
            <option value="home">自宅</option>
            <option value="office">オフィス</option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>連絡事項</FormLabel>
          <Textarea id="messageForMeeting" {...register('messageForMeeting')} />
        </FormControl>
        <FormControl>
          <FormLabel>業務内容</FormLabel>
          <TableContainer>
            <Table size="sm">
              <Thead>
                <Tr>
                  <Th>チケット</Th>
                  <Th>内容</Th>
                  <Th>時間</Th>
                </Tr>
              </Thead>
              <Tbody>
                {fields.map((field) => {
                  return (
                    <Tr>
                      <Td>{field.issue.summary}</Td>
                      <Td>
                        <FormControl>
                          <Input size="sm" />
                        </FormControl>
                      </Td>
                      <Td>
                        <FormControl>
                          <Input width="4rem" size="sm" />
                        </FormControl>
                      </Td>
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>
          </TableContainer>
        </FormControl>
      </Stack>
      <Stack borderWidth="1px" p={6}>
        <Heading as="h3" size="md">
          チケット一覧
        </Heading>
        <TableContainer>
          <Table size="sm">
            <Thead>
              <Tr>
                <Th>タイトル</Th>
                <Th>関連</Th>
                <Th>追加</Th>
              </Tr>
            </Thead>
            <Tbody>
              {relatedIssues?.map((issue) => (
                <Tr>
                  <Td>{issue.summary}</Td>
                  <Td></Td>
                  <Td>
                    <Button size="sm" onClick={() => append({issue})}>
                      追加
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </SimpleGrid>
  );
};
