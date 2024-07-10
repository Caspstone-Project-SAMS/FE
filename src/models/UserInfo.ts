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
  normalizedEmail?: string;
  emailConfirmed: boolean;
  phoneNumber?: string;
  phoneNumberConfirmed: string;
  twoFactorEnabled: string;
  lockoutEnd?: string;
  lockoutEnabled: string;
  filePath?: string;
  displayName?: string;
  role: Role;
  createdBy?: string;
  createdAt: Date;
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
