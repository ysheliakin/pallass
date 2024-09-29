import { createHashRouter, RouterProvider } from 'react-router-dom';
import { HomePage } from './pages/Home.page';
import { SignupPage } from './pages/Signup.page';
import { LoginPage } from './pages/Login.page';
import { LoggedInPage } from './pages/LoggedIn.page';

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/signup',
    element: <SignupPage />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/loggedInHomepage',
    element: <LoggedInPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}
