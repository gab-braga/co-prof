import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AuthProvider from './context/authContext';
import PrivateRoutes from './routes/PrivateRoutes';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Panel/Account';
import ClassesPanel from './pages/Panel/ClassesPanel';
import ClassPanel from './pages/Panel/ClassPanel';
import RecordingPanel from './pages/Panel/RecordingPanel';
import Authorization from './pages/Authorization';

export default () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/account" element={<Account />} />
            <Route path="/classes" element={<ClassesPanel />} />
            <Route path="/classes/:id" element={<ClassPanel />} />
            <Route path="/classes/:id/recording" element={<RecordingPanel />} />
            <Route path="/authorization" element={<Authorization />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
};
