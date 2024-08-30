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
    slotID: number;
    slot: Slot;
    classID: number;
    class: Class;
    room: null;
  }
}
export interface Scheduless {
  title: string;
  result: ScheduleResult[];
}

export interface ScheduleResult {
  scheduleID: number;
  date: string;
  dateOfWeek: number;
  scheduleStatus: boolean;
  slotID: number;
  slot: Slot;
  classID: number;
  class: Class;
  room: null;
  uploaded: number;
  total: number;
}

export interface Slot {
  slotID: number;
  slotNumber: number;
  status: boolean;
  order: number;
  startTime: string;
  endtime: string;
  schedules: [];
  createdBy: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface Class {
  classID: number;
  classCode: string;
  classStatus: boolean;
  roomID: number;
  subjectID: number;
}

export interface ScheduleRecord {
  title: string;
  result: ScheduleRecordResult[];
  errors: string[];
}

export interface ScheduleRecordResult {
  importSchedulesRecordID: number;
  title: string;
  recordTimestamp: string;
  importReverted: boolean;
  isReversible: boolean;
  user: ScheduleRecordUser[];
}

export interface ScheduleRecordUser {
  id: string;
  displayName: string;
  avatar: string;
  email: string;
}