import axios, { Axios, AxiosError } from 'axios';
import { DOWNLOAD_TEMPLATE_API, STUDENT_API } from '.';
import { Student, StudentDetail } from '../models/student/Student';
import toast from 'react-hot-toast';
import { HelperService } from './helpers/helperFunc';
import { ExcelClassList } from '../models/Class';
import { isRejectedWithValue } from '@reduxjs/toolkit';

type StudentList = {
  studentCode: string;
  displayName: string;
  email: string;
  createBy: string;
};

const getAllStudent = async (): Promise<Student[] | null> => {
  try {
    const response = await axios.get(STUDENT_API, {
      params: {
        startPage: 1,
        endPage: 10,
        quantity: 10,
      },
    });
    return response.data as Student[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getStudentByID = async (
  studentID: string,
): Promise<StudentDetail | null> => {
  console.log(typeof studentID);
  try {
    const response = await axios.get(`${STUDENT_API}/${studentID}`, {
      headers: {
        accept: '*/*',
      },
    });
    return response.data as StudentDetail;
  } catch (error) {
    console.error('Error on get Student by ID: ', error);
    return null;
  }
};

const importExcelStudent = async (studentList: StudentList[]) => {
  return await axios.post(STUDENT_API, studentList);
};

const importExcelClass = async (data: ExcelClassList[], semesterId: number) => {
  const res = await axios.post(`${STUDENT_API}/add-students-to-class`, data, {
    params: { semesterId },
  });
  return res.data;
};

const createStudent = async (
  StudentCode: string,
  DisplayName: string,
  Email: string,
) => {
  try {
    const response = await axios.post(
      STUDENT_API,
      {
        StudentCode,
        DisplayName,
        Email,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('abccccccccc', error.message);
      throw new AxiosError(error.response);
    }
    return isRejectedWithValue(error.message);
  }
};

const downloadTemplateExcel = async () => {
  try {
    const response = await axios(
      `${DOWNLOAD_TEMPLATE_API}/download-excel-template-student`,
      {
        responseType: 'blob',
      },
    );
    const blobFile = response.data;
    HelperService.downloadFile(blobFile, 'template_student');
  } catch (error) {
    console.log('Error when download template_student');
    toast.error('Unknown error occured, please try again later');
  }
};

export const StudentService = {
  getAllStudent,
  getStudentByID,
  importExcelStudent,
  createStudent,
  downloadTemplateExcel,
  importExcelClass,
};
