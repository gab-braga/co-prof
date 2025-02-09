import React from 'react';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

export default () => {
  return (
    <div className="min-vh-100 d-flex flex-column">
      <Header />
      <div className="container flex-grow-1">
        <Outlet />
      </div>
    </div>
  );
};
