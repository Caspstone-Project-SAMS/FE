import axios from 'axios';
import { SCHEDULE_API, SEMESTER_API } from '.';
import { Semester } from '../models/calendar/Semester';
import { HelperService } from './helpers/HelperFunc';
import toast from 'react-hot-toast';

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
  quantity: number,
) => {
  const response = await axios.get(SCHEDULE_API, {
    params: {
      lecturerId: lecturerID,
      semesterId: semesterID,
      quantity: quantity,
    },
  });
  return response.data;
};

const getScheduleByWeek = async (
  lecturerId: string,
  semesterId: string,
  quantity: number,
  startDate: string,
  endDate: string,
) => {
  const response = await axios.get(SCHEDULE_API, {
    params: {
      lecturerId,
      semesterId,
      quantity,
      startDate,
      endDate,
    },
  });
  return response.data;
};

const importExcelSchedule = async (data: ScheduleList[]) => {
  const res = await axios.post(SCHEDULE_API, data);
  return res.data;
};

const downloadTemplateExcel = async () => {
  try {
    const response = await axios(`${SCHEDULE_API}/download-excel-template`, {
      responseType: 'blob',
    });
    const blobFile = response.data;
    HelperService.downloadFile(blobFile, 'template_schedule');
  } catch (error) {
    console.log('Error when download template_schedule');
    toast.error('Unknown error occured, please try again later');
  }
};

export const CalendarService = {
  getAllSemester,
  getScheduleByLecturer,
  importExcelSchedule,
  downloadTemplateExcel,
  getScheduleByWeek,
};
