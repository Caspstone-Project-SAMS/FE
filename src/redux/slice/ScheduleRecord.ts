import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ScheduleRecordService } from '../../hooks/ScheduleRecordList';
import { ScheduleRecordFail } from '../../models/scheduleRecord/ScheduleRecord';
import { AxiosError } from 'axios';
import { CalendarService } from '../../hooks/Calendar';
import { ScheduleRecord } from '../../models/calendar/Schedule';
interface ScheduleRecordState {
  message?: ScheduleRecord;
  scheduleRecordDetail?: ScheduleRecord;
  loading: boolean;
}

const initialState: ScheduleRecordState = {
  message: undefined,
  scheduleRecordDetail: undefined,
  loading: false,
};

const revertScheduleImport = createAsyncThunk(
  'schedule/revert',
  async (
    arg: {
      importSchedulesRecordID: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { importSchedulesRecordID } = arg;
      const revertScheduleRecordResponse =
        await CalendarService.revertScheduleImport(importSchedulesRecordID);
      return revertScheduleRecordResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in revert schedule record', {
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

const ScheduleRecordSlice = createSlice({
  name: 'scheduleRecord',
  initialState,
  reducers: {
    clearScheduleRecordMessages: (state) => {
      state.scheduleRecordDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(revertScheduleImport.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(revertScheduleImport.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        scheduleRecordDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(revertScheduleImport.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        scheduleRecordDetail: {
          data: action.payload || 'Failed to revert schedule record',
        },
        message: undefined,
      };
    });
  },
});

export const { clearScheduleRecordMessages } = ScheduleRecordSlice.actions;
export {revertScheduleImport};
export default ScheduleRecordSlice.reducer;
