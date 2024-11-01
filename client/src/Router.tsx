import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { CreateGroup } from './pages/CreateGroup.page';
import { CreatePostPage } from './pages/CreatePost.page';
import { CreateThread } from './pages/CreateThread';
import { DiscoverThreads } from './pages/DiscoverThreads';
import { HomePage } from './pages/Home.page';
import { HostQASession } from './pages/HostQA.page';
import { JoinGroup } from './pages/JoinGroup.page';
import { JoinQASession } from './pages/JoinQA.page';
import { LoggedInHomePage } from './pages/LoggedInHome.page';
import { LoginPage } from './pages/Login.page';
import { PostPage } from './pages/Post.page';
import { SignUpPage } from './pages/SignUp.page';
import { ThreadView } from './pages/ThreadView';
import { SettingsPage } from './pages/Settings.page';
import { UserProfilePage } from './pages/UserProfile.page';
// Add new imports for online session related pages
import OnlineSession from './pages/OnlineSession.page';
// import { CreateSession } from './pages/CreateSession.page';
// import { JoinSession } from './pages/JoinSession.page';

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
        path: '/dashboard',
        element: <LoggedInHomePage />,
      },
      {
        path: '/post/create',
        element: <CreatePostPage />,
      },
      {
        path: '/post/:id',
        element: <PostPage />,
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
        path: '/create-group',
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
      {
        path: '/settings',
        element: <SettingsPage />,
      },
      {
        path: '/user-profile',
        element: <UserProfilePage />,
      },
      // Add new routes for online sessions
      {
        path: '/online-sessions',
        element: <OnlineSession />,
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
]);

export function Router() {
  return <RouterProvider router={router} />;
}