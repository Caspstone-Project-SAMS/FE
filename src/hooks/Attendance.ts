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

export const AttendanceService = {
  getAttendanceByScheduleID,
};
