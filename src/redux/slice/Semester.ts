import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SemesterService } from '../../hooks/Semester';
import { SemesterMessage } from '../../models/calendar/Semester';
import { AxiosError } from 'axios';

interface SemesterState {
  message: string | undefined;
  semesterDetail?: SemesterMessage;
  loading: boolean;
}

const initialState: SemesterState = {
  message: '',
  semesterDetail: undefined,
  loading: false,
};

const createSemester = createAsyncThunk(
  'semester/create',
  async (
    arg: {
      SemesterCode: string;
      SemesterStatus: number;
      StartDate: string;
      EndDate: string;
      // CreatedBy: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { SemesterCode, SemesterStatus, StartDate, EndDate } =
        arg;
      const createSemesterResponse = await SemesterService.createSemester(
        SemesterCode,
        SemesterStatus,
        StartDate,
        EndDate,
        // CreatedBy,
      );
      return createSemesterResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create semester', {
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

const updateSemester = createAsyncThunk(
  'semester/update',
  async (
    arg: {
      SemesterCode: string;
      // SemesterStatus: number;
      StartDate: string;
      EndDate: string;
      semesterID: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { SemesterCode, StartDate, EndDate, semesterID } =
        arg;
      const updateSemesterResponse = await SemesterService.updateSemester(
        SemesterCode,
        // SemesterStatus,
        StartDate,
        EndDate,
        semesterID,
      );
      return updateSemesterResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in update semester', {
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

const SemesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {
    clearSemesterMessages: (state) => {
      state.semesterDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSemester.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createSemester.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        semesterDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createSemester.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        semesterDetail: { data: action.payload || 'Failed to create semester' },
      };
    });
    builder.addCase(updateSemester.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateSemester.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        semesterDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(updateSemester.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        semesterDetail: { data: action.payload || 'Failed to update semester' },
        message: undefined,
      };
    });
  },
});

export const { clearSemesterMessages } = SemesterSlice.actions;
export { createSemester, updateSemester };
export default SemesterSlice.reducer;
