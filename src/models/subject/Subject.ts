export interface Subject {
  subjectID?: number;
  subjectCode?: string;
  subjectName?: string;
  subjectStatus?: boolean;
  createBy?: string;
}

export interface SubjectMessage {
  isSuccess?: boolean;
  title?: string;
  errors?: string[];
  result?: SubjectDetail;
}

interface SubjectDetail {
  subjectID?: number;
  subjectCode?: string;
  subjectName?: string;
}
