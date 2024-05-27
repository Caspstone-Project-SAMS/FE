// import './App.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";

import { Provider } from "react-redux";
import Store from "./redux/Store";

import Login from './pages/auth/Login';
import Register from "./pages/auth/Register";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />,
      errorElement: <ErrorPage />
    },
    {
      path: '/register',
      element: <Register />
    }
  ]);

  return (
    <>
      <Provider store={Store}>
        <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
