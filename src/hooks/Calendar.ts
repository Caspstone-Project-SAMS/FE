import axios, { AxiosError } from 'axios';
import {
  DOWNLOAD_TEMPLATE_API,
  SCHEDULE_API,
  SCHEDULE_RECORD_API,
  SEMESTER_API,
} from '.';
import { Semester } from '../models/calendar/Semester';
import { HelperService } from './helpers/helperFunc';
import toast from 'react-hot-toast';
import {
  ScheduleRecord,
  Schedules,
  Scheduless,
} from '../models/calendar/Schedule';

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
  listScheduleId: number[],
): Promise<Scheduless | null> => {
  try {
    console.log('Schedule IDs:', listScheduleId);

    const response = await axios.get(`${SCHEDULE_API}/test-get-all`, {
      params: {
        startPage: 1,
        endPage: 10,
        quantity: 10,
        lecturerId,
        scheduleIds: listScheduleId, // Correctly handled as array
      },
      paramsSerializer: (params) => {
        return Object.entries(params)
          .map(([key, value]) => {
            if (Array.isArray(value)) {
              return value
                .map((v) => `${key}=${encodeURIComponent(v)}`)
                .join('&');
            }
            return `${key}=${encodeURIComponent(value)}`;
          })
          .join('&');
      },
      headers: {
        accept: '*/*',
      },
    });

    console.log('Response data:', response.data);
    return response.data as Scheduless;
  } catch (error) {
    console.error('Error fetching all schedules:', error);
    return null;
  }
};

const getScheduleByTime = async (
  lecturerId: string,
  semesterId: number,
  quantity: number,
  startDate: string,
  endDate: string,
  startPage?: number,
  endPage?: number,
) => {
  const response = await axios.get(SCHEDULE_API, {
    params: {
      lecturerId,
      semesterId,
      quantity,
      startDate,
      endDate,
      startPage,
      endPage,
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
      `${SCHEDULE_API}/create`,
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
      throw new AxiosError(error.response.data);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
};

const updateScheduleOfClass = async (
  scheduleID: number,
  Date: string,
  SlotId: number,
  RoomId: number | null,
) => {
  try {
    console.log('scheduleID', scheduleID);
    const response = await axios.put(
      `${SCHEDULE_API}/${scheduleID}`,
      {
        Date,
        SlotId,
        RoomId,
      },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error:', error.message);
      throw new AxiosError(error.response.data);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
};

const deleteScheduleOfClass = async (scheduleID: number) => {
  try {
    const response = await axios.delete(`${SCHEDULE_API}/${scheduleID}`, {
      headers: {
        accept: '*/*',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error:', error.message);
      throw new AxiosError(error.response.data);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
};

const getScheduleRecord = async (
  userID: string,
): Promise<ScheduleRecord | null> => {
  try {
    const response = await axios.get(SCHEDULE_RECORD_API, {
      params: {
        startPage: 1,
        endPage: 10,
        quantity: 10,
        userId: userID,
      },
      headers: {
        accept: '*/*',
      },
    });
    return response.data as ScheduleRecord;
  } catch (error) {
    console.error('Error fetching schedule records: ', error);
    return null;
  }
};

const revertScheduleImport = async (importSchedulesRecordID: number) => {
  try {
    const response = await axios.post(
      `${SCHEDULE_RECORD_API}/revert/${importSchedulesRecordID}`,
      {
        headers: {
          accept: '*/*',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error:', error.message);
      throw new AxiosError(error.response.data);
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
  getScheduleByTime,
  getScheduleByID,
  importSchedulesByImg,
  getAllSchedule,
  addScheduleToClass,
  updateScheduleOfClass,
  deleteScheduleOfClass,
  getScheduleRecord,
  revertScheduleImport,
};
