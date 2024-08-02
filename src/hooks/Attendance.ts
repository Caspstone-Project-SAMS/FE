import axios from 'axios';
import { ATTENDANCE_API } from '.';
import {
  Attendance,
  UpdateListAttendance,
} from '../models/attendance/Attendance';

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
  console.log('Data in', Array(data), 'Type of data is ', typeof data);
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

export const AttendanceService = {
  getAttendanceByScheduleID,
  updateAttendance,
  updateListAttendance,
};
