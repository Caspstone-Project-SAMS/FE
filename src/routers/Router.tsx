import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import AuthSucceedTest from '../pages/auth/AuthSucceedTest';

const Router = () => {

  return (
    <Routes>
      <Route path='/*' element={
        <ProtectedRoute>
          <Routes>
            <Route path='' element={<AuthSucceedTest />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default Router