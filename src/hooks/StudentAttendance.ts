import axios from 'axios';
import { StudentAttendance } from '../models/student/StudentAttendance';
import { STUDENT_ATTENDANCE } from '.';

const getStudentAttendance = async (
//   attendanceStatus: boolean,
//   scheduleID: number,
  studentId: string,
  classId: number,
): Promise<StudentAttendance | null> => {
  try {
    const response = await axios.get(`${STUDENT_ATTENDANCE}`, {
      params: {
        startPage: 1,
        endPage: 10,
        quantity: 10,
        // attendanceStatus: attendanceStatus,
        // scheduleID: scheduleID,
        studentId: studentId,
        classId: classId,
      },
      headers: {
        accept: '*/*',
      },
    });
    return response.data as StudentAttendance;
  } catch (error) {
    console.error('Error on get Student Attendance: ', error);
    return null;
  }
};

export const StudentAttendanceService = {
  getStudentAttendance,
};
