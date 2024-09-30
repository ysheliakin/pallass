import { Outlet } from 'react-router-dom';
import { AppShell, Burger } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavBar } from '../NavBar/NavBar';

export function Layout() {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <NavBar />
        {/* <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" /> */}
        {/* <div>Logo</div> */}
      </AppShell.Header>

      {/* <AppShell.Navbar p="md"></AppShell.Navbar> */}

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
