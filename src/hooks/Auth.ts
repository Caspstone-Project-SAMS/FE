import axios, { AxiosError } from 'axios';
import { GET_GG_USER_INFO, USER_API, USER_AUTH_API } from '.';
import { UserInfo } from '../models/UserInfo';
import { GGUserInfo } from '../models/auth/GoogleResponse';

const login = async (
  username: string,
  password: string,
): Promise<UserInfo | undefined> => {
  const response = await axios.post(USER_AUTH_API + '/login', {
    username,
    password,
  });
  return response.data as UserInfo;
};

const loginGG = async (AccessToken: string): Promise<UserInfo | undefined> => {
  const response = await axios.post(USER_AUTH_API + '/login/google', {
    AccessToken,
  });
  return response.data as UserInfo;
};

const getGGInfo = async (access_token: string): Promise<GGUserInfo> => {
  const response = await axios.get(GET_GG_USER_INFO + access_token, {
    headers: {
      Authorization: `Bearer ${access_token}`,
      Accept: 'application/json',
    },
  });
  return response.data as GGUserInfo;
};

const resetPassword = async (
  UserId: string,
  OldPassword: string,
  NewPassword: string,
  ConfirmPassword: string,
) => {
  try {
    const response = await axios.post(
      `${USER_AUTH_API}/reset-password`,
      {
        UserId,
        OldPassword,
        NewPassword,
        ConfirmPassword,
      },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    console.log(response.data);
    return response.data;
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

const editProfile = async (
  UserId: string,
  Email: string,
  PhoneNumber: string,
  Avatar: File | null,
  DisplayName: string,
  Address: string,
  DOB: string,
  Gender: number,
  FirstName: string,
  LastName: string,
) => {
  try {
    console.log('test', Avatar);
    const formData = new FormData();
    formData.append('Email', Email);
    if (Avatar !== null) formData.append('Avatar', Avatar, Avatar.name);
    formData.append('DisplayName', DisplayName);
    formData.append('Address', Address);
    formData.append('DOB', DOB);
    const response = await axios.put(
      `${USER_API}/${UserId}`,
      {
        Email,
        PhoneNumber,
        Avatar,
        DisplayName,
        Address,
        DOB,
        Gender,
        FirstName,
        LastName,
      },
      {
        headers: {
          accept: '*/*',
          'Content-Type': 'multipart/form-data',
        },
      },
    );
    console.log(response.data);
    return response.data;
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

const forgotPassword = async (email: string) => {
  const response = await axios.post(
    USER_AUTH_API + '/forget-password',
    undefined,
    {
      params: {
        email,
      },
    },
  );
  return response.data;
};

const AuthService = {
  login,
  getGGInfo,
  loginGG,
  resetPassword,
  editProfile,
  forgotPassword
};

export default AuthService;
