import { createHashRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { SignUpPage } from './pages/SignUp.page';
import { LoginPage } from './pages/Login.page';
import { LoggedInHomePage } from './pages/LoggedInHome.page';
import { HostQASession } from './pages/HostQA.page';
import { JoinQASession } from './pages/JoinQA.page';
import { CreateGroup } from './pages/CreateGroup.page';
import { JoinGroup } from './pages/JoinGroup.page'; // Import the new component
import { CreateThread } from './pages/CreateThread';
import { DiscoverThreads } from './pages/DiscoverThreads';
import { ThreadView } from './pages/ThreadView';

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/signup',
    element: <SignUpPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <LoggedInHomePage />,
  },
  {
    path: '/host-qa',
    element: <HostQASession />,
  },
  {
    path: '/join-qa',
    element: <JoinQASession />,
  },
  {
    path: '/create-group', // Add this new route
    element: <CreateGroup />,
  },
  {
    path: '/join-group',
    element: <JoinGroup />,
  },
  {
    path: '/create-thread',
    element: <CreateThread />,
  },
  {
    path: '/discover-threads',
    element: <DiscoverThreads />,
  },
  {
    path: '/thread/:threadId',
    element: <ThreadView />,
  },

]);

export function Router() {
  return <RouterProvider router={router} />;
}