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
import LecturerModule from '../pages/module/LecturerModule'
import Module from '../pages/admin/module/Module';
import ModuleDetail from '../pages/admin/module/ModuleDetail';
import ScheduleImport from '../pages/schedule/ScheduleImport';
import AccountTeacherDetail from '../pages/admin/account/accountteachers/AccountTeacherDetail';
import ClassReport from '../pages/class/classReport/ClassReport';
import LecturerModuleDetail from '../pages/module/LecturerModuleDetail';
import { IoMdTime } from 'react-icons/io';
import { LuFingerprint } from 'react-icons/lu';
import ScriptTime from '../pages/script/ScriptTime';
import RegisterFingerprint from '../pages/script/RegisterFingerprint';
import ImportScheduleRecord from '../components/calendar/ImportScheduleRecord';
import SystemConfig from '../pages/admin/system/SystemConfig';
import Notification from '../pages/notification/Notification';

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
    path: '/class/detail/class-report',
    element: <ClassReport />
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
    path: '/calendar/import-schedule',
    element: <ScheduleImport />
  },
  {
    path: '/class/classdetails',
    element: <ClassDetails />
  },
  {
    path: '/class-report',
    element: <ClassReport />
  },
  {
    path: '/module',
    element: <LecturerModule />
  },
  {
    path: '/module/module-detail',
    element: <ModuleDetail />
  },
  {
    path: '/calendar/import-schedule-record',
    element: <ImportScheduleRecord />
  },
  {
    path: '/notification-detail',
    element: <Notification />
  },
  // {
  //   path: '/account/reset-password',
  //   element: <ResetPassword />
  // },
  // {
  //   path: '/account/edit-account',
  //   element: <EditAccount />
  // },
  // {
  //   path: '/import-schedule',
  //   element: <ScheduleImport />
  // },
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
    path: '/teacher/teacher-detail',
    element: <AccountTeacherDetail />
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
    path: '/room',
    element: <Room />
  },
  {
    path: '/schedule',
    element: <AdminSchedule />
  },
  {
    path: '/schedule/import-schedule',
    element: <ScheduleImport />
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
    path: '/class/detail/class-report',
    element: <ClassReport />
  },
  {
    path: '/module',
    element: <Module />
  },
  {
    path: '/module/module-detail',
    element: <ModuleDetail />
  },
  {
    path: '/system',
    element: <SystemConfig />
  },
  {
    path: '/notification-detail',
    element: <Notification />
  },
]

const student = [
  {
    path: '/student',
    element: <Student />
  },
]

const script = [
  {
    path: '/script/set-reset-time',
    element: <ScriptTime />
  },
  {
    path: '/script/register-fingerprint',
    element: <RegisterFingerprint />
  },
]

const routeConfig = {
  lecture,
  admin,
  student,
  script,
}
export default routeConfig;