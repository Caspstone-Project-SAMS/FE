export interface DataType {
  key: React.Key;
  day: string;
  subject: string;
  room: string;
  slot: number;
  classcode: string;
  specialized: string;
  groupsize: number;
}

export interface ExcelClassList {
  classCode: string;
  studentCode: string;
}

export interface ClassMessage {
  data: {
    data: {
      data: {
        isSuccess?: boolean;
        title?: string;
        errors?: string[];
        result?: null;
      };
      status: boolean;
    };
  };
}

export interface ClassFail {
  data: {
    data: {
      data: {
        title: string;
        errors: string[];
      };
    };
  };
}

export interface Class {
  title: string;
  result: ClassDetails[];
}

export interface ClassDetails {
  classID: number;
  classCode: string;
  classStatus: boolean;
  semester: Semester;
  room: Room;
  subject: Subject;
  lecturer: Lecturer;
  students: Student[];
  schedules: Schedule[];
}
export interface ClassDetail {
  result: {
    classID: number;
    classCode: string;
    classStatus: boolean;
    semester: Semester;
    room: Room;
    subject: Subject;
    lecturer: Lecturer;
    students: Student[];
    schedules: Schedule[];
  };
}

export interface Semester {
  semesterID: number;
  semesterCode: string;
  semesterStatus: boolean;
  startDate: string;
  endDate: string;
}
export interface Room {
  roomID: number;
  roomName: string;
  roomDescription: string;
  roomStatus: boolean;
}

export interface Subject {
  subjectID: number;
  subjectCode: string;
  subjectName: string;
  subjectStatus: number;
}
export interface Lecturer {
  id: string;
  displayName: string;
  avatar: string;
  email: string;
  department: string;
}

export interface Student {
  id: string;
  displayName: string;
  avatar: string;
  email: string;
  studentCode: string;
  absencePercentage: number;
}

export interface Schedule {
  scheduleID: number;
  date: string;
  dateOfWeek: number;
  scheduleStatus: boolean;
  slot: null;
}
