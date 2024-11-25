import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAppContext } from './app-context';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppContext();
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
