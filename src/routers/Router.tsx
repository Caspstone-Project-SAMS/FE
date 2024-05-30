import React from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import { Layout } from 'antd';
import Sidebar from '../components/sidebar/Sidebar';
import Headers from '../components/header/Header';
import routeConfig from './RouterConfig';

const Router = () => {

  return (
    <Routes>
      <Route path='/*' element={
        <ProtectedRoute>
          <Layout className="container">
            <Sidebar />
            <Layout>
              <Headers />

              <Routes>
                {
                  routeConfig.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                  ))
                }
                <Route path="*" element={<ErrorPage />} />
              </Routes>

            </Layout>
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default Router