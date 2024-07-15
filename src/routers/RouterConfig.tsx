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
import Semester from '../pages/admin/semester/Semester';
import AdminClass from '../pages/admin/class/AdminClass';
import Subject from '../pages/admin/subject/Subject';
import AdminAttendance from '../pages/admin/attendance/AdminAttendance';
import Room from '../pages/admin/room/Room';
import AdminSchedule from '../pages/admin/schedule/AdminSchedule';

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
    path: '/home-admin',
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
    path: '/account-admin/student',
    element: <AccountStudents />
  },
  {
    path: '/account-admin/teacher',
    element: <AccountTeachers />
  },
  {
    path: '/semester',
    element: <Semester />
  },
  {
    path: '/admin-class',
    element: <AdminClass />
  },
  {
    path: '/admin-subject',
    element: <Subject />
  },
  {
    path: '/admin-attendance',
    element: <AdminAttendance />
  },
  {
    path: '/room',
    element: <Room />
  },
  {
    path: '/schedule',
    element: <AdminSchedule />
  },
]
const routeConfig = {
  lecture,
  admin
}
export default routeConfig;