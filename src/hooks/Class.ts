import axios, { AxiosError } from 'axios';
import { CLASS_API } from '.';
import { isRejectedWithValue } from '@reduxjs/toolkit';

const createClass = async (
  ClassCode: string,
  SemesterCode: string,
  RoomName: string,
  SubjectCode: string,
  LecturerID: string,
  CreatedBy: string,
) => {
  try {
    const response = await axios.post(
      CLASS_API,
      {
        ClassCode,
        SemesterCode,
        RoomName,
        SubjectCode,
        LecturerID,
        CreatedBy,
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
      console.log('abc', error.message);
      throw new AxiosError(error.response);
    }
    return isRejectedWithValue(error.message);
  }
};

export const ClassService = {
  createClass,
};
