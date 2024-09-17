import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosError } from 'axios';
import { EmployeeMessage } from '../../models/employee/Employee';
import { EmployeeService } from '../../hooks/Employee';

interface LecturerState {
  message?: EmployeeMessage | string;
  lecturerDetail?: EmployeeMessage;
  loading: boolean;
}

const initialState: LecturerState = {
  message: undefined,
  lecturerDetail: undefined,
  loading: false,
};

const createLecturer = createAsyncThunk(
  'lecturer/create',
  async (
    arg: {
        UserName: string,
        Email: string,
        DisplayName: string,
    },
    { rejectWithValue },
  ) => {
    try {
      const {
        UserName,
        Email,
        DisplayName,
      } = arg;
      const createLecturerResponse = await EmployeeService.createLecturer(
        UserName,
        Email,
        DisplayName,
      );
      return createLecturerResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create lecturer', {
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

const LecturerSlice = createSlice({
  name: 'lecturer',
  initialState,
  reducers: {
    clearLecturerMessages: (state) => {
      state.lecturerDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createLecturer.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createLecturer.fulfilled, (state, action) => {
      const { payload } = action;
      // message.success("Lecturer created successfully");
      return {
        ...state,
        loading: false,
        lecturerDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createLecturer.rejected, (state, action) => {
      // message.error("Lecturer created successfully");
      // const { payload } = action;
      return {
        ...state,
        loading: false,
        lecturerDetail: { data: action.payload || 'Failed to create lecturer' },
        message: undefined,
      };
    });
  },
});

export const { clearLecturerMessages } = LecturerSlice.actions;
export { createLecturer };
export default LecturerSlice.reducer;
