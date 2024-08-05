import axios, { AxiosError } from 'axios';
import { ROOM_API } from '.';
import { Room } from '../models/room/Room';
import { isRejectedWithValue } from '@reduxjs/toolkit';

const getAllRoom = async (): Promise<Room[] | null> => {
  try {
    const response = await axios.get(ROOM_API);

    return response.data as Room[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const createRoom = async (
  RoomName: string,
  RoomDescription: string,
  RoomStatus: number,
  // CreateBy: string,
) => {
  try {
    const response = await axios.post(
      ROOM_API,
      {
        RoomName,
        RoomDescription,
        RoomStatus,
        // CreateBy,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("abc", error.message)
      throw new AxiosError(error.response)
    }
    return isRejectedWithValue(error.message)
  }
};

const updateRoom = async (
  RoomName: string,
  RoomDescription: string,
  RoomStatus: number,
  // CreateBy: string,
  roomID: number,
) => {
  try {
    const response = await axios.put(
      `${ROOM_API}?id=${roomID}`,
      {
        RoomName,
        RoomDescription,
        RoomStatus,
        // CreateBy,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("abc", error.message)
      throw new AxiosError(error.response)
    }
    return isRejectedWithValue(error.message)
  }
};

const deleteRoom = async (roomID: number) => {
  try {
    const response = await axios.delete(ROOM_API + '/' + roomID);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error on delete Room: ', error);
    return null;
  }
};

export const RoomService = {
  getAllRoom,
  createRoom,
  updateRoom,
  deleteRoom,
};
