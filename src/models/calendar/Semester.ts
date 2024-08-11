export interface Semester {
  semesterID: number;
  semesterCode: string;
  semesterStatus: number;
  startDate: string;
  endDate: string;
}

export interface SemesterMessage {
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

export interface SemesterDetail {
  result: {
    semesterID: number;
    semesterCode: string;
    semesterStatus: number;
    startDate: string;
    endDate: string;
    classes: SemesterClass[]
  }
}

export interface SemesterClass {
  classID: number;
  classCode: string;
  classStatus: boolean;
}