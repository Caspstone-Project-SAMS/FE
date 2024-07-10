export interface Semester {
  semesterID: number;
  semesterCode: string;
  semesterStatus: boolean;
  startDate: string;
  endDate: string;
}

export interface SemesterMessage {
  isSuccess?: boolean;
  title?: string;
  errors?: string[];
  result?: SemesterDetail;
}

interface SemesterDetail {
  semesterID: number;
  semesterCode: string;
  semesterStatus: number;
  startDate: string;
  endDate: string;
}
