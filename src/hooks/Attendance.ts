import axios from 'axios';
import { ATTENDANCE_API } from '.';
import {
  Attendance,
  UpdateListAttendance,
} from '../models/attendance/Attendance';
import { AttendanceReport } from '../models/attendance/AttendanceReport';

// const headers = {
//   'Content-Type': 'application/json',
//   'Access-Control-Allow-Origin': '*',
// };

const getAttendanceByScheduleID = async (
  scheduleID: string,
): Promise<Attendance[]> => {
  const response = await axios.get(ATTENDANCE_API, {
    params: {
      scheduleID,
      quantity: 35,
    },
  });
  return response.data as Attendance[];
};

const updateAttendance = async (
  scheduleID: string,
  attendanceStatus: string,
  attendanceTime: string,
  studentID: string,
) => {
  const response = await axios.put(
    ATTENDANCE_API + '/update-attendance-status',
    {
      params: {
        scheduleID,
        attendanceStatus,
        attendanceTime,
        studentID,
      },
    },
  );
  return response.data;
};

const updateListAttendance = async (data: UpdateListAttendance[]) => {
  const response = await axios.put(
    ATTENDANCE_API + '/update-list-student-status',
    data,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.data;
};

const getClassAttendanceReportByID = async (
  classId: number,
): Promise<AttendanceReport[]> => {
  const response = await axios.get(ATTENDANCE_API + '/attendance-report', {
    params: {
      classId,
    },
  });

  return response.data;
};

export const AttendanceService = {
  getAttendanceByScheduleID,
  updateAttendance,
  updateListAttendance,
  getClassAttendanceReportByID,
};
