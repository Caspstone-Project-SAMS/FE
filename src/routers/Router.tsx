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
        <Route path="/login" element={<Login />} errorElement={<ErrorPage />} />
        <Route path='/lecture' element={
          <ProtectedRoute>
            <Routes>
              <Route path='/' element={<AuthSucceedTest />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </BrowserRouter>
  )
}

export default Router