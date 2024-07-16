import axios from 'axios';
import { SLOT_API } from '.';
import { Slot } from '../models/slot/Slot';

const getAllSlot = async (): Promise<Slot[] | null> => {
  try {
    const response = await axios.get(SLOT_API);

    return response.data as Slot[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const SlotService = {
  getAllSlot,
};
