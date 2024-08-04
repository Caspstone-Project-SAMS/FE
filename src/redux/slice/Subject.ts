import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SubjectService } from '../../hooks/Subject';
import { SubjectMessage } from '../../models/subject/Subject';
import { AxiosError } from 'axios';

interface SubjectState {
  message: string | undefined;
  subjectDetail?: SubjectMessage;
  loading: boolean;
}

const initialState: SubjectState = {
  message: '',
  subjectDetail: undefined,
  loading: false,
};

const createSubject = createAsyncThunk(
  'subject/create',
  async (
    arg: {
      SubjectCode: string;
      SubjectName: string;
      SubjectStatus: number;
      // CreateBy: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { SubjectCode, SubjectName, SubjectStatus } = arg;
      const createSubjectResponse = await SubjectService.createSubject(
        SubjectCode,
        SubjectName,
        SubjectStatus,
        // CreateBy,
      );
      console.log('subject test ', createSubjectResponse);
      return createSubjectResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create subject', {
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

const updateSubject = createAsyncThunk(
  'subject/update',
  async (
    arg: {
      subjectID: number;
      SubjectCode: string;
      SubjectName: string;
      // SubjectStatus: boolean;
    },
    { rejectWithValue },
  ) => {
    try {
      const { subjectID, SubjectCode, SubjectName } = arg;
      const updateSubjectResponse = await SubjectService.updateSubject(
        subjectID,
        SubjectCode,
        SubjectName,
        // SubjectStatus,
      );
      return updateSubjectResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in update subject', {
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

const SubjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    clearSubjectMessages: (state) => {
      state.subjectDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSubject.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createSubject.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        subjectDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createSubject.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        subjectDetail: { data: action.payload || 'Failed to create subject' },
        message: undefined,
      };
    });
    builder.addCase(updateSubject.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateSubject.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        subjectDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(updateSubject.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        subjectDetail: { data: action.payload || 'Failed to update subject' },
        message: undefined,
      };
    });
  },
});

export const { clearSubjectMessages } = SubjectSlice.actions;
export { createSubject, updateSubject };
export default SubjectSlice.reducer;
