import axios, { AxiosError } from 'axios';
import { SESSION_API } from '.';
import { isRejectedWithValue } from '@reduxjs/toolkit';

const submitSession = async (sessionID: number, token: string) => {
  try {
    const response = await axios.post(
      SESSION_API,
      {
        sessionID,
      },
      {
        headers: {
          accept: '*/*',
          Authorization: `Bearer ` + token,
        },
      },
    );
    return response.data;
} catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Error:', error);
      throw error.response.data;
    }
    console.log('Unexpected error:', error.message);
    throw error.message;
  }
};

export const SessionServive = {
  submitSession,
};
