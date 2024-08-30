import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import Login from '../pages/auth/Login';
import ErrorPage from '../pages/ErrorPage';
import ProtectedRoute from './ProtectedRoute';
import TestComponent from './TestComponent';

interface PreparationProgress{
  SessionId: number;
  Progress: number;
}

const Router = () => {

  const [notification, setNotifications] = useState(0);
  const [preparationProgress, setPreparationProgress] = useState<PreparationProgress | null>(null);

  let ws : WebSocket | null;
  const ConnectWebsocket = (tokenString: string) => {
    ws = new WebSocket('ws://34.81.223.233/ws/client?root=true', [
      'access_token',
      tokenString,
    ]);

    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      const message = JSON.parse(event.data);
      switch (message.Event) {
        case 'NewNotification': {
          setNotifications((prev) => prev + 1);
          break;
        }

        case 'PreparationProgress':{
          const data = message.Data;
          const progressTrack: PreparationProgress ={
            SessionId: data.SessionId as number,
            Progress: data.Progress as number
          };
          setPreparationProgress(progressTrack);
          break;
        }

        default: {
          console.log('Undefined Event!');
          break;
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws?.close();
    };
  };

  const closeWebsocket = () => {
    ws?.close();
  }

  return (
    <Routes>
      <Route path='/*' element={
        <ProtectedRoute closeWebsocket={closeWebsocket} notification={notification} preparationProgress={preparationProgress}/>
      } />
      <Route path="/login" element={<Login ConnectWebsocket={ConnectWebsocket}/>} />
      <Route path="/excel-test" element={<TestComponent />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  )
}

export default Router