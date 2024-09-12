export interface Student {
  userID?: string;
  email?: string;
  studentID?: string;
  studentName?: string;
  studentCode?: string;
  avatar?: string;
  isAuthenticated?: boolean;
  absencePercentage?: number;
  phoneNumber?: string
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
  description: string;
  createdAt: string;
  fingerNumber: number;
}

export interface EnrolledClasses {
  classID: number;
  classCode: string;
  classStatus: number;
  absencePercentage: number;
}

export interface StudentFail {
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
