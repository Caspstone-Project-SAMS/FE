import axios, { AxiosError } from 'axios';
import { MODULE_API } from '.';
import { Module } from '../models/module/Module';
import { useSelector } from 'react-redux';

interface RegisterMode {
  StudentID: string;
  FingerRegisterMode: number;
}


// interface Schedule {
//   ScheduleID: number;
// }

const getModuleByEmployeeID = async (
  employeeID: string,
): Promise<Module | null> => {
  console.log(typeof employeeID);
  try {
    const response = await axios.get(
      `${MODULE_API}?employeeId=${employeeID}`,
      {
        headers: {
          accept: '*/*',
        },
      },
    );
    return response.data as Module;
  } catch (error) {
    console.error('Error on get Module by ID: ', error);
    return null;
  }
};

const activeModuleMode = async (
  ModuleID: number,
  Mode: number,
  RegisterMode: RegisterMode,
  token: string
  // StartAttendance: Schedule,
  // StopAttendance: Schedule
) => {
  try {
    console.log("ModuleID", ModuleID)
    console.log("Mode", Mode)
    console.log("RegisterMode", RegisterMode)
    const response = await axios.post(
      MODULE_API + '/Activate',
      {
        ModuleID,
        Mode,
        RegisterMode,
        // StartAttendance,
        // StopAttendance
      },
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
          'Authorization': `Bearer ` + token,
        },
      }
    );
    console.log("asddc", response)
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error:", error.message);
      throw new Error(error.response.data);
    }
    console.log("Unexpected error:", error.message);
    throw new Error(error.message);
  }
};


export const ModuleService = {
  getModuleByEmployeeID,
  activeModuleMode
};
