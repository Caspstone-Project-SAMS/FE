import axios, { AxiosError } from 'axios';
import { SESSION_API } from '.';
import { message } from 'antd';
import { Session } from '../models/session/Session';

const submitSession = async (
  sessionId: number,
  token: string,
  fingerprint1Description: string | '',
  fingerprint2Description: string | '',
) => {
  console.log('fingerprint1Description', fingerprint1Description);
  console.log('fingerprint2Description', fingerprint2Description);
  try {
    const auth = {
      headers: { Authorization: 'Bearer ' + token },
    };
    const response = await axios.post(
      `${SESSION_API}?sessionId=${sessionId}`,
      {
        // headers: {
        //   accept: '*/*',
        //   Authorization: `Bearer ` + token,
        // },

        fingerprint1Description,
        fingerprint2Description,
      },
      auth,
    );
    console.log('fcwsfc', response.data);
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

const getSessionByID = async (sessionId: number): Promise<Session | null> => {
  try {
    const response = await axios.get(`${SESSION_API}/${sessionId}`, {
      headers: {
        accept: '*/*',
      },
    });
    console.log(
      'Session data::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::',
    );
    return response.data as Session;
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
  getSessionByID,
};
