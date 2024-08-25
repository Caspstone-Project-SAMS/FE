export interface Subject {
  subjectID?: number;
  subjectCode?: string;
  subjectName?: string;
  subjectStatus?: boolean;
  createBy?: string;
}

export interface SubjectMessage {
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

interface SubjectDetail {
  subjectID?: number;
  subjectCode?: string;
  subjectName?: string;
}
