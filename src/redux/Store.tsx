import { configureStore } from '@reduxjs/toolkit';

import Auth from './slice/Auth';
import Calendar from './slice/Calendar';
import Student from './slice/Student';
import Room from './slice/Room';
import Semester from './slice/Semester';
import Subject from './slice/Subject';
import Class from './slice/Class';
import GlobalSemester from './slice/global/GlobalSemester';

const Store = configureStore({
  reducer: {
    auth: Auth,
    calendar: Calendar,
    student: Student,
    room: Room,
    semester: Semester,
    subject: Subject,
    class: Class,
    globalSemester: GlobalSemester
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;

export default Store;
