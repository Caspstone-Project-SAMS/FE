import axios, { AxiosError } from 'axios';
import { SEMESTER_API } from '.';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { Semester, SemesterDetail } from '../models/calendar/Semester';

const getAllSemester = async () => {
  return await axios.get(SEMESTER_API);
};

const getSemesterByID = async (
  semesterID: number,
): Promise<SemesterDetail | null> => {
  console.log(typeof semesterID);
  try {
    const response = await axios.get(`${SEMESTER_API}/${semesterID}`, {
      headers: {
        accept: '*/*',
      },
    });
    console.log('swfv', response.data);
    return response.data as SemesterDetail;
  } catch (error) {
    console.error('Error on get Semester by ID: ', error);
    return null;
  }
};

const createSemester = async (
  SemesterCode: string,
  SemesterStatus: number,
  StartDate: string,
  EndDate: string,
  // CreatedBy: string,
) => {
  try {
    const response = await axios.post(
      SEMESTER_API,
      {
        SemesterCode,
        SemesterStatus,
        StartDate,
        EndDate,
        // CreatedBy,
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
      console.log('abc', error.message);
      throw new AxiosError(error.response);
    }
    return isRejectedWithValue(error.message);
  }
};

const updateSemester = async (
  SemesterCode: string,
  // SemesterStatus: number,
  StartDate: string,
  EndDate: string,
  semesterID: number,
) => {
  try {
    const response = await axios.put(
      `${SEMESTER_API}?id=${semesterID}`,
      {
        SemesterCode,
        // SemesterStatus,
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
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('abc', error.message);
      throw new AxiosError(error.response);
    }
    return isRejectedWithValue(error.message);
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
  getAllSemester,
  getSemesterByID,
  createSemester,
  updateSemester,
  deleteSemester,
};
