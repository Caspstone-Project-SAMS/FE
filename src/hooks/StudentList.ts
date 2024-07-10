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

export const StudentService = {
  getAllStudent,
  importExcelStudent,
};
