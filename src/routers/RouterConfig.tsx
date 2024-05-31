import React from 'react';
import Home from "../pages/home/Home";
import Class from "../pages/class/Class";
import Student from "../pages/student/Student";
import Account from "../pages/account/Account";
import Admin from '../pages/admin/Admin';

const lecture = [
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

const admin = [
  {
    path: '/subject',
    element: <Admin />
  },
  {
    path: '/teacher',
    element: <Admin />
  },
  {
    path: '/attendance',
    element: <Admin />
  },
]
const routeConfig = {
  lecture,
  admin
}
export default routeConfig;