import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import AuthSucceedTest from '../pages/auth/AuthSucceedTest';

const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={
          <ProtectedRoute>
            <Routes>
              <Route path='/' element={<AuthSucceedTest />} />
            </Routes>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<Login />} errorElement={<ErrorPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default Router