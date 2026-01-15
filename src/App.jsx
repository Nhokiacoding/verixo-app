import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/home/LandingPage';
import UserLogin from './components/auth/UserLogin';
import UserRegister from './components/auth/UserRegister';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
import EmailVerification from './pages/auth/EmailVerification';
import Dashboard from './pages/dashboard/Dashboard';
import ServicesList from './pages/services/ServicesList';
import USANumbers from './pages/usa-numbers/USANumbers';
import FundWallet from './pages/fund-wallet/FundWallet';
import Profile from './pages/profile/Profile';
import Support from './pages/support/Support';
import Transactions from './pages/transactions/Transactions';
import SMSHistory from './pages/sms-history/SMSHistory';
import RecentPurchases from './pages/recent-purchases/RecentPurchases';
import AdminDashboard from './pages/admin/AdminDashboard';
import './index.css';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  // Check if token is expired
  try {
    const tokenData = JSON.parse(atob(token.split('.')[1]));
    const isExpired = tokenData.exp * 1000 < Date.now();
    
    if (isExpired) {
      // Token expired, clear storage and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    // Invalid token, clear and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// Auth Route Component - Always show login/register (no auto-login)
const AuthRoute = ({ children }) => {
  // Always show the login/register page
  // Users must enter credentials every time for security
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<LandingPage />} />
        
        {/* Auth Routes */}
        <Route path="/login" element={
          <AuthRoute>
            <UserLogin />
          </AuthRoute>
        } />
        <Route path="/register" element={
          <AuthRoute>
            <UserRegister />
          </AuthRoute>
        } />
        <Route path="/forgot-password" element={
          <AuthRoute>
            <ForgotPassword />
          </AuthRoute>
        } />
        <Route path="/reset-password" element={
          <AuthRoute>
            <ResetPassword />
          </AuthRoute>
        } />
        <Route path="/verify-email" element={<EmailVerification />} />
        
        {/* Protected Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/services" element={
          <ProtectedRoute>
            <ServicesList />
          </ProtectedRoute>
        } />
        <Route path="/usa-numbers" element={
          <ProtectedRoute>
            <USANumbers />
          </ProtectedRoute>
        } />
        <Route path="/fund-wallet" element={
          <ProtectedRoute>
            <FundWallet />
          </ProtectedRoute>
        } />
        <Route path="/fund" element={
          <ProtectedRoute>
            <FundWallet />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/support" element={
          <ProtectedRoute>
            <Support />
          </ProtectedRoute>
        } />
        <Route path="/transactions" element={
          <ProtectedRoute>
            <Transactions />
          </ProtectedRoute>
        } />
        <Route path="/sms-history" element={
          <ProtectedRoute>
            <SMSHistory />
          </ProtectedRoute>
        } />
        <Route path="/recent-purchases" element={
          <ProtectedRoute>
            <RecentPurchases />
          </ProtectedRoute>
        } />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        
        {/* Redirects */}
        <Route path="/all-countries" element={<Navigate to="/usa-numbers" replace />} />
        
        {/* 404 - Redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
