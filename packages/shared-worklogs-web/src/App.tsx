import {Box, Button, Stack} from '@chakra-ui/react';
import React, {useState} from 'react';
import {fetchAccountTypes, fetchJobs} from './api';
import {StartWorkPage} from './pages/StartWorkPage';

async function dev() {
  try {
    const jobs = await fetchJobs();
    console.log('xxxx jobs', jobs);
    const accountTypes = await fetchAccountTypes();
    console.log('xxxx accountTypes', accountTypes);
  } catch (error) {
    console.error(error);
    alert(error);
  }
}

function load() {
  console.log('xxxx', window.localStorage.getItem('__testCount'));
}

type PageName = 'startWork';

export const App: React.FC = () => {
  const [count, setCount] = useState<number>(0);
  const [page, setPage] = useState<PageName>();
  const save = () => {
    window.localStorage.setItem('__testCount', `${count}`);
  };

  switch (page) {
    case 'startWork':
      return <StartWorkPage />;

    default:
      return (
        <Box w="md">
          <Stack>
            Hello World {count}
            <Button onClick={() => setPage('startWork')}>業務開始</Button>
            <button onClick={() => setCount(count + 1)}>Add</button>
            <button onClick={dev}>開発</button>
            <button onClick={save}>保存</button>
            <button onClick={load}>読み出し</button>
          </Stack>
        </Box>
      );
  }
};
