import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
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
import React, {useCallback, useEffect, useMemo} from 'react';
import {Controller, useFieldArray, useForm} from 'react-hook-form';
import {LocalStorageKey_WorklogsOnStart, sortIssueByRelation} from '../models';
import {EndWorkFormValue, IssueOnSheet, PlainIssueOnSheet} from '../libs/types';
import {SearchIssueView} from '../components/SearchIssueVIew';
import {useQuery} from 'react-query';
import {fetchJobMasters, fetchRelatedIssues, postEndWork} from '../api';
import {RelatedIssueList} from '../components/RelatedIssueList';

interface Props {
  readonly onBack: () => void;
}

async function fetchAndSortRelatedIssues() {
  return sortIssueByRelation(await fetchRelatedIssues());
}

export const EndWorklogPage: React.FC<Props> = ({onBack}) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: {errors},
  } = useForm<EndWorkFormValue>();
  const {fields, append, remove} = useFieldArray({control, name: 'worklogItems'});
  const {isLoading: relatedIssuesIsLoading, data: relatedIssues} = useQuery('relatedIssues', fetchAndSortRelatedIssues);
  const {isLoading: jobsIsLoading, data: jobMasters} = useQuery('jobMasters', fetchJobMasters);
  const jobOptions = useMemo(() => {
    if (!jobMasters) {
      return [];
    }
    const accountTypeMap = new Map(jobMasters.accountTypes.map(({id, label_l3}) => [id, label_l3]));
    return jobMasters.jobs.flatMap((job) => {
      return job.accountTypes.map((accountTypeId) => {
        return {label: `${job.label} / ${accountTypeMap.get(accountTypeId)}`, value: `${job.id}@${accountTypeId}`};
      });
    });
  }, [jobMasters]);
  const appendIssue = useCallback((issue: PlainIssueOnSheet) => append({issue}), []);

  useEffect(() => {
    const worklogsString = window.localStorage.getItem(LocalStorageKey_WorklogsOnStart);
    const worklogs = JSON.parse(worklogsString ?? '');
    if (Array.isArray(worklogs)) {
      setValue('worklogItems', worklogs);
    }
  }, []);

  const submit = async (formValue: EndWorkFormValue) => {
    console.log('submit EndWorklogPage', formValue);
    try {
      await postEndWork(formValue);
      window.localStorage.setItem(LocalStorageKey_WorklogsOnStart, JSON.stringify([]));
      onBack();
    } catch (error) {
      alert(`エラーが発生しました。[${error?.message}]`);
    }
  };
  return (
    <Stack borderWidth="1px" p={6}>
      <Heading as="h3" size="md">
        業務終了報告入力
      </Heading>
      <Tabs>
        <TabList>
          <Tab>入力フォーム</Tab>
          <Tab>関連チケット</Tab>
          <Tab>チケット検索</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <form onSubmit={handleSubmit(submit)}>
              <Stack>
                <FormControl>
                  <FormLabel>連絡事項</FormLabel>
                  <Textarea id="message" {...register('message')} />
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
                          <Th>ジョブ / 内訳</Th>
                          <Th>削除</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {fields.map((field, index) => {
                          const onSelectJob = (e: React.ChangeEvent<HTMLSelectElement>) => {
                            const match = e.target.value.match(/^(.+)@(.+)$/);
                            if (match) {
                              setValue(`worklogItems.${index}.job`, match[1]);
                              setValue(`worklogItems.${index}.accountType`, match[2]);
                            }
                          };
                          return (
                            <Tr key={field.id}>
                              <Td maxW="150px">
                                <Text noOfLines={3} title={field.issue.summary}>
                                  {field.issue.summary}
                                </Text>
                              </Td>
                              <Td>
                                <FormControl>
                                  <Textarea size="sm" rows={2} {...register(`worklogItems.${index}.content`)} />
                                </FormControl>
                              </Td>
                              <Td>
                                <FormControl>
                                  <Input width="4rem" size="sm" {...register(`worklogItems.${index}.time`)} />
                                </FormControl>
                              </Td>
                              <Td>
                                <FormControl>
                                  <Controller
                                    control={control}
                                    name={`worklogItems.${index}`}
                                    render={({
                                      field: {
                                        value: {job, accountType},
                                      },
                                    }) => (
                                      <Select
                                        value={job && accountType && `${job}@${accountType}`}
                                        onChange={onSelectJob}>
                                        {jobOptions.map((job) => (
                                          <option value={job.value}>{job.label}</option>
                                        ))}
                                      </Select>
                                    )}
                                  />
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
          </TabPanel>
          <TabPanel>
            <RelatedIssueList issues={relatedIssues} onAppend={appendIssue} />
          </TabPanel>
          <TabPanel>
            <SearchIssueView onAppend={appendIssue} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
