export interface Module {
  isSuccess: boolean;
  title: string;
  errors?: string;
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
    connectionLifeTimeSeconds?: number;
    connectionSound: boolean;
    connectionSoundDurationMs: number;
    attendanceSound: boolean;
    attendanceSoundDurationMs: number;
    attendanceDurationMinutes: number;
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

export interface ModuleActivityBySchedule {
  title: string;
  result: ModuleActivity[];
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
  userId: string;
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
  isSuccess: boolean;
  errors: [];
  preparationTask: PrepareTask | null;
  module: ModuleBySchedule;
}

interface PrepareTask {
  progress: number;
  preparedScheduleId: number;
  preparedSchedules: preparedSchedule[];
  totalFingers: number;
  uploadedFingers: number;
}

export interface preparedSchedule {
  scheduleId: number;
  totalFingers: number;
  uploadedFingers: number;
}

export interface ModuleBySchedule {
  moduleID: number;
  status: number;
  connectionStatus?: boolean;
  mode: number;
  autoPrepare: boolean;
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
      Errors: string;
      errors: string;
    };
  };
}

export interface ModuleActivityByID {
  result: ModuleActivity;
}