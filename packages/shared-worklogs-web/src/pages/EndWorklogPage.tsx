import {
  Button,
  FormControl,
  Heading,
  Input,
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
import {useFieldArray, useForm} from 'react-hook-form';
import {LocalStorageKey_WorklogsOnStart} from '../models';
import {IssueOnSheet, PlainIssueOnSheet} from '../libs/types';
import {SearchIssueView} from '../components/SearchIssueVIew';

interface FormValue {
  readonly worklogItems: readonly FormWorklogItem[];
}

interface FormWorklogItem {
  readonly issue: PlainIssueOnSheet;
  readonly content: string;
  readonly time: string;
}

interface Props {
  readonly onBack: () => void;
}

export const EndWorklogPage: React.FC<Props> = ({onBack}) => {
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: {errors},
  } = useForm<FormValue>();
  const {fields, append, remove} = useFieldArray({control, name: 'worklogItems'});
  const appendIssue = useCallback((issue: PlainIssueOnSheet) => append({issue}), []);

  useEffect(() => {
    const worklogsString = window.localStorage.getItem(LocalStorageKey_WorklogsOnStart);
    const worklogs = JSON.parse(worklogsString ?? '');
    if (Array.isArray(worklogs)) {
      setValue('worklogItems', worklogs);
    }
  }, []);

  const submit = async (formValue: FormValue) => {
    console.log('submit EndWorklogPage', formValue);
    onBack();
  };
  return (
    <Stack borderWidth="1px" p={6}>
      <Heading as="h3" size="md">
        業務終了報告入力
      </Heading>
      <Tabs>
        <TabList>
          <Tab>入力フォーム</Tab>
          <Tab>チケット検索</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <form onSubmit={handleSubmit(submit)}>
              <Stack>
                <FormControl>
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
                                  <Textarea size="sm" rows={2} {...register(`worklogItems.${index}.content`)} />
                                </FormControl>
                              </Td>
                              <Td>
                                <FormControl>
                                  <Input width="4rem" size="sm" {...register(`worklogItems.${index}.time`)} />
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
            <SearchIssueView onAppend={appendIssue} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Stack>
  );
};
