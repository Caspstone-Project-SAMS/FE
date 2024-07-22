import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import TestComponent from './TestComponent';

const Router = () => {

  return (
    <Routes>
      <Route path='/*' element={
        <ProtectedRoute />
      } />
      <Route path="/login" element={<Login />} />
      <Route path="/excel-test" element={<TestComponent />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default Router