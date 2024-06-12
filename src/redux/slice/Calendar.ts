import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { Schedule } from '../../models/calendar/Schedule';
import { CalendarService } from '../../hooks/Calendar';
import { Semester } from '../../models/calendar/Semester';

const initialScheduleState: Schedule = {
  scheduleID: 0,
  subjectCode: '',
  classCode: '',
  roomName: '',
  date: '',
  startTime: '',
  endTime: '',
  slotNumber: 0,
};
const initialSemester: Semester = {
  semesterID: 0,
  semesterCode: '',
  semesterStatus: 0,
  startDate: '',
  endDate: '',
};

const initialState = {
  schedule: [initialScheduleState],
  semester: [initialSemester],
  loadingStatus: false,
};

const getScheduleByID = createAsyncThunk(
  'calendar/schedule',
  async (arg: { lecturerID: string; semesterID: string }) => {
    try {
      const { lecturerID, semesterID } = arg;

      const schedulePromise = await CalendarService.getScheduleByLecturer(
        lecturerID,
        semesterID,
      );

      return schedulePromise;
    } catch (error) {
      console.log('Error in the calendar slice schedule ', error);
    }
  },
);

const CalendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getScheduleByID.pending, (state) => {
      return {
        ...state,
        loadingStatus: true,
      };
    });
    builder.addCase(getScheduleByID.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loadingStatus: false,
        schedule: payload,
      };
    });
    builder.addCase(getScheduleByID.rejected, (state) => {
      return {
        ...state,
        loadingStatus: false,
      };
    });
  },
});

export { getScheduleByID };
export default CalendarSlice.reducer;
