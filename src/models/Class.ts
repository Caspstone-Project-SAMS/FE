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
  result: ClassDetail[];
}

export interface ClassDetail {
  classID: number;
  classCode: string;
  classStatus: boolean;
  semester: Semester;
  room: string;
  subject: string;
  lecturer: Lecturer;
  students: [];
  schedules: [];
}

export interface Semester {
  semesterID: number;
  semesterCode: string;
  semesterStatus: boolean;
  startDate: string;
  endDate: string;
}

export interface Lecturer {
  id: string;
  displayName: string;
  avatar: string;
  email: string;
  department: string;
}
