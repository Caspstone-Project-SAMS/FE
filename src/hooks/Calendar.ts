import axios, { AxiosError } from 'axios';
import { DOWNLOAD_TEMPLATE_API, SCHEDULE_API, SEMESTER_API } from '.';
import { Semester } from '../models/calendar/Semester';
import { HelperService } from './helpers/helperFunc';
import toast from 'react-hot-toast';
import { Schedules, Scheduless } from '../models/calendar/Schedule';

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

const getAllSchedule = async (
  lecturerId: string,
): Promise<Scheduless | null> => {
  try {
    const response = await axios.get(`${SCHEDULE_API}/test-get-all`, {
      params: {
        startPage: 1,
        endPage: 10,
        quantity: 10,
        lecturerId,
      },
      headers: {
        accept: '*/*',
      },
    });
    console.log('abcd: ', response.data);
    return response.data as Scheduless;
  } catch (error) {
    console.error('Error on get All Schedule: ', error);
    return null;
  }
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

const importExcelSchedule = async (
  data: ScheduleList[],
  semesterId: number,
) => {
  const res = await axios.post(SCHEDULE_API, data, { params: { semesterId } });
  return res.data;
};

const downloadTemplateExcel = async () => {
  try {
    const response = await axios(
      `${DOWNLOAD_TEMPLATE_API}/download-excel-template-schedule`,
      {
        responseType: 'blob',
      },
    );
    const blobFile = response.data;
    HelperService.downloadFile(blobFile, 'template_schedule');
  } catch (error) {
    console.log('Error when download template_schedule');
    toast.error('Unknown error occured, please try again later');
  }
};

const getScheduleByID = async (
  scheduleID: number,
): Promise<Schedules | null> => {
  try {
    const response = await axios.get(`${SCHEDULE_API}/${scheduleID}`, {
      headers: {
        accept: '*/*',
      },
    });
    return response.data as Schedules;
  } catch (error) {
    console.error('Error on get Schedule by ID: ', error);
    return null;
  }
};

const importSchedulesByImg = async (previewImgData: any, token: string) => {
  try {
    const response = await axios.post(
      `${SCHEDULE_API}/import-schedules`,
      previewImgData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    console.log('response back in importSchedulesByImg', response);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.data) {
      return error.response.data;
    }
  }
};

const addScheduleToClass = async (
  Date: string,
  SlotId: number,
  ClassId: number,
  RoomId: number | null,
) => {
  try {
    const response = await axios.post(
      `${SCHEDULE_API}/create`, // Ensure this is the correct API endpoint
      {
        Date,
        SlotId,
        ClassId,
        RoomId,
      },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      },
    );

    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error:', error.message);
      throw new AxiosError(error.response);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
};

export const CalendarService = {
  getAllSemester,
  getScheduleByLecturer,
  importExcelSchedule,
  downloadTemplateExcel,
  getScheduleByWeek,
  getScheduleByID,
  importSchedulesByImg,
  getAllSchedule,
  addScheduleToClass,
};
