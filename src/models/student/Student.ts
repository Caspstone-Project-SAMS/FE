export interface Student {
  userID?: string;
  studentID?: string;
  studentName?: string;
  studentCode?: string;
  avatar?: string;
  isAuthenticated?: boolean;
  absencePercentage?: number;
}

export interface StudentMessage {
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

export interface StudentDetail {
  result: {
    id: string;
    displayName: string;
    address: string;
    dob: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    studentCode?: string;
    fingerprintTemplates: FingerprintTemplate[];
    enrolledClasses: EnrolledClasses[];
  }
}

export interface FingerprintTemplate {
  fingerprintTemplateID: number;
  status: number;
}

export interface EnrolledClasses {
  classID: number;
  classCode: string;
  classStatus: number;
  absencePercentage: number;
}