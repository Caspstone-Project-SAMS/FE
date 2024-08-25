// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
// import { CalendarService } from '../../hooks/Calendar';
// import { StudentFail } from '../../models/student/Student';
// import { AxiosError } from 'axios';

// interface ScheduleState {
//   message?: StudentFail;
//   scheduleDetail?: StudentFail;
//   loading: boolean;
// }

// const initialState: ScheduleState = {
//   message: undefined,
//   scheduleDetail: undefined,
//   loading: false,
// };

// const updateScheduleOfClasses = createAsyncThunk(
//   'schedule/update',
//   async (
//     arg: {
//     scheduleID: number;
//       Date: string;
//       SlotId: number;
//       RoomId: number | null;
//     },
//     { rejectWithValue },
//   ) => {
//     try {
//       const { scheduleID, Date, SlotId, RoomId } = arg;
//       const updateScheduleResponse =
//         await CalendarService.updateScheduleOfClass(
//         scheduleID,
//           Date,
//           SlotId,
//           RoomId,
//         );
//       return updateScheduleResponse;
//     } catch (error) {
//       if (error instanceof AxiosError) {
//         console.error('Error in update schedule of class', {
//           data: error.message,
//         });
//         // message.error(error.message.data.title);
//         return rejectWithValue({
//           data: error.message,
//         });
//       } else {
//         console.error('Unexpected error', error);
//         return rejectWithValue({ message: 'Unexpected error' });
//       }
//     }
//   },
// );

// const ScheduleSlice = createSlice({
//   name: 'schedule',
//   initialState,
//   reducers: {
//     clearScheduleMessages: (state) => {
//       state.scheduleDetail = undefined;
//       state.message = undefined;
//     },
//   },
//   extraReducers: (builder) => {
//     builder.addCase(updateScheduleOfClasses.pending, (state) => {
//       return {
//         ...state,
//         loading: true,
//       };
//     });
//     builder.addCase(updateScheduleOfClasses.fulfilled, (state, action) => {
//       const { payload } = action;
//       return {
//         ...state,
//         loading: false,
//         scheduleDetail: payload,
//         message: undefined,
//       };
//     });
//     builder.addCase(updateScheduleOfClasses.rejected, (state, action) => {
//       return {
//         ...state,
//         loading: false,
//         scheduleDetail: undefined,
//         message: { data: action.payload || 'Failed to update schedule of class' },
//       };
//     });
//   },
// });

// export const { clearScheduleMessages } = ScheduleSlice.actions;
// export { updateScheduleOfClasses };
// export default ScheduleSlice.reducer;
