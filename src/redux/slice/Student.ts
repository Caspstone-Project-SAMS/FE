import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { StudentService } from '../../hooks/StudentList';
import { StudentFail } from '../../models/student/Student';
import { AxiosError } from 'axios';
import { CalendarService } from '../../hooks/Calendar';

interface StudentList {
  StudentCode: string;
  ClassCode: string;
}

interface StudentIDs {
  studentID: string;
}
interface StudentState {
  // message?: StudentFail | string;
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
      students: StudentList[];
    },
    { rejectWithValue },
  ) => {
    try {
      const { semesterId, students } = arg;
      const addStudentResponse = await StudentService.addStudentToClass(
        semesterId,
        students,
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

const deleteStudentOfClasses = createAsyncThunk(
  'student/delete',
  async (
    arg: {
      classID: number;
      students: StudentIDs[];
    },
    { rejectWithValue },
  ) => {
    try {
      const { classID, students } = arg;
      // console.log('class', classID);
      // console.log('studnet', students);
      const deleteStudentResponse = await StudentService.deleteStudentOfClass(
        classID,
        students,
      );
      return deleteStudentResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in delete student of class', {
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
        Date,
        SlotId,
        ClassId,
        RoomId,
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

const updateScheduleOfClasses = createAsyncThunk(
  'schedule/update',
  async (
    arg: {
      scheduleID: number;
      Date: string;
      SlotId: number;
      RoomId: number | null;
    },
    { rejectWithValue },
  ) => {
    try {
      const { scheduleID, Date, SlotId, RoomId } = arg;
      const updateScheduleResponse =
        await CalendarService.updateScheduleOfClass(
          scheduleID,
          Date,
          SlotId,
          RoomId,
        );
      return updateScheduleResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in update schedule of class', {
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

const deleteScheduleOfClasses = createAsyncThunk(
  'schedule/delete',
  async (
    arg: {
      scheduleID: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { scheduleID } = arg;
      const deleteScheduleResponse =
        await CalendarService.deleteScheduleOfClass(scheduleID);
      return deleteScheduleResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in delete schedule of class', {
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
        studentDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createStudent.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: { data: action.payload || 'Failed to create student' },
        message: undefined,
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
        studentDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(addStudentToClasses.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: {
          data: action.payload || 'Failed to add student to class',
        },
        message: undefined,
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
        studentDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(addScheduleToClasses.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: {
          data: action.payload || 'Failed to add schedule to class',
        },
        message: undefined,
      };
    });
    builder.addCase(updateScheduleOfClasses.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateScheduleOfClasses.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        studentDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(updateScheduleOfClasses.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: {
          data: action.payload || 'Failed to update schedule of class',
        },
        message: undefined,
      };
    });
    builder.addCase(deleteScheduleOfClasses.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(deleteScheduleOfClasses.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        studentDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(deleteScheduleOfClasses.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: {
          data: action.payload || 'Failed to delete schedule of class',
        },
        message: undefined,
      };
    });
    builder.addCase(deleteStudentOfClasses.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(deleteStudentOfClasses.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        studentDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(deleteStudentOfClasses.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        studentDetail: {
          data: action.payload || 'Failed to delete student of class',
        },
        message: undefined,
      };
    });
  },
});

export const { clearStudentMessages } = StudentSlice.actions;
export {
  createStudent,
  addStudentToClasses,
  addScheduleToClasses,
  updateScheduleOfClasses,
  deleteScheduleOfClasses,
  deleteStudentOfClasses,
};
export default StudentSlice.reducer;
