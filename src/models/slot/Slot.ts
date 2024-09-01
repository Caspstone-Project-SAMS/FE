export interface Slot {
  slotID: number;
  slotNumber: number;
  status: number;
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

export interface SlotTypes {
  title: string;
  result: SlotTypeDetail[];
}

export interface SlotTypeDetail {
  slotTypeID: number;
  typeName: string;
  description: string;
  status: number;
  sessionCount: number;
  slots: Slot[];
}
