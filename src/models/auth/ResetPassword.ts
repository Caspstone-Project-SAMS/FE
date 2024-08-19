export interface AuthFailMessage {
    data: {
      data: {
        data: {
          title: string;
          errors: string[];
        };
      };
    };
  }

  export interface AuthSuccessMessage {
    title: string;
    result: {
      displayName: string;
      address: string;
      dob: string;
      avatar: string;
      deleted: boolean;
      isActivated: boolean;
      createdBy: string;
      createdAt: string;
      roleID: number;
      role: null;
      studentID: null;
      student: null;
      enrolledClasses: [];
      studentClasses: [];
      employeeID: string;
      employee: null;
      managedClasses: [];
      notifications: [];
      attendances: [];
      substituteTeachings: [];
      assignedTeachings: [];
      importSchedulesRecords: [];
      id: string;
      userName: string;
      normalizedUserName: string;
      email: string;
      normalizedEmail: string;
      emailConfirmed: boolean;
      passwordHash: string;
      securityStamp: string;
      concurrencyStamp: string;
      phoneNumber: string;
      phoneNumberConfirmed: boolean;
      twoFactorEnabled: boolean;
      lockoutEnd: null;
      lockoutEnabled: boolean;
      accessFailedCount: number;
    }
  }