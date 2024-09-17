import {
  createAction,
  createAsyncThunk,
  createSlice,
  PayloadAction,
} from '@reduxjs/toolkit';
import { Schedule } from '../../models/calendar/Schedule';
import { CalendarService } from '../../hooks/Calendar';
import { Semester } from '../../models/calendar/Semester';
import moment from 'moment';
import { HelperService } from '../../hooks/helpers/helperFunc';
import axios from 'axios';

//Functions
const checkContainedDate = (item: Date[], sample: Date[]): boolean => {
  return item.every((value) => sample.includes(value));
};
const formatDate = (date: Date) => {
  const fmtData = moment(date).format('YYYY-MM-DD');
  return fmtData;
};

//Initial state
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
  semesterStatus: 3,
  startDate: '',
  endDate: '',
};
const initialTimeLine: Date[] = [];

const initialState = {
  schedule: [initialScheduleState],
  semester: [initialSemester],
  timeline: initialTimeLine,
  loadingStatus: false,
};

//Action
const createTimeLine = createAction('createTimeLine');

//Asycn Thunk
const getScheduleByID = createAsyncThunk(
  'calendar/schedule',
  async (arg: { lecturerID: string; semesterID: string; week: Date[] }) => {
    try {
      const { lecturerID, semesterID, week } = arg;
      console.log('Init ', week);

      const schedulePromise = await CalendarService.getScheduleByLecturer(
        lecturerID,
        semesterID,
        50,
      );
      // console.log('Schedule promise ', schedulePromise);
      return schedulePromise;
    } catch (error) {
      console.log('Error in the calendar slice schedule ', error);
    }
  },
);

const getScheduleByWeek = createAsyncThunk(
  'calendar/scheduleByWeek',
  async (
    arg: { lecturerID: string; semesterID: number; week: Date[] },
    { rejectWithValue },
  ) => {
    try {
      const { lecturerID, semesterID, week } = arg;
      let startDate;
      let endDate;
      if (week.length === 7) {
        startDate = formatDate(week[0]);
        endDate = formatDate(week[6]);
        const schedulePromise = await CalendarService.getScheduleByTime(
          lecturerID,
          semesterID,
          35,
          startDate,
          endDate,
        );
        // console.log('Schedule promise ', schedulePromise);
        return schedulePromise;
      }
      return rejectWithValue('Currently support get data in week view');
    } catch (error) {
      if (
        !(
          axios.isAxiosError(error) &&
          error.response?.data === 'Lecturer not have any Schedule'
        )
      ) {
        console.log('Error when get schedule', error);
      }
    }
  },
);

const getScheduleByMonth = createAsyncThunk(
  'calendar/scheduleByMonth',
  async (
    arg: { lecturerID: string; semesterID: number; start: Date; end: Date },
    { rejectWithValue },
  ) => {
    try {
      const { lecturerID, semesterID, start, end } = arg;
      const startDate = formatDate(start);
      const endDate = formatDate(end);
      if (start !== null && end !== null) {
        const schedulePromise = await CalendarService.getScheduleByTime(
          lecturerID,
          semesterID,
          50,
          startDate,
          endDate,
          1,
          20,
        );
        // console.log('Schedule promise ', schedulePromise);
        return schedulePromise;
      }
      return rejectWithValue(
        'Currently support get data in week and month view',
      );
    } catch (error) {
      if (
        !(
          axios.isAxiosError(error) &&
          error.response?.data === 'Lecturer not have any Schedule'
        )
      ) {
        console.log('Error when get schedule', error);
      }
    }
  },
);

const CalendarSlice = createSlice({
  name: 'calendar',
  initialState,
  reducers: {
    addTimeLine: (state, action) => {
      console.log('action ', action);
      const { payload } = action;
      state.timeline.push(payload);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(
      createTimeLine,
      (state, action: PayloadAction<{ weeks: Date[] }>) => {
        const { weeks } = action.payload;
        state.timeline.push(...weeks);
      },
    );
    //GetScheduleByID
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
    //getScheduleByWeek
    builder.addCase(getScheduleByWeek.pending, (state) => {
      return {
        ...state,
        loadingStatus: true,
      };
    });
    builder.addCase(getScheduleByWeek.fulfilled, (state, { payload }) => {
      return {
        ...state,
        loadingStatus: false,
        schedule: payload,
      };
    });
    builder.addCase(getScheduleByWeek.rejected, (state) => {
      return {
        ...state,
        loadingStatus: false,
      };
    });
    //getScheduleByMonth
    builder.addCase(getScheduleByMonth.pending, (state) => {
      return {
        ...state,
        loadingStatus: true,
      };
    });
    builder.addCase(getScheduleByMonth.fulfilled, (state, { payload }) => {
      return {
        ...state,
        loadingStatus: false,
        schedule: payload,
      };
    });
    builder.addCase(getScheduleByMonth.rejected, (state) => {
      return {
        ...state,
        loadingStatus: false,
      };
    });
  },
});

export { getScheduleByID, getScheduleByWeek, getScheduleByMonth };
export const { addTimeLine } = CalendarSlice.actions;
export default CalendarSlice.reducer;
