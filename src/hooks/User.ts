import axios, { AxiosError } from 'axios';
import { USER_API } from '.';
import { UserInfo } from '../models/UserInfo';

const getUserByID = async (
  userID: string,
): Promise<UserInfo | null> => {
  try {
    const response = await axios.get(`${USER_API}/${userID}`, {
      headers: {
        accept: 'text/plain',
      },
    });
    return response.data as UserInfo;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error:', error.message);
      throw new AxiosError(error.response);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
};

export const UserService = {
  getUserByID,
};
