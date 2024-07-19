import axios, { AxiosError } from 'axios';
import { CLASS_API, DOWNLOAD_TEMPLATE_API } from '.';
import { ExcelClassList } from '../models/Class';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { Class } from '../models/Class';
import { HelperService } from './helpers/helperFunc';
import toast from 'react-hot-toast';

const importExcelClass = async (data: ExcelClassList[]) => {
  const res = await axios.post(CLASS_API, data);
  return res.data;
};

const downloadTemplateExcel = async () => {
  try {
    const response = await axios(
      `${DOWNLOAD_TEMPLATE_API}/download-excel-template-class`,
      {
        responseType: 'blob',
      },
    );
    const blobFile = response.data;
    HelperService.downloadFile(blobFile, 'template_class');
  } catch (error) {
    console.log('Error when download template_class');
    toast.error('Unknown error occured, please try again later');
  }
};

const getAllClass = async (): Promise<Class | null> => {
  try {
    const response = await axios.get(`${CLASS_API}?quantity=50`);

    return response.data as Class;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createClass = async (
  ClassCode: string,
  SemesterId: number,
  RoomId: number,
  SubjectId: number,
  LecturerID: string,
  // CreatedBy: string,
) => {
  try {
    const response = await axios.post(
      CLASS_API,
      {
        ClassCode,
        SemesterId,
        RoomId,
        SubjectId,
        LecturerID,
        // CreatedBy,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('abccccccccc', error.message);
      throw new AxiosError(error.response);
    }
    return isRejectedWithValue(error.message);
  }
};

export const ClassService = {
  downloadTemplateExcel,
  getAllClass,
  createClass,
};
