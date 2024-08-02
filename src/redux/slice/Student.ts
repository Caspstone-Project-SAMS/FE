import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StudentService } from '../../hooks/StudentList';
import { StudentFail } from '../../models/student/Student';
import { AxiosError } from 'axios';

interface StudentState {
  message?: StudentFail;
  studentDetail?: StudentFail;
  loading: boolean;
}

const initialState: StudentState = {
  message: undefined,
  studentDetail: undefined,
  loading: false,
};

const createStudent = createAsyncThunk(
  'student/create',
  async (
    arg: { 
      StudentCode: string; 
      DisplayName: string; 
      Email: string; 
    },
    { rejectWithValue },
  ) => {
    try {
      const { StudentCode, DisplayName, Email } = arg;
      const createStudentResponse = await StudentService.createStudent(
        StudentCode,
        DisplayName,
        Email,
      );
      return createStudentResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create student', {
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

const StudentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    clearStudentMessages: (state) => {
      state.studentDetail = undefined;
      state.message = undefined;
    },
  },
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
        studentDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(createStudent.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: undefined,
        message: { data: action.payload || 'Failed to create class' },
      };
    });
  },
});

export const { clearStudentMessages } = StudentSlice.actions;
export { createStudent };
export default StudentSlice.reducer;
