import axios, { AxiosError } from 'axios';
import { MODULE_ACTIVITY_API, MODULE_API, SET_WIFI_API } from '.';
import {
  ActiveModule,
  Module,
  ModuleActivityByID,
  ModuleActivityBySchedule,
  ModuleByID,
} from '../models/module/Module';
import { useSelector } from 'react-redux';
import { isRejectedWithValue } from '@reduxjs/toolkit';

interface RegisterMode {
  StudentID: string;
  FingerRegisterMode: number;
}

interface UpdateMode {
  StudentID: string;
  FingerprintTemplateId1: number | null;
  FingerprintTemplateId2: number | null;
}

interface StopAttendance {
  ScheduleID: number;
}

interface SyncingAttendanceData {
  ScheduleID: number;
}

interface StartAttendance {
  ScheduleID: number;
}

// interface Schedule {
//   ScheduleID: number;
// }

interface PrepareAttendance {
  ScheduleID: number;
}

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

const getModuleActivityByScheduleID = async (
  scheduleID: number,
): Promise<ModuleActivityBySchedule | null> => {
  try {
    const response = await axios.get(
      `${MODULE_ACTIVITY_API}?scheduleId=${scheduleID}`,
      {
        headers: {
          accept: '*/*',
        },
      },
    );
    return response.data as ModuleActivityBySchedule;
  } catch (error) {
    console.error('Error on get Module by ScheduleID: ', error);
    return null;
  }
};

const getModuleActivityByID = async (
  moduleActivityID: number,
): Promise<ModuleActivityByID | null> => {
  try {
    const response = await axios.get(
      `${MODULE_ACTIVITY_API}/${moduleActivityID}`,
      {
        headers: {
          accept: '*/*',
        },
      },
    );
    return response.data as ModuleActivityByID;
  } catch (error) {
    console.error('Error on get Module by moduleActivityID: ', error);
    return null;
  }
};

const activeModuleModeRegister = async (
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
    console.log('Session', SessionId);
    console.log('RegisterMode', RegisterMode);
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
        SessionId,
        RegisterMode,
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

const activeModuleModeUpdate = async (
  ModuleID: number,
  Mode: number,
  SessionId: number,
  UpdateMode: UpdateMode,
  token: string,
  // StartAttendance: Schedule,
  // StopAttendance: Schedule
) => {
  try {
    console.log('ModuleID', ModuleID);
    console.log('Mode', Mode);
    console.log('Session', SessionId);
    console.log('UpdateMode', UpdateMode);
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
        SessionId,
        UpdateMode,
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

const activeModuleAttendance = async (
  ModuleID: number,
  SessionId: number,
  Mode: number,
  PrepareAttendance: PrepareAttendance,
  token: string,
  // StartAttendance: Schedule,
  // StopAttendance: Schedule
) => {
  try {
    console.log('ModuleID', ModuleID);
    console.log('Mode', Mode);
    console.log('PrepareAttendance', PrepareAttendance);
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        SessionId,
        Mode,
        PrepareAttendance,
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

const stopCheckAttendance = async (
  ModuleID: number,
  Mode: number,
  StopAttendance: StopAttendance,
  token: string,
  // StartAttendance: Schedule,
  // StopAttendance: Schedule
) => {
  try {
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
        StopAttendance,
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
      console.log('Error:', error);
      throw error.response.data;
    }
    console.log('Unexpected error:', error.message);
    throw error.message;
  }
};

const syncAttendanceData = async (
  ModuleID: number,
  Mode: number,
  SyncingAttendanceData: { ScheduleID: number },
  token: string,
  // StartAttendance: Schedule,
  // StopAttendance: Schedule
) => {
  try {
    const response = await axios.post(
      `${MODULE_API}/Activate`,
      {
        ModuleID,
        Mode,
        SyncingAttendanceData,
      },
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    console.log('asddc', response);
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

const startCheckAttendance = async (
  ModuleID: number,
  Mode: number,
  StartAttendance: { ScheduleID: number }, // Adjusted type for StartAttendance
  token: string,
) => {
  try {
    const response = await axios.post(
      `${MODULE_API}/Activate`,
      {
        ModuleID,
        Mode,
        StartAttendance,
      },
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    console.log('Response:', response.data);
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

const activeModule = async (
  ModuleID: number,
  Mode: number,
  SessionId: number,
  token: string,
) => {
  try {
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
        SessionId,
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

const applySettingModule = async (
  ModuleID: number,
  Mode: number,
  token: string,
) => {
  try {
    console.log('ModuleID', ModuleID);
    console.log('Mode', Mode);
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

const cancelSession = async (
  ModuleID: number,
  Mode: number,
  SessionId: number,
  token: string,
) => {
  try {
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
        SessionId,
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

const settingModule = async (
  moduleID: number,
  AutoPrepare: boolean,
  PreparedTime: string,
  AttendanceDurationMinutes: number,
  ConnectionLifeTimeSeconds: number,
  ConnectionSound: boolean,
  ConnectionSoundDurationMs: number,
  AttendanceSound: boolean,
  AttendanceSoundDurationMs: number,
  token: string,
) => {
  try {
    const response = await axios.put(
      `${MODULE_API}/${moduleID}`,
      {
        AutoPrepare,
        PreparedTime,
        AttendanceDurationMinutes,
        ConnectionLifeTimeSeconds,
        ConnectionSound,
        ConnectionSoundDurationMs,
        AttendanceSound,
        AttendanceSoundDurationMs,
      },
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          Authorization: `Bearer ` + token,
        },
      },
    );
    console.log(response.data);
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

const prepareScheduleDay = async (
  ModuleID: number,
  Mode: number,
  SessionId: number,
  PrepareSchedules: { preparedDate: string }, 
  token: string,
) => {
  try {
    const response = await axios.post(
      `${MODULE_API}/Activate`,
      {
        ModuleID,
        Mode,
        SessionId,
        PrepareSchedules,
      },
      {
        headers: {
          Accept: '*/*',
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    console.log('Response:', response.data);
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
  return await axios.post(
    SET_WIFI_API,
    {
      ssid,
      pass,
    },
    {
      headers: {
        'Access-Control-Allow-Private-Network': 'true',
        'Content-Type': 'application/json',
      },
    },
  );
};

export const ModuleService = {
  getModuleByEmployeeID,
  activeModuleModeRegister,
  activeModuleModeUpdate,
  getAllModule,
  getModuleByID,
  activeModule,
  cancelSession,
  setUpWifi,
  activeModuleAttendance,
  stopCheckAttendance,
  syncAttendanceData,
  startCheckAttendance,
  settingModule,
  getModuleActivityByScheduleID,
  applySettingModule,
  getModuleActivityByID,
  prepareScheduleDay,
};
