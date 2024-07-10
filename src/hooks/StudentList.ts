import axios from 'axios';
import { STUDENT_API } from '.';
import { Student } from '../models/student/Student';

type StudentList = {
  studentCode: string;
  displayName: string;
  email: string;
  createBy: string;
};

const getAllStudent = async (): Promise<Student[] | null> => {
  try {
    const response = await axios.get(STUDENT_API);
    return response.data as Student[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const importExcelStudent = async (studentList: StudentList[]) => {
  return await axios.post(STUDENT_API, studentList);
};

const createStudent = async (StudentCode: string, CreateBy: string) => {
  try {
    const response = await axios.post(
      STUDENT_API,
      {
        StudentCode,
        CreateBy,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error on create new student: ', error);
    return null;
  }
};

export const StudentService = {
  getAllStudent,
  importExcelStudent,
  createStudent,
};
