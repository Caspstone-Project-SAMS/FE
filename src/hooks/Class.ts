import axios, { AxiosError } from 'axios';
import { CLASS_API } from '.';
import { isRejectedWithValue } from '@reduxjs/toolkit';
import { Class } from '../models/Class';

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
  getAllClass,
  createClass,
};
