export interface UserInfo {
  // Success
  token?: string;
  result?: UserDetail;
  // Error
  isSuccess?: boolean;
  title?: string;
  errors?: string[];
}

export interface UserDetail {
  id: string;
  email?: string;
  employeeID: string;
  normalizedEmail?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: string;
  twoFactorEnabled: string;
  lockoutEnd?: string;
  lockoutEnabled: string;
  filePath?: string;
  address?: string;
  dob: string;
  displayName?: string;
  role: Role;
  createdBy?: string;
  createdAt: Date;
  avatar?: string;
  gender?: number;
  firstName: string;
  lastName: string;
  studentID: string;
}

interface Role {
  id: string;
  name?: string;
  createdBy?: string;
  createdAt: Date;
}

// export interface UserInfo {
//     Id: number;
//     FirstName: string,
//     LastName: string,
//     FullName: string,
//     PrimaryEmail: string;
//     SecondaryEmail?: string;
//     PrimaryPhone: string;
//     SecondaryPhone?: string;
//     Address: boolean;
//     DOB: Date;
//     IsActive: boolean;
//     Avatar: string;
//     CreateAt: string;
//     Role: string;
// }
