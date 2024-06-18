import React from 'react';
import Home from "../pages/home/Home";
import Class from "../pages/class/Class";
import Student from "../pages/student/Student";
import Account from "../pages/account/Account";
import Admin from '../pages/admin/Admin';
import HomeCalendar from '../components/calendar/HomeCalendar';
// import MyCalendar from '../components/calendar/MyCalendar';
import ClassDetails from '../pages/class/classdetails/ClassDetails';
import HomeAdmin from '../pages/admin/homeadmin/HomeAdmin';
import AccountStudents from '../pages/admin/account/accountstudents/AccountStudents';
import AccountTeachers from '../pages/admin/account/accountteachers/AccountTeachers';

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
  },
  {
    path: '/calendar',
    element: <HomeCalendar />
  },
  {
    path: '/class/classdetails',
    element: <ClassDetails />
  }
];

const admin = [
  {
    path: '/homeadmin',
    element: <HomeAdmin />
  },
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
  {
    path: '/accountadmin/student',
    element: <AccountStudents />
  },
  {
    path: '/accountadmin/teacher',
    element: <AccountTeachers />
  },
]
const routeConfig = {
  lecture,
  admin
}
export default routeConfig;