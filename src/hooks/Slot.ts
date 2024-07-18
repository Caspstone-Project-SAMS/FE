import axios from 'axios';
import { SLOT_API } from '.';
import { Slot, SlotDetail } from '../models/slot/Slot';

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
        'accept': '*/*'
      }
    });
    return response.data as SlotDetail;
  } catch (error) {
    console.error('Error on get Slot by ID: ', error);
    return null;
  }
};

export const SlotService = {
  getAllSlot,
  getSlotByID
};
