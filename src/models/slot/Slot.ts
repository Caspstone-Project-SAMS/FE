export interface Slot {
  slotID: number;
  slotNumber: number;
  status: boolean;
  order: number;
  startTime: string;
  endtime: string;
}

export interface SlotDetail {
  result: {
    slotID: number;
    slotNumber: number;
    status: boolean;
    order: number;
    startTime: string;
    endtime: string;
  };
}
