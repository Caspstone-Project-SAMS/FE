export interface Employee {
    title: string;
    result: EmployeeDetail [];
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
    managedClasses: [],
    modules: [];
}

export interface Role {
    roleId: number;
    name: string;
    normalizedName: string;
}