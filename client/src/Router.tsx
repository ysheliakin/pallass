import { createHashRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { SignUpPage } from './pages/SignUp.page';
import { LoginPage } from './pages/Login.page';
import { LoggedInHomePage } from './pages/LoggedInHome.page';

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
]);

export function Router() {
  return <RouterProvider router={router} />;
}