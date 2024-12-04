import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from '@mantine/core';
import { getUser } from './api/user';
import { useAppContext } from './app-context';
import { Layout } from './components/layout';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, setUser } = useAppContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const findUser = async () => {
      const email = localStorage.getItem('email');
      const token = localStorage.getItem('token');

      // Retrieve the user back on page reload
      if (!user && token && email) {
        try {
          const foundUser = await getUser(email, token);
          setUser(foundUser);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
      setLoading(false);
    };

    findUser();
  }, [user, setUser]);

  if (loading) {
    return (
      <Layout>
        <Loader />
      </Layout>
    );
  }

  // Redirect to login if no user is found
  return user ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
