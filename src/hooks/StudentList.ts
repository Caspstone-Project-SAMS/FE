import axios from 'axios';
import { STUDENT_API } from '.';
import { Student, StudentDetail } from '../models/student/Student';

const getAllStudent = async (): Promise<Student[] | null> => {
  try {
    const response = await axios.get(STUDENT_API);
    return response.data as Student[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getStudentByID = async (studentID: string): Promise<StudentDetail | null> => {
  console.log(typeof studentID)
  try {
    const response = await axios.get(`${STUDENT_API}/${studentID}`, {
      headers: {
        'accept': '*/*'
      }
    });
    return response.data as StudentDetail;
  } catch (error) {
    console.error('Error on get Student by ID: ', error);
    return null;
  }
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
      }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error on create new student: ", error);
    return null;
  }
};

export const StudentService = {
  getAllStudent,
  getStudentByID,
  createStudent,
};
