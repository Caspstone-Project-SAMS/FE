import axios from 'axios';
import { SCRIPT_API } from '.';
import { ScriptResponse } from '../models/script/Script';

import axios from 'axios';

const setTime = async (Resource: string, token: string) => {
  try {
    console.log('Resource', Resource);
    console.log('Token', token);

    const response = await axios.post(
      `${SCRIPT_API}/set-time?resource=${encodeURIComponent(Resource)}`, 
      null, 
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
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



const resetTime = async (token: string) => {
  try {
    const response = await axios.post(
      `${SCRIPT_API}/reset-time`,  
      {}, 
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data; 
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Error:', error.response.data);  
      throw error.response.data;  
    }
    console.log('Unexpected error:', error.message);  
    throw error.message;  
  }
};


const registerAllFingerprint = async (token: string) => {
  try {
    const response = await axios.post(
      `${SCRIPT_API}/register-fingerprint`,
      null,
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
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

export const ScriptService = { setTime, resetTime, registerAllFingerprint };
