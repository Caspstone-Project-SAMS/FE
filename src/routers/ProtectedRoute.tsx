import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { RootState } from '../redux/Store';
import Sidebar from '../components/sidebar/Sidebar';
import Headers from '../components/header/Header';
import routeConfig from './RouterConfig';
import ErrorPage from '../pages/ErrorPage';
import { Layout } from 'antd';
import React, { useEffect } from 'react';

const ProtectedRoute = () => {
    const Auth = useSelector((state: RootState) => state.auth);
    const role = Auth.userDetail?.result?.roles[0].name
    // const errs = Auth.userDetail?.errors?.length;
    useEffect(() => {
        console.log('helloo role ', role);
    }, [])

    if (!Auth.authStatus) {
        return <Navigate to="/login" />;
    }


    return (
        <Layout className="container">
            <Sidebar />
            <Layout>
                <Headers />
                <Routes>
                    {
                        role === 'Lecturer' ? (
                            routeConfig.lecture.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))
                        ) : ('')
                    }
                    {
                        role === 'Admin' ? (
                            routeConfig.admin.map((route, index) => (
                                <Route key={index} path={route.path} element={route.element} />
                            ))
                        ) : ('')
                    }
                    <Route path="*" element={<ErrorPage />} />
                </Routes>
            </Layout>
        </Layout>
    )
}
export default ProtectedRoute;