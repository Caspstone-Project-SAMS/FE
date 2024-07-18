import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ClassMessage } from '../../models/Class';
import { ClassService } from '../../hooks/Class';
import { AxiosError } from 'axios';

interface ClassState {
  message: string | undefined;
  classDetail?: ClassMessage;
  loading: boolean;
}

const initialState: ClassState = {
  message: '',
  classDetail: undefined,
  loading: false,
};

const createClass = createAsyncThunk(
  'class/create',
  async (
    arg: {
      ClassCode: string;
      SemesterCode: string;
      RoomName: string;
      SubjectCode: string;
      LecturerID: string;
      CreatedBy: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        ClassCode,
        SemesterCode,
        RoomName,
        SubjectCode,
        LecturerID,
        CreatedBy,
      } = arg;
      const createClassResponse = await ClassService.createClass(
        ClassCode,
        SemesterCode,
        RoomName,
        SubjectCode,
        LecturerID,
        CreatedBy,
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
      // message.success("Room created successfully");
      return {
        ...state,
        loading: false,
        roomDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createClass.rejected, (state, action) => {
      // message.error("Room created successfully");
      return {
        ...state,
        loading: false,
        roomDetail: { data: action.payload || 'Failed to create room' },
        message: undefined,
      };
    });
  },
});

export const { clearClassMessages } = ClassSlice.actions;
export { createClass };
export default ClassSlice.reducer;
