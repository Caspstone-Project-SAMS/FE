import axios from 'axios';
import { ATTENDANCE_API } from '.';
import { Attendance } from '../models/attendance/Attendance';

const getAttendanceByScheduleID = async (
  scheduleID: string,
): Promise<Attendance[]> => {
  const response = await axios.get(ATTENDANCE_API, {
    params: {
      scheduleID,
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
    ATTENDANCE_API + 'update-attendance-status',
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

export const AttendanceService = {
  getAttendanceByScheduleID,
  updateAttendance,
};
