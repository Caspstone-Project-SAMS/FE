export interface Employee {
  title: string;
  result: EmployeeDetail[];
}

export interface EmployeeDetail {
  id: string;
  employeeID: string;
  displayName: string;
  address: string;
  dob: string;
  avatar: string;
  email: string;
  phoneNumber: string;
  department: string;
  role: Role;
  managedClasses: ManageClass[];
  modules: [];
}

export interface EmployeeDetails {
  result: {
    id: string;
    employeeID: string;
    displayName: string;
    address: string;
    dob: string;
    avatar: string;
    email: string;
    phoneNumber: string;
    department: string;
    role: Role;
    managedClasses: ManageClass[];
    modules: ManageModule[];
  };
}

export interface Role {
  roleId: number;
  name: string;
  normalizedName: string;
}

export interface ManageClass {
  classID: number;
  classCode: string;
  classStatus: number;
  semesterCode: string;
  subjectCode: string;
  roomName: string;
}

export interface ManageModule {
  moduleID: number;
  status: boolean;
  mode: number;
  autoPrepare: boolean;
  preparedMinBeforeSlot?: string;
  preparedTime: string;
  autoReset: boolean;
  resetMinAfterSlot?: string;
  resetTime?: string;
}

export interface EmployeeMessage {
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
