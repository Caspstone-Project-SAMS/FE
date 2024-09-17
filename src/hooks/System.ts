import axios from 'axios';
import { System } from '../models/system/System';
import { SYSTEM_API } from '.';

const getAllSystem = async (): Promise<System | null> => {
  try {
    const response = await axios.get(`${SYSTEM_API}`, {
      headers: {
        accept: '*/*',
      },
    });

    return response.data as System;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const updateSystem = async (
  RevertableDurationInHours: number,
  ClassCodeMatchRate: number,
  SemesterDurationInDays: number,
) => {
  try {
    const response = await axios.put(
      SYSTEM_API,
      {
        RevertableDurationInHours,
        ClassCodeMatchRate,
        SemesterDurationInDays,
      },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      },
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Axios Error:', error.response.data);
      throw new Error(error.response.data);
    } else {
      console.error('Unexpected Error:', error.message);
      throw new Error(error.message);
    }
  }
};

export const SystemService = {
  getAllSystem,
  updateSystem,
};
