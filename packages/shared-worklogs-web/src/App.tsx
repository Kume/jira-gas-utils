import {Box, Button, Stack} from '@chakra-ui/react';
import React, {useState} from 'react';
import {EndWorklogPage} from './pages/EndWorklogPage';
import {StartWorkPage} from './pages/StartWorkPage';

type PageName = 'startWork' | 'endWork';

export const App: React.FC = () => {
  const [page, setPage] = useState<PageName>();

  switch (page) {
    case 'startWork':
      return <StartWorkPage onBack={() => setPage(undefined)} />;

    case 'endWork':
      return <EndWorklogPage onBack={() => setPage(undefined)} />;

    default:
      return (
        <Box w="md">
          <Stack>
            <Button onClick={() => setPage('startWork')}>業務開始</Button>
            <Button onClick={() => setPage('endWork')}>業務終了</Button>
          </Stack>
        </Box>
      );
  }
};
