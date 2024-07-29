export interface Schedule {
  classCode: string;
  date: string;
  startTime: string;
  endTime: string;
  roomName: string;
  scheduleID: number;
  slotNumber: number;
  subjectCode: string;
}

export interface Schedules {
  result: {
    scheduleID: number;
    date: string;
    dateOfWeek: number;
    scheduleStatus: boolean;
    slot: Slot;
    class: Class;
    room: null;
  }
}

export interface Slot {
  slotID: number;
  slotNumber: number;
  status: boolean;
  order: number;
  startTime: string;
  endtime: string;
}

export interface Class {
  classID: number;
  classCode: string;
  classStatus: boolean;
}