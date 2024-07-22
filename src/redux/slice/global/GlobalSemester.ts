import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Semester } from '../../../models/calendar/Semester';
import { SemesterService } from '../../../hooks/Semester';

const initialSemester: Semester[] = [];

const initialState = {
  data: initialSemester,
};

const getAllSemester = createAsyncThunk(
  'globalSemester/getAllSemester',
  async () => {
    try {
      const promise = await SemesterService.getAllSemester();
      return promise.data;
    } catch (error) {
      console.log('err when getSemester');
    }
  },
);

const GlobalSemester = createSlice({
  name: 'globalSemester',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllSemester.fulfilled, (state, action) => {
      const { payload } = action;

      return {
        ...state,
        data: payload,
      };
    });
  },
});

export { getAllSemester };

export default GlobalSemester.reducer;
