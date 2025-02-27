import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Navigate to="/signin" />;

  return <Outlet />;
};
