export interface Module {
    isSuccess: boolean;
    title: string;
    errors?: null;
    result: ModuleDetail[]
}

export interface ModuleDetail {
    moduleID: number;
    status: number;
    mode: number;
    key: string;
    autoPrepare: boolean;
    preparedMinBeforeSlot?: null;
    preparedTime?: null;
    autoReset: boolean;
    resetMinAfterSlot?: null;
    resetTime?: null;
    employeeID: string;
    employee: Employee;
    createdBy?: string;
    createdAt: string;
    isDeleted: boolean;
}

interface Employee {
    employeeID: string;
    department: string;
    modules?: [];
    createdBy?: string;
    createdAt: string;
    isDeleted: boolean;
}