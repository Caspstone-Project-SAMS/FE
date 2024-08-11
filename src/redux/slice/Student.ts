import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StudentService } from '../../hooks/StudentList';
import { StudentFail } from '../../models/student/Student';
import { AxiosError } from 'axios';
import { CalendarService } from '../../hooks/Calendar';

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

const addStudentToClasses = createAsyncThunk(
  'student/add',
  async (
    arg: {
      semesterId: number;
      StudentCode: string;
      ClassCode: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { semesterId, StudentCode, ClassCode } = arg;
      const addStudentResponse = await StudentService.addStudentToClass(
        semesterId,
        StudentCode,
        ClassCode,
      );
      return addStudentResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in add student to class', {
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

const addScheduleToClasses = createAsyncThunk(
  'schedule/add',
  async (
    arg: {
      Date: string;
      SlotId: number;
      ClassId: number;
      RoomId: number | null;
    },
    { rejectWithValue },
  ) => {
    try {
      
      const { Date, SlotId, ClassId, RoomId } = arg;
      const addScheduleResponse = await CalendarService.addScheduleToClass(
        Date, SlotId, ClassId, RoomId
      );
      return addScheduleResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in add schedule to class', {
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
        message: { data: action.payload || 'Failed to create student' },
      };
    });
    builder.addCase(addStudentToClasses.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(addStudentToClasses.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        studentDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(addStudentToClasses.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: undefined,
        message: { data: action.payload || 'Failed to add student to class' },
      };
    });
    builder.addCase(addScheduleToClasses.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(addScheduleToClasses.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        studentDetail: payload,
        message: undefined,
      };
    });
    builder.addCase(addScheduleToClasses.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: undefined,
        message: { data: action.payload || 'Failed to add schedule to class' },
      };
    });
  },
});

export const { clearStudentMessages } = StudentSlice.actions;
export { createStudent, addStudentToClasses, addScheduleToClasses };
export default StudentSlice.reducer;
