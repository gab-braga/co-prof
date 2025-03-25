import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './routes/PrivateRoutes';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Classes from './pages/Classes';
import AuthProvider from './context/authContext';
import { Toaster } from 'react-hot-toast';
import Account from './pages/Account';
import RecordingPanel from './pages/RecordingPanel';
import ClassPanel from './pages/ClassPanel';

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
            <Route path="/classes" element={<Classes />} />
            <Route path="/classes/:id" element={<ClassPanel />} />
            <Route path="/classes/:id/recording" element={<RecordingPanel />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
};
