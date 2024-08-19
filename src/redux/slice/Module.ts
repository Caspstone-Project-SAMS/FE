import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { ActiveModule, ActiveModuleFail } from '../../models/module/Module';
import { ModuleService } from '../../hooks/Module';
import { message } from 'antd';

interface StartAttendance {
  ScheduleID: number;
}

interface SyncingAttendanceData {
  ScheduleID: number;
}

interface StopAttendance {
  ScheduleID: number;
}

interface ModuleState {
  message?: ActiveModuleFail;
  moduleDetail?: ActiveModule;
  loading: boolean;
}

const initialState: ModuleState = {
  message: undefined,
  moduleDetail: undefined,
  loading: false,
};

// const activeModule = createAsyncThunk(
//   'module/active',
//   async (
//     arg: {
//       ModuleID: number;
//       Mode: number;
//       token: string;
//     },
//     { rejectWithValue },
//   ) => {
//     try {
//       const { ModuleID, Mode, token } = arg;
//       const activeModuleResponse = await ModuleService.activeModule(
//         ModuleID,
//         Mode,
//         token,
//       );
//       console.log("active", activeModule)
//       return activeModuleResponse;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error('Error in active module', {
//           data: error.response?.data,
//         });
//         // message.error(error.message.data.title);
//         return rejectWithValue({
//           data: error.response?.data,
//         });
//       } else {
//         console.error('Unexpected errorrrrr', error);
//         return rejectWithValue({ message: 'Unexpected error' });
//       }
//     }
//   },
// );

const activeModule = createAsyncThunk(
  'module/active',
  async (
    arg: {
      ModuleID: number;
      Mode: number;
      SessionId: number;
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { ModuleID, Mode, SessionId, token } = arg;
      const activeModuleResponse = await ModuleService.activeModule(
        ModuleID,
        Mode,
        SessionId,
        token,
      );
      console.log('active', activeModuleResponse);
      return activeModuleResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error:', error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.log('Unexpectedd error:', error);
        return rejectWithValue({ error });
      }
    }
  },
);

const startCheckAttendances = createAsyncThunk(
  'module/start-attendance',
  async (
    arg: {
      ModuleID: number;
      Mode: number;
      StartAttendance: StartAttendance;
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { ModuleID, Mode, StartAttendance, token } = arg;
      const StartAttendanceResponse = await ModuleService.startCheckAttendance(
        ModuleID,
        Mode,
        StartAttendance,
        token,
      );
      console.log('active', StartAttendanceResponse);
      return StartAttendanceResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error:', error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.log('Unexpectedd error:', error);
        return rejectWithValue({ error });
      }
    }
  },
);

const stopCheckAttendances = createAsyncThunk(
  'module/stop-attendance',
  async (
    arg: {
      ModuleID: number;
      Mode: number;
      StopAttendance: StopAttendance;
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { ModuleID, Mode, StopAttendance, token } = arg;
      const StopAttendanceResponse = await ModuleService.stopCheckAttendance(
        ModuleID,
        Mode,
        StopAttendance,
        token,
      );
      console.log('active', StopAttendanceResponse);
      return StopAttendanceResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error:', error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.log('Unexpectedd error:', error);
        return rejectWithValue({ error });
      }
    }
  },
);

const syncAttendance = createAsyncThunk(
  'module/sync-attendance',
  async (
    arg: {
      ModuleID: number;
      Mode: number;
      SyncingAttendanceData: SyncingAttendanceData;
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { ModuleID, Mode, SyncingAttendanceData, token } = arg;
      const SyncAttendanceResponse = await ModuleService.syncAttendanceData(
        ModuleID,
        Mode,
        SyncingAttendanceData,
        token,
      );
      console.log('active', SyncAttendanceResponse);
      return SyncAttendanceResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error:', error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.log('Unexpectedd error:', error);
        return rejectWithValue({ error });
      }
    }
  },
);

const settingModules = createAsyncThunk(
  'module/setting',
  async (
    arg: {
      moduleID: number;
      AutoPrepare: boolean;
      PreparedTime: string;
      AttendanceDurationMinutes: number;
      ConnectionLifeTimeSeconds: number;
      ConnectionSound: boolean;
      ConnectionSoundDurationMs: number;
      AttendanceSound: boolean;
      AttendanceSoundDurationMs: number;
      token: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        moduleID,
        AutoPrepare,
        PreparedTime,
        AttendanceDurationMinutes,
        ConnectionLifeTimeSeconds,
        ConnectionSound,
        ConnectionSoundDurationMs,
        AttendanceSound,
        AttendanceSoundDurationMs,
        token,
      } = arg;
      const settingModuleResponse = await ModuleService.settingModule(
        moduleID,
        AutoPrepare,
        PreparedTime,
        AttendanceDurationMinutes,
        ConnectionLifeTimeSeconds,
        ConnectionSound,
        ConnectionSoundDurationMs,
        AttendanceSound,
        AttendanceSoundDurationMs,
        token,
      );
      console.log('setting', settingModuleResponse);
      return settingModuleResponse;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log('Error:', error.response.data);
        return rejectWithValue(error.response.data);
      } else {
        console.log('Unexpectedd error:', error);
        return rejectWithValue({ error });
      }
    }
  },
);

const ModuleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    clearModuleMessages: (state) => {
      state.moduleDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(activeModule.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(activeModule.fulfilled, (state, action) => {
      const { payload } = action;
      //   message.success("Active module successfully");
      return {
        ...state,
        loading: false,
        moduleDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(activeModule.rejected, (state, action) => {
      //   message.error("Active module faillllll");
      return {
        ...state,
        loading: false,
        moduleDetail: undefined,
        message: { data: action.payload || 'Failed to active module' },
      };
    });

    builder.addCase(settingModules.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(settingModules.fulfilled, (state, action) => {
      const { payload } = action;
      //   message.success("Active module successfully");
      return {
        ...state,
        loading: false,
        moduleDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(settingModules.rejected, (state, action) => {
      //   message.error("Active module faillllll");
      return {
        ...state,
        loading: false,
        moduleDetail: undefined,
        message: { data: action.payload || 'Failed to setting module' },
      };
    });
    builder.addCase(startCheckAttendances.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(startCheckAttendances.fulfilled, (state, action) => {
      const { payload } = action;
      //   message.success("Active module successfully");
      return {
        ...state,
        loading: false,
        moduleDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(startCheckAttendances.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        moduleDetail: undefined,
        message: { data: action.payload || 'Failed to start attendance' },
      };
    });
    builder.addCase(syncAttendance.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(syncAttendance.fulfilled, (state, action) => {
      const { payload } = action;
      //   message.success("Active module successfully");
      return {
        ...state,
        loading: false,
        moduleDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(syncAttendance.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        moduleDetail: undefined,
        message: { data: action.payload || 'Failed to sync attendance' },
      };
    });
    builder.addCase(stopCheckAttendances.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(stopCheckAttendances.fulfilled, (state, action) => {
      const { payload } = action;
      //   message.success("Active module successfully");
      return {
        ...state,
        loading: false,
        moduleDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(stopCheckAttendances.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        moduleDetail: undefined,
        message: { data: action.payload || 'Failed to stop check attendance' },
      };
    });
  },
});

export const { clearModuleMessages } = ModuleSlice.actions;
export { activeModule, settingModules, startCheckAttendances, syncAttendance, stopCheckAttendances };
export default ModuleSlice.reducer;
