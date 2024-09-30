import { createHashRouter, RouterProvider } from 'react-router-dom';
import { Layout } from './components/Layout/Layout';
import { CreatePostPage } from './pages/CreatePost.page';
import { HomePage } from './pages/Home.page';
import { PostPage } from './pages/Post.page';

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
]);

export function Router() {
  return <RouterProvider router={router} />;
}
