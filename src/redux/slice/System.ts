import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SystemService } from '../../hooks/System';
import { System } from '../../models/system/System';
import { AxiosError } from 'axios';

interface SystemState {
  message?: System;
  systemDetail?: System;
  loading: boolean;
}

const initialState: SystemState = {
  message: undefined,
  systemDetail: undefined,
  loading: false,
};

const updateSystem = createAsyncThunk(
  'system/update',
  async (
    arg: {
      RevertableDurationInHours: number;
      ClassCodeMatchRate: number;
      SemesterDurationInDays: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        RevertableDurationInHours,
        ClassCodeMatchRate,
        SemesterDurationInDays,
      } = arg;
      const updateSystemResponse = await SystemService.updateSystem(
        RevertableDurationInHours,
        ClassCodeMatchRate,
        SemesterDurationInDays,
      );
      return updateSystemResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in update system', {
          data: error.message,
        });
        // message.error(error.message.data.title);
        return rejectWithValue({
          data: error.message,
        });
      } else {
        console.error('Unexpected error', error);
        return rejectWithValue({ message: 'Unexpected error' });
      }
    }
  },
);

const SystemSlice = createSlice({
  name: 'system',
  initialState,
  reducers: {
    clearSystemMessages: (state) => {
      state.systemDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(updateSystem.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateSystem.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        systemDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(updateSystem.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        systemDetail: { data: action.payload || 'Failed to update system' },
      };
    });
  },
});

export const { clearSystemMessages } = SystemSlice.actions;
export {updateSystem};
export default SystemSlice.reducer;
