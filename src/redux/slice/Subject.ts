import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SubjectService } from '../../hooks/Subject';
import { SubjectMessage } from '../../models/subject/Subject';

interface SubjectState {
  subjectDetail?: SubjectMessage;
  loading: boolean;
}

const initialState: SubjectState = {
  subjectDetail: undefined,
  loading: false,
};

const createSubject = createAsyncThunk(
  'subject/create',
  async (arg: {
    SubjectCode: string;
    SubjectName: string;
    SubjectStatus: boolean;
    CreateBy: string;
  }) => {
    try {
      const { SubjectCode, SubjectName, SubjectStatus, CreateBy } = arg;
      const createSubjectResponse = await SubjectService.createSubject(
        SubjectCode,
        SubjectName,
        SubjectStatus,
        CreateBy,
      );
      console.log("subject test ", createSubjectResponse);
      // if (!createSubjectResponse.isSuccess) {
      //   throw new Error(createSubjectResponse.title || 'Create Subject failed');
      // }
      return createSubjectResponse;
    } catch (error) {
      console.log('Error in create subject ', error);
    }
  },
);

const updateSubject = createAsyncThunk(
  'subject/update',
  async (arg: {
    subjectID: number;
    SubjectCode: string;
    SubjectName: string;
    // SubjectStatus: boolean;
  }) => {
    try {
      const {subjectID, SubjectCode, SubjectName } = arg;
      const updateSubjectResponse = await SubjectService.updateSubject(
        subjectID,
        SubjectCode,
        SubjectName,
        // SubjectStatus,
      );
      return updateSubjectResponse;
    } catch (error) {
      console.log('Error in update subject ', error);
    }
  },
);

const SubjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {},
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
        subjectDetail: payload,
      };
    });
    builder.addCase(createSubject.rejected, (state) => {
      return {
        ...state,
        loading: false,
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
        subjectDetail: payload,
      };
    });
    builder.addCase(updateSubject.rejected, (state) => {
      return {
        ...state,
        loading: false,
      };
    });
  },
});

export { createSubject, updateSubject };
export default SubjectSlice.reducer;
