// import './App.css'
// import {
//   createBrowserRouter,
//   RouterProvider
// } from "react-router-dom";
import { Toaster } from 'react-hot-toast'

import { Provider } from "react-redux";
import Store from "./redux/Store";

// import Login from './pages/auth/Login';
// import Register from "./pages/auth/Register";
// import ErrorPage from "./pages/ErrorPage";
import Router from "./routers/Router";

const App = () => {
  // const router = createBrowserRouter([
  //   {
  //     path: '/',
  //     element: <Login />,
  //     errorElement: <ErrorPage />
  //   },
  //   {
  //     path: '/register',
  //     element: <Register />
  //   }
  // ]);

  return (
    <>
      <Provider store={Store}>
        {/* <RouterProvider router={router} /> */}
        <Router />
        <Toaster
          position="top-right"
        />
      </Provider>
    </>
  )
}

export default App
