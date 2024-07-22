import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
// import Excel from '../components/excel/Excel';

const Router = () => {

  return (
    <Routes>
      <Route path='/*' element={
        <ProtectedRoute />
      } />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/excel-test" element={<Excel fileType='class' />} /> */}
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default Router