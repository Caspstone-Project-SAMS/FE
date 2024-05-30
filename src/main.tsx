import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.tsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from "antd";
<!--         import "antd/dist/reset.css"; -->
const ggClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId={ggClientID}>
    <React.StrictMode>
      <BrowserRouter>
         <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#2123bf",
          },
        }}
      >
           <App />
       </ConfigProvider>
      </BrowserRouter>
    </React.StrictMode>
  </GoogleOAuthProvider>
)

