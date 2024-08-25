import axios, { AxiosError } from 'axios';
import { DOWNLOAD_TEMPLATE_API, STUDENT_API, STUDENT_CLASS_API } from '.';
import { Student, StudentDetail } from '../models/student/Student';
import toast from 'react-hot-toast';
import { HelperService } from './helpers/helperFunc';
import { ExcelClassList } from '../models/Class';

type StudentList = {
  studentCode: string;
  displayName: string;
  email: string;
  createBy: string;
};

interface StudentData {
  StudentCode: string;
  ClassCode: string;
}

interface StudentIDs {
  studentID: string;
}

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

const getStudentByPage = async (page: number, pageSize?: number) => {
  try {
    const response = await axios.get(STUDENT_API, {
      params: {
        startPage: page,
        endPage: page,
        quantity: pageSize ? pageSize : 35,
      },
    });
    return response.data as Student[];
  } catch (error) {
    return [];
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
      [
        {
          StudentCode,
          DisplayName,
          Email,
        },
      ],
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

// const addStudentToClass = async (
//   semesterId: number,
//   StudentCode: string,
//   ClassCode: string,
// ) => {
//   try {
//     const response = await axios.post(
//       `${STUDENT_API}/add-students-to-class?semesterId=${semesterId}`,
//       [
//         {
//           StudentCode,
//           ClassCode,
//         }
//       ],
//       {
//         headers: {
//           'accept': '*/*',
//           'Content-Type': 'application/json-patch+json',
//         },
//       }
//     );
//     console.log(response.data);
//     return response.data;
//   } catch (error: any) {
//     if (axios.isAxiosError(error) && error.response) {
//       console.error('Error:', error.message);
//       throw new AxiosError(error.response);
//     } else {
//       console.error('Error:', error.message);
//       throw new Error(error.message);
//     }
//   }
// };

const addStudentToClass = async (
  semesterId: number,
  students: StudentData[],
) => {
  try {
    const response = await axios.post(
      `${STUDENT_API}/add-students-to-class?semesterId=${semesterId}`,
      students,
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

const deleteStudentOfClass = async (
  classID: number,
  students: StudentIDs[],
) => {
  try {
    console.log('afsedc', classID)
console.log('studentsssssss', students)
    const response = await axios.delete(`${STUDENT_CLASS_API}`, {
      headers: {
        accept: '*/*',
        'Content-Type': 'application/json-patch+json',
      },
      data: {
        ClassId: classID,
        StudentIds: students.map((student) => student.studentID),
      },
    });
    console.log('aaaaaaaaaaaaaaaaaaaaa', response.data);
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
  getStudentByPage,
  addStudentToClass,
  deleteStudentOfClass,
};
