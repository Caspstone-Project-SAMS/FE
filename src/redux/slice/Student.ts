import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StudentService } from '../../hooks/StudentList';

const initialState = {
  initialStudent: '',
};

const createStudent = createAsyncThunk(
  'create',
  async (arg: { StudentCode: string; CreateBy: string }) => {
    try {
      const { StudentCode, CreateBy } = arg;
      const createStudentResponse = await StudentService.createStudent(
        StudentCode,
        CreateBy,
      );
      return createStudentResponse;
    } catch (error) {
      console.log('Error in create student ', error);
    }
  },
);

const StudentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createStudent.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createStudent.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        initialStudent: payload,
      };
    });
    builder.addCase(createStudent.rejected, (state) => {
      return {
        ...state,
        loading: false,
      };
    });
  },
});

export { createStudent };
export default StudentSlice.reducer;
