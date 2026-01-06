// src/routes/AppRoutes.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route ,Navigate } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import Dashboard from '../pages/Dashboard'; // Import the Dashboard page
// import Applications from '../pages/Applications'; // Import the Applications page
import MainLayout from '../components/MainLayout'; // Import MainLayout
import Applications from '../pages/Applications';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ComingSoon from '../pages/ComingSoon';
import Loan from '../pages/Loan';
import ForgotPasswordPage2 from '../pages/ForgotPasswordPage2';
import ResetPasswordPage from '../pages/ResetPasswordPage';

const AppRoutes = () => {
  return (
    <Router  basename="/">
      <Routes>
         {/* Redirect empty route ("/") to login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Routes that require the sidebar layout */}
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/loan" element={<Loan />} />
        </Route>
        
        {/* Routes that don't need the sidebar */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
         {/* Forgot password route */}
        <Route path="/forgot-password" element={<ForgotPasswordPage2 />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* <Route path="/dashboard" element={<ComingSoon />} /> */}

      </Routes>
    </Router>
  );
};

export default AppRoutes;
