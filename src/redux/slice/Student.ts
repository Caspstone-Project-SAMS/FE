import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Student } from '../../models/student/Student';
import { StudentService } from '../../hooks/StudentList';

// const initialStudent: Student = {
//   studentName: '',
//   userID: '',
//   image: '',
//   studentCode: '',
//   isAuthenticated: 0,
// };
interface StudentState {
    studentDetail?: Student[];
    loading: boolean;
}

// interface StudentState {
//     student: Student[];
//     loading: boolean;
//   }

const initialState: StudentState = {
  studentDetail: undefined,
  loading: false,
};

// const getAllStudent = createAsyncThunk('student', async () => {
//   try {
//     const studentPromise = await StudentService.getAllStudent();
//     console.log("aaa", studentPromise);
//     return studentPromise;
//   } catch (error) {
//     console.log('Error in the student slice', error);
//   }
// });

const getAllStudent = createAsyncThunk<Student[], void>(
    'student',
    async () => {
      try {
        const studentPromise = await StudentService.getAllStudent();
        console.log("aaa", studentPromise);
        return studentPromise ? [studentPromise] : [];
      } catch (error) {
        console.log('Error in the student slice', error);
        return [];
      }
    }
);

const StudentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllStudent.pending, (state) => {
        return {
            ...state,
            loading: true,
        };
    });
    builder.addCase(getAllStudent.fulfilled, (state, action) => {
        const { payload } = action;
        return {
            ...state,
            loading: false,
            studentDetail: payload,
        }
    });
    builder.addCase(getAllStudent.rejected, (state) => {
        return {
            ...state,
            loading: false,
        }
    });
  },
});

export { getAllStudent };
export default StudentSlice.reducer;
