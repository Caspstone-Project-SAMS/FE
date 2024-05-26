// import './App.css'
import {
  createBrowserRouter,
  RouterProvider
} from "react-router-dom";
import Login from './pages/auth/Login';
import Register from "./pages/auth/Register";

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Login />
    },
    {
      path: '/register',
      element: <Register />
    }
  ]);

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
