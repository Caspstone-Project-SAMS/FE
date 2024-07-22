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
import AccountStudentsDetail from '../pages/admin/account/accountstudents/AccountStudentsDetail';
import SemesterDetail from '../pages/admin/semester/SemesterDetail';
import Slot from '../pages/admin/slot/Slot';
import SlotDetail from '../pages/admin/slot/SlotDetail';
import AdminClassDetail from '../pages/admin/class/AdminClassDetail';
import Module from '../pages/admin/module/Module';
import ModuleDetail from '../pages/admin/module/ModuleDetail';

const lecture = [
  {
    path: '/home',
    element: <Home />
  },
  {
    path: '/class',
    element: <Class />
  },
  {
    path: '/class/detail',
    element: <AdminClassDetail />
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
    path: '/home',
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
    path: '/account-admin/student/student-detail',
    element: <AccountStudentsDetail />
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
    path: '/semester/semester-detail',
    element: <SemesterDetail />
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
  {
    path: '/slot',
    element: <Slot />
  },
  {
    path: '/slot/slot-detail',
    element: <SlotDetail />
  },
  {
    path: '/admin-class/admin-class-detail',
    element: <AdminClassDetail />
  },
  {
    path: '/module',
    element: <Module />
  },
  {
    path: '/module/module-detail',
    element: <ModuleDetail />
  },
]

const student = [
  {
    path: '/student',
    element: <Student />
  },
]

const routeConfig = {
  lecture,
  admin,
  student,
}
export default routeConfig;