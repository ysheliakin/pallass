import '@mantine/core/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dates/styles.css';

import { MantineProvider } from '@mantine/core';
import { AppContextProvider } from './app-context';
import { Router } from './Router';
import { theme } from './theme';

export default function App() {
  return (
    <AppContextProvider>
      <MantineProvider theme={theme}>
        <Router />
      </MantineProvider>
    </AppContextProvider>
  );
}
