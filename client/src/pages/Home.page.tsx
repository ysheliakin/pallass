import { ColorSchemeToggle } from '../components/ColorSchemeToggle/ColorSchemeToggle';
import { Welcome } from '../components/Welcome/Welcome';
import Page from '../pages/Page'; // Correct for default export

export function HomePage() {
  return (
    <>
      <Welcome />
      <ColorSchemeToggle />
      <Page />
    </>
  );
}
