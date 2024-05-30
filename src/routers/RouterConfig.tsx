import React from 'react';
import Home from "../pages/home/Home";
import Class from "../pages/class/Class";
import Student from "../pages/student/Student";
import Account from "../pages/account/Account";

const routeConfig = [
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/class',
    element: <Class />
  },
  {
    path: '/student',
    element: <Student />
  },
  {
    path: '/account',
    element: <Account />
  }
];

export default routeConfig;