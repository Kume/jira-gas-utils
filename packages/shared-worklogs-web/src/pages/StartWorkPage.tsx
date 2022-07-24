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
  Tab,
  Table,
  TableContainer,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react';
import dayjs from 'dayjs';
import React, {useCallback, useMemo} from 'react';
import {useFieldArray, useForm} from 'react-hook-form';
import {useQuery} from 'react-query';
import {fetchJobs, fetchRelatedIssues, postStartWork} from '../api';
import {issueRelationToLabel, LocalStorageKey_WorklogsOnStart, sortIssueByRelation} from '../models';
import {PlainIssueOnSheet, StartWorkFormValue} from '../libs/types';
import {RelatedIssueList} from '../components/RelatedIssueList';
import {SearchIssueView} from '../components/SearchIssueVIew';

interface Props {
  readonly onBack: () => void;
}

type FormValue = StartWorkFormValue;

async function fetchAndSortRelatedIssues() {
  return sortIssueByRelation(await fetchRelatedIssues());
}

export const StartWorkPage: React.FC<Props> = ({onBack}) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<FormValue>({defaultValues: {startTime: dayjs().format('HH:mm')}});
  const {fields, append, remove} = useFieldArray({control, name: 'workItems'});
  const {isLoading: relatedIssuesIsLoading, data: relatedIssues} = useQuery('relatedIssues', fetchAndSortRelatedIssues);
  const {isLoading: jobsIsLoading, data: jobs} = useQuery('jobs', fetchJobs);
  const appendIssue = useCallback((issue: PlainIssueOnSheet) => append({issue}), []);

  const submit = async (formValue: FormValue) => {
    console.log('submit StartWorkPage', formValue);
    try {
      await postStartWork(formValue);
      window.localStorage.setItem(LocalStorageKey_WorklogsOnStart, JSON.stringify(formValue.workItems));
      onBack();
    } catch (error) {
      alert(`エラーが発生しました。[${error?.message}]`);
    }
  };
  const [setStartTimeWithCurrentTime] = useMemo(
    () => [() => setValue('startTime', dayjs().format('HH:mm'))],
    [setValue],
  );

  return (
    <SimpleGrid columns={2} spacing={6} p={6}>
      <form onSubmit={handleSubmit(submit)}>
        <Stack borderWidth="1px" p={6}>
          <Heading as="h3" size="md">
            業務開始報告入力
          </Heading>
          <FormControl isInvalid={!!errors.startTime} isRequired>
            <FormLabel>開始時間</FormLabel>
            <Flex>
              <Input
                id="startTime"
                placeholder="10:00"
                {...register('startTime', {
                  required: '開始時間は必須です。',
                  pattern: {value: /[0-2][0-9]:[0-9][0-9]/, message: 'hh:mm のフォーマットで入力してください。'},
                })}
              />
              <Button marginLeft={6} size="md" paddingLeft={6} paddingRight={6} onClick={setStartTimeWithCurrentTime}>
                現時刻にセット
              </Button>
            </Flex>
            <FormErrorMessage>{errors.startTime?.message}</FormErrorMessage>
          </FormControl>
          <FormControl isInvalid={!!errors.location} isRequired>
            <FormLabel>業務場所</FormLabel>
            <Select {...register('location', {required: true})}>
              <option />
              <option value="home">自宅</option>
              <option value="office">オフィス</option>
            </Select>
            <FormErrorMessage>{errors.location?.message}</FormErrorMessage>
          </FormControl>
          <FormControl>
            <FormLabel>連絡事項</FormLabel>
            <Textarea id="messageForMeeting" {...register('messageForMeeting')} />
          </FormControl>
          <FormControl>
            <FormLabel>業務内容</FormLabel>
            <TableContainer whiteSpace="normal">
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>チケット</Th>
                    <Th>内容</Th>
                    <Th>時間</Th>
                    <Th>削除</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {fields.map((field, index) => {
                    return (
                      <Tr key={field.id}>
                        <Td maxW="150px">
                          <Text noOfLines={3} title={field.issue.summary}>
                            {field.issue.summary}
                          </Text>
                        </Td>
                        <Td>
                          <FormControl>
                            <Textarea size="sm" rows={2} {...register(`workItems.${index}.content`)} />
                          </FormControl>
                        </Td>
                        <Td>
                          <FormControl>
                            <Input width="4rem" size="sm" {...register(`workItems.${index}.time`)} />
                          </FormControl>
                        </Td>
                        <Td>
                          <Button size="sm" bg="red.400" color="white" onClick={() => remove(index)}>
                            削除
                          </Button>
                        </Td>
                      </Tr>
                    );
                  })}
                </Tbody>
              </Table>
            </TableContainer>
          </FormControl>
          <Button bg="blue.500" color="white" type="submit">
            入力完了
          </Button>
        </Stack>
      </form>
      <Tabs borderWidth="1px" p={6}>
        <TabList>
          <Tab>関連チケット</Tab>
          <Tab>チケット検索</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <RelatedIssueList issues={relatedIssues} onAppend={appendIssue} />
          </TabPanel>
          <TabPanel>
            <SearchIssueView onAppend={appendIssue} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </SimpleGrid>
  );
};
