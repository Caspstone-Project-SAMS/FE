import React, { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { RootState } from '../redux/Store';
import { useSelector } from 'react-redux';

import { Layout } from 'antd';

import Sidebar from '../components/sidebar/Sidebar';
import Headers from '../components/header/Header';
import generateRouteConfig  from './RouterConfig';
import ErrorPage from '../pages/ErrorPage';
import Module from '../pages/admin/module/Module';
import HomeCalendar from '../components/calendar/HomeCalendar';

interface PreparationProgress {
  SessionId: number;
  Progress: number;
}

interface RouterProps {
  closeWebsocket: () => void;
  // notification: number;
  preparationProgress?: PreparationProgress | null;
  NotificationId: number;
  setNotificationId: (NotificationId: number) => void;
  moduleId: number;
  connection: boolean;
}
const ProtectedRoute: React.FC<RouterProps> = ({
  closeWebsocket,
  // notification,
  preparationProgress,
  NotificationId,
  setNotificationId,
  moduleId,
  connection,
}) => {
  const Auth = useSelector((state: RootState) => state.auth);
  const role = Auth.userDetail?.result?.role.name;
  const navigate = useNavigate();
  const location = useLocation();
  const [isRunScript, setIsRunScript] = useState(false);
  // const errs = Auth.userDetail?.errors?.length;

  const routeConfig = generateRouteConfig(moduleId, connection);

  useEffect(() => {
    if (
      location.pathname === '/script' ||
      location.pathname === '/script/set-reset-time' ||
      location.pathname === '/script/register-fingerprint'
    ) {
      setIsRunScript(true);
    } else {
      setIsRunScript(false);
    }
  }, [location.pathname]);

  useEffect(() => {
    const handlePopState = () => {
      if (
        location.pathname === '/script' ||
        location.pathname === '/script/set-reset-time' ||
        location.pathname === '/script/register-fingerprint'
      ) {
        setIsRunScript(true);
      } else {
        setIsRunScript(false);
      }
    };

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [location.pathname]);

  if (!Auth.authStatus) {
    return <Navigate to="/login" />;
  }

  const handleNavigateScript = () => {
    setIsRunScript(true);
    navigate('/script/set-reset-time');
  };

  const handleNavigateHome = () => {
    setIsRunScript(false);
    navigate('/home');
  };

  return (
    <Layout style={{ height: '100%' }}>
      <Sidebar isRunScript={isRunScript} />
      <Layout>
        <Headers
          handleNavigateScript={handleNavigateScript}
          handleNavigateHome={handleNavigateHome}
          closeWebsocket={closeWebsocket}
          // notificationss={notification}
          preparationProgress={preparationProgress}
          NotificationId={NotificationId}
          setNotificationId={setNotificationId}
        />
        <Routes>
          {role === 'Lecturer'
            ? routeConfig.lecture.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))
            : ''}
          {role === 'Admin' && isRunScript === false
            ? routeConfig.admin.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))
            : ''}
          {/* {role === 'Admin' && isRunScript === false && (
            <Route
              path="/module"
              element={<Module moduleId={moduleId} connection={connection} />}
            />
          )}
          {role === 'Lecturer' && (
            <Route
              path="/module"
              element={<Module moduleId={moduleId} connection={connection} />}
            />
          )}
          {role === 'Lecturer' && (
            <Route
              path="/module"
              element={<HomeCalendar moduleId={moduleId} connection={connection} />}
            />
          )} */}
          {role === 'Student'
            ? routeConfig.student.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))
            : ''}
          {role === 'SupAdmin' && isRunScript === true
            ? routeConfig.script.map((route, index) => (
                <Route key={index} path={route.path} element={route.element} />
              ))
            : ''}
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Layout>
    </Layout>
  );
};
export default ProtectedRoute;
