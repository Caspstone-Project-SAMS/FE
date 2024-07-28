import axios, { AxiosError } from 'axios';
import { SESSION_API } from '.';
import { message } from 'antd';

const submitSession = async (sessionId: number, token: string) => {
  try {
    const auth = {
      headers: { Authorization: 'Bearer ' + token },
    };
    const response = await axios.post(`${SESSION_API}?sessionId=${sessionId}`, {
      headers: {
        accept: '*/*',
        Authorization: `Bearer ` + token,
      },
    }, auth);
    console.log("fcwsfc", response.data)
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
