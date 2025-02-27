import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoutes from './routes/PrivateRoutes';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Classes from './pages/Classes';
import AuthProvider from './context/authContext';
import { Toaster } from 'react-hot-toast';

export default () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route element={<PrivateRoutes />}>
            <Route path="/classes" element={<Classes />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AuthProvider>
  );
};
