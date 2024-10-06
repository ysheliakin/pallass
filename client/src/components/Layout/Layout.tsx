import { Outlet } from 'react-router-dom';
import { AppShell, Center } from '@mantine/core';
import { NavBar } from '../NavBar/NavBar';

export function Layout() {
  return (
    <AppShell header={{ height: 50 }} padding="md">
      <AppShell.Header>
        <Center>
          <NavBar />
        </Center>
      </AppShell.Header>

      {/* <AppShell.Navbar p="md"></AppShell.Navbar> */}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
