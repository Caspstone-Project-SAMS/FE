import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { SlotService } from '../../hooks/Slot';
import { SlotMessage } from '../../models/calendar/Semester';
import { AxiosError } from 'axios';

interface SlotState {
  message?: SlotMessage | string;
  slotDetail?: SlotMessage;
  loading: boolean;
}

const initialState: SlotState = {
  message: undefined,
  slotDetail: undefined,
  loading: false,
};

const createSlot = createAsyncThunk(
  'slot/create',
  async (
    arg: {
      SlotNumber: number;
      Status: number;
      StartTime: string;
      Endtime: string;
      SlotTypeId: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { SlotNumber, Status, StartTime, Endtime, SlotTypeId } = arg;
      const createSlotResponse = await SlotService.createSlot(
        SlotNumber,
        Status,
        StartTime,
        Endtime,
        SlotTypeId,
      );
      return createSlotResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create slot', {
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

const updateSlot = createAsyncThunk(
  'slot/update',
  async (
    arg: {
      SlotID: number;
      SlotNumber: number;
      Status: number;
      StartTime: string;
      Endtime: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { SlotID, SlotNumber, Status, StartTime, Endtime } = arg;
      const updateSlotResponse = await SlotService.updateSlot(
        SlotID,
        SlotNumber,
        Status,
        StartTime,
        Endtime,
      );
      return updateSlotResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in update slot', {
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

const deleteSlot = createAsyncThunk(
  'slot/delete',
  async (
    arg: {
      SlotID: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { SlotID } = arg;
      const deleteSlotResponse = await SlotService.deleteSlot(SlotID);
      return deleteSlotResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in delete slot', {
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

const createSlotType = createAsyncThunk(
  'slot-type/create',
  async (
    arg: {
      TypeName: string;
      Description: string;
      Status: number;
      SessionCount: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { TypeName, Description, Status, SessionCount } = arg;
      const createSlotTypeResponse = await SlotService.createSlotType(
        TypeName,
        Description,
        Status,
        SessionCount,
      );
      return createSlotTypeResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create slot type', {
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

const updateSlotType = createAsyncThunk(
  'slot-type/update',
  async (
    arg: {
      SlotTypeID: number;
      TypeName: string;
      Description: string;
      Status: number;
      SessionCount: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { SlotTypeID, TypeName, Description, Status, SessionCount } = arg;
      const updateSlotTypeResponse = await SlotService.updateSlotType(
        SlotTypeID,
        TypeName,
        Description,
        Status,
        SessionCount,
      );
      return updateSlotTypeResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in update slot type', {
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

const deleteSlotType = createAsyncThunk(
  'slot-type/delete',
  async (
    arg: {
      slotTypeID: number;
    },
    { rejectWithValue },
  ) => {
    try {
      const { slotTypeID } = arg;
      const deleteSlotTypeResponse = await SlotService.deleteSlotType(slotTypeID);
      return deleteSlotTypeResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in delete slot type', {
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

const SlotSlice = createSlice({
  name: 'slot',
  initialState,
  reducers: {
    clearSlotMessages: (state) => {
      state.slotDetail = undefined;
      state.message = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createSlot.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createSlot.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        slotDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createSlot.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        slotDetail: { data: action.payload || 'Failed to create slot' },
      };
    });
    builder.addCase(updateSlot.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateSlot.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        slotDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(updateSlot.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        slotDetail: { data: action.payload || 'Failed to update slot' },
        message: undefined,
      };
    });
    builder.addCase(deleteSlot.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(deleteSlot.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        slotDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(deleteSlot.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        slotDetail: { data: action.payload || 'Failed to delete slot' },
        message: undefined,
      };
    });
    //-----------
    builder.addCase(createSlotType.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createSlotType.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        slotDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(createSlotType.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        slotDetail: { data: action.payload || 'Failed to create slot type' },
      };
    });
    builder.addCase(updateSlotType.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateSlotType.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        slotDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(updateSlotType.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        slotDetail: { data: action.payload || 'Failed to update slot type' },
        message: undefined,
      };
    });
    builder.addCase(deleteSlotType.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(deleteSlotType.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        slotDetail: undefined,
        message: payload,
      };
    });
    builder.addCase(deleteSlotType.rejected, (state, action) => {
      return {
        ...state,
        loading: false,
        slotDetail: { data: action.payload || 'Failed to delete slot type' },
        message: undefined,
      };
    });
  },
});

export const { clearSlotMessages } = SlotSlice.actions;
export { createSlot, updateSlot, deleteSlot, createSlotType, updateSlotType, deleteSlotType };
export default SlotSlice.reducer;
