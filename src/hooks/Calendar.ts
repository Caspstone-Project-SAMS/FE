import axios from 'axios';
import { LECTURER_SCHEDULE_API, SEMESTER_API } from '.';
import { Semester } from '../models/calendar/Semester';

type ScheduleList = {
  date: string;
  slotNumber: string;
  classCode: string;
  // roomName?: string  | Future update
};

const getAllSemester = async (): Promise<Semester[] | null> => {
  try {
    const response = await axios.get(SEMESTER_API);

    return response.data as Semester[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getScheduleByLecturer = async (
  lecturerID: string,
  semesterID: string,
) => {
  const response = await axios.get(LECTURER_SCHEDULE_API, {
    params: {
      lecturerId: lecturerID,
      semesterId: semesterID,
    },
  });
  return response.data;
};

const importExcelSchedule = async (data: ScheduleList[]) => {
  const res = await axios.post(LECTURER_SCHEDULE_API, data);
  return res.data;
};

export const CalendarService = {
  getAllSemester,
  getScheduleByLecturer,
  importExcelSchedule,
};
