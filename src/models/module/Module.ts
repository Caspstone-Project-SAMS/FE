export interface Module {
  isSuccess: boolean;
  title: string;
  errors?: null;
  result: ModuleDetail[];
}

export interface ModuleByID {
  result: {
    moduleID: number;
    status: number;
    mode: number;
    key: string;
    autoPrepare: boolean;
    preparedMinBeforeSlot?: null;
    preparedTime?: null;
    autoReset: boolean;
    resetMinAfterSlot?: null;
    resetMinBeforeSlot?: null;
    resetTime?: null;
    employeeID: string;
    employee: Employee;
    moduleActivities: ModuleActivity[];
    createdBy?: string;
    createdAt: string;
    isDeleted: boolean;
    connectionStatus: number;
  };
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
  connectionStatus: number;
}

interface Employee {
  userID: string;
  employeeID: string;
  displayName: string;
  avatar: string;
  email?: string;
  phoneNumber: string;
  department: string;
  modules?: [];
  createdBy?: string;
  createdAt: string;
  isDeleted: boolean;
}

export interface ModuleActivity {
  moduleActivityId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  errors: [];
  preparationTask: PrepareTask;
}

interface PrepareTask{
  progress: number;
  preparedScheduleId: number;
  preparedSchedules: [];
  totalFingers: number,
  uploadedFingers: number,
}

export interface ActiveModule {
  StatusCode: number;
  Title: string;
  title: string;
  result: {
    sessionId: number;
  };
  Errors: string;
}

export interface ActiveModuleFail {
  data: {
    error: {
      title: string;
    };
  };
}
