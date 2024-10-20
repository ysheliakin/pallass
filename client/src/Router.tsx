import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { CreateFunding } from './pages/CreateFunding.page';
import { CreateGroup } from './pages/CreateGroup.page';
import { CreatePostPage } from './pages/CreatePost.page';
import { CreateThread } from './pages/CreateThread';
import { DiscoverThreads } from './pages/DiscoverThreads';
import { HomePage } from './pages/Home.page';
import { HostQASession } from './pages/HostQA.page';
import { JoinGroup } from './pages/JoinGroup.page'; // Import the new component
import { JoinQASession } from './pages/JoinQA.page';
import { LoggedInHomePage } from './pages/LoggedInHome.page';
import { LoginPage } from './pages/Login.page';
import { PostPage } from './pages/Post.page';
import { SignUpPage } from './pages/SignUp.page';
import { ThreadView } from './pages/ThreadView';

const router = createHashRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/post/create',
        element: <CreatePostPage />,
      },
      {
        path: '/post/:id',
        element: <PostPage />,
      },
    ],
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
  // {
  //   path: '/funding-opportunities',
  //   element: <FudningOpportunities />,
  // },
  {
    path: '/funding-opportunities/create',
    element: <CreateFunding />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
