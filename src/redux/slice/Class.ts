import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Class, ClassFail, ClassMessage } from '../../models/Class';
import { ClassService } from '../../hooks/Class';
import { AxiosError } from 'axios';
import { message } from 'antd';

interface ClassState {
  message?: ClassMessage | string;
  classDetail?: ClassMessage;
  loading: boolean;
}

const initialState: ClassState = {
  message: undefined,
  classDetail: undefined,
  loading: false,
};

const createClass = createAsyncThunk(
  'class/create',
  async (
    arg: {
      ClassCode: string;
      SemesterId: number;
      RoomId: number;
      SubjectId: number;
      LecturerID: string;
      // CreatedBy: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        ClassCode,
        SemesterId,
        RoomId,
        SubjectId,
        LecturerID,
        // CreatedBy,
      } = arg;
      const createClassResponse = await ClassService.createClass(
        ClassCode,
        SemesterId,
        RoomId,
        SubjectId,
        LecturerID,
        // CreatedBy,
      );
      return createClassResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create class', {
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

const updateClass = createAsyncThunk(
  'class/update',
  async (
    arg: {
      ClassID: number;
      ClassCode: string;
      SemesterId: number;
      RoomId: number;
      SubjectId: number;
      LecturerID: string;
      // CreatedBy: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        ClassID,
        ClassCode,
        SemesterId,
        RoomId,
        SubjectId,
        LecturerID,
        // CreatedBy,
      } = arg;
      const createClassResponse = await ClassService.updateClass(
        ClassID,
        ClassCode,
        SemesterId,
        RoomId,
        SubjectId,
        LecturerID,
        // CreatedBy,
      );
      return createClassResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create class', {
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

const deleteClass = createAsyncThunk(
  'class/delete',
  async (
    arg: {
      ClassID: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { ClassID } = arg;
      const deleteClassResponse = await ClassService.deleteClass(ClassID);
      return deleteClassResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in delete class', {
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

const ClassSlice = createSlice({
  name: 'class',
  initialState,
  reducers: {
    clearClassMessages: (state) => {
      state.classDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createClass.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createClass.fulfilled, (state, action) => {
      const { payload } = action;
      // message.success("Class created successfully");
      return {
        ...state,
        loading: false,
        classDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createClass.rejected, (state, action) => {
      // message.error("Class created successfully");
      // const { payload } = action;
      return {
        ...state,
        loading: false,
        classDetail: { data: action.payload || 'Failed to create class' },
        message: undefined,
      };
    });
    builder.addCase(updateClass.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateClass.fulfilled, (state, action) => {
      const { payload } = action;
      // message.success("Class created successfully");
      return {
        ...state,
        loading: false,
        classDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(updateClass.rejected, (state, action) => {
      // message.error("Class created successfully");
      // const { payload } = action;
      return {
        ...state,
        loading: false,
        classDetail: { data: action.payload || 'Failed to update class' },
        message: undefined,
      };
    });
    builder.addCase(deleteClass.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(deleteClass.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        classDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(deleteClass.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        classDetail: { data: action.payload || 'Failed to delete class' },
        message: undefined,
      };
    });
  },
});

export const { clearClassMessages } = ClassSlice.actions;
export { createClass, updateClass, deleteClass };
export default ClassSlice.reducer;
