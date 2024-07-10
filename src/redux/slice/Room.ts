import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { RoomService } from '../../hooks/Room';
import { RoomMessage } from '../../models/room/Room';
import { AxiosError } from 'axios';
import { message } from 'antd';

interface RoomState {
  roomDetail?: RoomMessage;
  message: string;
  loading: boolean;
}

const initialState: RoomState = {
  roomDetail: undefined,
  message: "",
  loading: false,
};

const createRoom = createAsyncThunk(
  'room/create',
  async (
    arg: {
      RoomName: string;
      RoomDescription: string;
      RoomStatus: boolean;
      CreateBy: string;
    },
    { rejectWithValue },
  ) => {
    try {
      const { RoomName, RoomDescription, RoomStatus, CreateBy } = arg;
      const createRoomResponse = await RoomService.createRoom(
        RoomName,
        RoomDescription,
        RoomStatus,
        CreateBy,
      );
      return createRoomResponse;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error('Error in create room', {
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

const updateRoom = createAsyncThunk(
  'room/update',
  async (arg: {
    RoomName: string;
    RoomDescription: string;
    RoomStatus: boolean;
    // CreateBy: string;
    roomID: number;
  }) => {
    try {
      const { RoomName, RoomDescription, RoomStatus, roomID } = arg;
      const updateRoomResponse = await RoomService.updateRoom(
        RoomName,
        RoomDescription,
        RoomStatus,
        // CreateBy,
        roomID,
      );
      return updateRoomResponse;
    } catch (error) {
      console.log('Error in update room ', error);
    }
  },
);

const RoomSlice = createSlice({
  name: 'room',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createRoom.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(createRoom.fulfilled, (state, action) => {
      const { payload } = action;
      // message.success("Room created successfully");
      return {
        ...state,
        loading: false,
        message: payload,
      };
    });
    builder.addCase(createRoom.rejected, (state, action) => {
      // message.error("Room created successfully");
      return {
        ...state,
        loading: false,
        roomDetail: { data: action.payload || 'Failed to create room' },
        // roomDetail: {data: action.payload, },
      };
    });
    builder.addCase(updateRoom.pending, (state) => {
      return {
        ...state,
        loading: true,
      };
    });
    builder.addCase(updateRoom.fulfilled, (state, action) => {
      const { payload } = action;
      return {
        ...state,
        loading: false,
        roomDetail: payload,
      };
    });
    builder.addCase(updateRoom.rejected, (state) => {
      return {
        ...state,
        loading: false,
      };
    });
  },
});

export { createRoom, updateRoom };
export default RoomSlice.reducer;
