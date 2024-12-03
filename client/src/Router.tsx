import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { CreateFunding } from './pages/CreateFunding.page';
import { CreateGroup } from './pages/CreateGroup.page';
import { CreatePostPage } from './pages/CreatePost.page';
import { CreateThread } from './pages/CreateThread';
import { DiscoverThreads } from './pages/DiscoverThreads';
import { ForgotPasswordPage } from './pages/ForgotPassword.page';
import { FundingOpportunities } from './pages/FundingOpportunities.page';
import { HomePage } from './pages/Home.page';
import { JoinGroup } from './pages/JoinGroup.page';
import { LoggedInHomePage } from './pages/LoggedInHome.page';
import { LoginPage } from './pages/Login.page';
import { EditProfilePage } from './pages/EditProfile.page'
import { PostPage } from './pages/Post.page';
import { ResetPasswordPage } from './pages/ResetPassword.page';
import { SignUpPage } from './pages/SignUp.page';
import { ThreadView } from './pages/ThreadView';
import { GroupView } from './pages/GroupView';
import ProtectedRoute from './ProtectedRoute';

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
        element: (
          <ProtectedRoute>
            <CreatePostPage />
          </ProtectedRoute>
        ),
      },
      {
        path: '/post/:id',
        element: (
          <ProtectedRoute>
            <PostPage />
          </ProtectedRoute>
        ),
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
    element: (
      <ProtectedRoute>
        <LoggedInHomePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/edit-profile',
    element: (
      <ProtectedRoute>
        <EditProfilePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-group',
    element: (
      <ProtectedRoute>
        <CreateGroup />
      </ProtectedRoute>
    ),
  },
  {
    path: '/join-group',
    element: (
      <ProtectedRoute>
        <JoinGroup />
      </ProtectedRoute>
    ),
  },
  {
    path: '/create-thread',
    element: (
      <ProtectedRoute>
        <CreateThread />
      </ProtectedRoute>
    ),
  },
  {
    path: '/discover-threads',
    element: (
      <ProtectedRoute>
        <DiscoverThreads />
      </ProtectedRoute>
    ),
  },
  {
    path: '/thread/:threadUuid',
    element: (
      <ProtectedRoute>
        <ThreadView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/group/:groupUuid',
    element: (
      <ProtectedRoute>
        <GroupView />
      </ProtectedRoute>
    ),
  },
  {
    path: '/funding-opportunities',
    element: <FundingOpportunities />,
  },
  {
    path: '/funding-opportunities/create',
    element: (
      <ProtectedRoute>
        <CreateFunding />
      </ProtectedRoute>
    ),
  },
  {
    path: `/forgot-password`,
    element: <ForgotPasswordPage />,
  },
  {
    path: `/reset-password`,
    element: <ResetPasswordPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
