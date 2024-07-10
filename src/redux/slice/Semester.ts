import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SemesterService } from '../../hooks/Semester';
import { SemesterMessage } from '../../models/calendar/Semester';

interface SemesterState {
  semesterDetail?: SemesterMessage;
  loading: boolean;
}

const initialState: SemesterState = {
  semesterDetail: undefined,
  loading: false,
};

const createSemester = createAsyncThunk(
  'semester/create',
  async (arg: {
    SemesterCode: string;
    SemesterStatus: boolean;
    StartDate: string;
    EndDate: string;
    CreatedBy: string;
  }) => {
    try {
      const { SemesterCode, SemesterStatus, StartDate, EndDate, CreatedBy } =
        arg;
      const createSemesterResponse = await SemesterService.createSemester(
        SemesterCode,
        SemesterStatus,
        StartDate,
        EndDate,
        CreatedBy,
      );
      return createSemesterResponse;
    } catch (error) {
      console.log('Error in create semester ', error);
    }
  },
);

const updateSemester = createAsyncThunk(
  'semester/update',
  async (arg: {
    SemesterCode: string;
    SemesterStatus: boolean;
    StartDate: string;
    EndDate: string;
    semesterID: number;
  }) => {
    try {
      const { SemesterCode, SemesterStatus, StartDate, EndDate, semesterID } =
        arg;
      const updateSemesterResponse = await SemesterService.updateSemester(
        SemesterCode,
        SemesterStatus,
        StartDate,
        EndDate,
        semesterID,
      );
      return updateSemesterResponse;
    } catch (error) {
      console.log('Error in update semester ', error);
    }
  },
);

const SemesterSlice = createSlice({
  name: 'semester',
  initialState,
  reducers: {},
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
        semesterDetail: payload,
      };
    });
    builder.addCase(createSemester.rejected, (state) => {
      return {
        ...state,
        loading: false,
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
        semesterDetail: payload,
      };
    });
    builder.addCase(updateSemester.rejected, (state) => {
      return {
        ...state,
        loading: false,
      };
    });
  },
});

export { createSemester, updateSemester };
export default SemesterSlice.reducer;
