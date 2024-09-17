export interface Semester {
  semesterID: number | null;
  semesterCode: string;
  semesterStatus: number; //1-Future, 2-On going, 3-Past
  startDate: string;
  endDate: string;
}

export interface SemesterMessage {
  data: {
    data: {
      isSuccess?: boolean;
      title?: string;
      errors?: string[];
      result?: null;
    };
    status: boolean;
  };
  isSuccess?: boolean;
  title?: string;
  errors?: string[];
}

export interface SlotMessage {
  data: {
    data: {
      isSuccess?: boolean;
      title?: string;
      errors?: string[];
      result?: null;
    };
    status: boolean;
  };
  isSuccess?: boolean;
  title?: string;
  errors?: string[];
}

export interface SemesterDetail {
  result: {
    semesterID: number;
    semesterCode: string;
    semesterStatus: number;
    startDate: string;
    endDate: string;
    classes: SemesterClass[];
  };
}

export interface SemesterClass {
  classID: number;
  classCode: string;
  classStatus: boolean;
}
