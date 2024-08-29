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

export const SystemService = {
  getAllSystem,
};
