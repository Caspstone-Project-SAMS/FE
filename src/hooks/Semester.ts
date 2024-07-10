import axios from 'axios';
import { SEMESTER_API } from '.';

const createSemester = async (
  SemesterCode: string,
  SemesterStatus: boolean,
  StartDate: string,
  EndDate: string,
  CreatedBy: string,
) => {
  try {
    const response = await axios.post(
      SEMESTER_API,
      {
        SemesterCode,
        SemesterStatus,
        StartDate,
        EndDate,
        CreatedBy,
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
    console.error('Error on create new Semester: ', error);
    return null;
  }
};

const updateSemester = async (
  SemesterCode: string,
  SemesterStatus: boolean,
  StartDate: string,
  EndDate: string,
  semesterID: number,
) => {
  try {
    const response = await axios.put(
      `${SEMESTER_API}?id=${ semesterID }`,
      {
        SemesterCode,
        SemesterStatus,
        StartDate,
        EndDate,
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
    console.error('Error on update Semester: ', error);
    return null;
  }
};

const deleteSemester = async (semesterID: number) => {
  try {
    const response = await axios.delete(SEMESTER_API + '/' + semesterID);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error on delete Semester: ', error);
    return null;
  }
};

export const SemesterService = {
  createSemester,
  updateSemester,
  deleteSemester,
};
