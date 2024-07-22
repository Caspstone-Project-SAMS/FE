import axios, { AxiosError } from 'axios';
import { MODULE_API, SET_WIFI_API } from '.';
import { ActiveModule, Module, ModuleByID } from '../models/module/Module';
import { useSelector } from 'react-redux';

interface RegisterMode {
  StudentID: string;
  FingerRegisterMode: number;
}

// interface Schedule {
//   ScheduleID: number;
// }

const getAllModule = async (): Promise<Module | null> => {
  try {
    const response = await axios.get(`${MODULE_API}`, {
      params: {
        startPage: 1,
        endPage: 10,
        quantity: 10,
      },
      headers: {
        accept: '*/*',
      },
    });

    return response.data as Module;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getModuleByEmployeeID = async (
  employeeID: string,
): Promise<Module | null> => {
  console.log(typeof employeeID);
  try {
    const response = await axios.get(`${MODULE_API}?employeeId=${employeeID}`, {
      headers: {
        accept: '*/*',
      },
    });
    return response.data as Module;
  } catch (error) {
    console.error('Error on get Module by Employee ID: ', error);
    return null;
  }
};

const getModuleByID = async (moduleID: number): Promise<ModuleByID | null> => {
  console.log(typeof moduleID);
  try {
    const response = await axios.get(`${MODULE_API}/${moduleID}`, {
      headers: {
        accept: '*/*',
      },
    });
    return response.data as ModuleByID;
  } catch (error) {
    console.error('Error on get Module by ID: ', error);
    return null;
  }
};

const activeModuleMode = async (
  ModuleID: number,
  Mode: number,
  SessionId: number,
  RegisterMode: RegisterMode,
  token: string,
  // StartAttendance: Schedule,
  // StopAttendance: Schedule
) => {
  try {
    console.log('ModuleID', ModuleID);
    console.log('Mode', Mode);
    console.log('RegisterMode', RegisterMode);
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
        SessionId,
        RegisterMode,
        // StartAttendance,
        // StopAttendance
      },
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ` + token,
        },
      },
    );
    console.log('asddc', response);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Error:', error.message);
      throw new Error(error.response.data);
    }
    console.log('Unexpected error:', error.message);
    throw new Error(error.message);
  }
};

const activeModule = async (ModuleID: number, Mode: number, token: string) => {
  try {
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
      },
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ` + token,
        },
      },
    );
    console.log('vvedf', response.data);
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

const setUpWifi = async (ssid: string, pass: string) => {
  return await axios.post(SET_WIFI_API, {
    ssid,
    pass,
  });
};

export const ModuleService = {
  getModuleByEmployeeID,
  activeModuleMode,
  getAllModule,
  getModuleByID,
  activeModule,
  setUpWifi,
};
