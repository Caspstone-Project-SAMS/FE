export interface UserInfo {
    Id: number;
    FirstName: string,
    LastName: string,
    FullName: string,
    PrimaryEmail: string;
    SecondaryEmail?: string;
    PrimaryPhone: string;
    SecondaryPhone?: string;
    Address: boolean;
    DOB: Date;
    IsActive: boolean;
    Avatar: string;
    CreateAt: string;
    Role: string;
}
