import axios, { AxiosError } from 'axios';
import { SLOT_API } from '.';
import { Slot, SlotDetail } from '../models/slot/Slot';
import { isRejectedWithValue } from '@reduxjs/toolkit';

const getAllSlot = async (): Promise<Slot[] | null> => {
  try {
    const response = await axios.get(SLOT_API);

    return response.data as Slot[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getSlotByID = async (slotID: number): Promise<SlotDetail | null> => {
  try {
    const response = await axios.get(`${SLOT_API}/${slotID}`, {
      headers: {
        accept: '*/*',
      },
    });
    return response.data as SlotDetail;
  } catch (error) {
    console.error('Error on get Slot by ID: ', error);
    return null;
  }
};

const getSlotByPage = async (page: number, pageSize?: number) => {
  try {
    const response = await axios.get(`${SLOT_API}`, {
      params: {
        startPage: page,
        endPage: page,
        quantity: pageSize ? pageSize : 35,
      },
    });

    return response.data as Slot[];
  } catch (error) {
    return [];
  }
};

const createSlot = async (
  SlotNumber: number,
  Status: number,
  StartTime: string,
  Endtime: string,
) => {
  try {
    console.log('slotnumber', SlotNumber)
    console.log('Status', Status)
    console.log('StartTime', StartTime)
    console.log('Endtime', Endtime)
    const response = await axios.post(
      SLOT_API,
      {
        SlotNumber,
        Status,
        StartTime,
        Endtime,
      },
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      throw new AxiosError(error.response.data);
    }
    return isRejectedWithValue(error.message);
  }
};

const updateSlot = async (
  SlotID: number,
  SlotNumber: number,
  Status: number,
  StartTime: string,
  Endtime: string
) => {
  try {
    console.log('SlotID', SlotID);
    console.log('SlotNumber', SlotNumber);
    console.log('Status', Status);
    console.log('StartTime', StartTime);
    console.log('Endtime', Endtime);

    const response = await axios.put(
      `${SLOT_API}/${SlotID}`,
      {
        SlotNumber,
        Status,
        StartTime,
        Endtime,
      },
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Axios Error:', error.response.data);
      throw new AxiosError(error.response.data);
    } else {
      console.error('Unexpected Error:', error.message);
      throw new Error(error.message);
    }
  }
};

const deleteSlot = async (slotID: number) => {
  try {
    const response = await axios.delete(`${SLOT_API}/${slotID}`, {
      headers: {
        accept: '*/*',
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Error:', error.message);
      throw new AxiosError(error.response.data);
    } else {
      console.error('Error:', error.message);
      throw new Error(error.message);
    }
  }
};

export const SlotService = {
  getAllSlot,
  getSlotByID,
  getSlotByPage,
  createSlot,
  updateSlot,
  deleteSlot,
};
