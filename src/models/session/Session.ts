export interface Session {
  sessionId: number;
  userID: string;
  category: number;
  timeStamp: string;
  sessionState: number;
  durationInMin: number;
  moduleId: number;
  title: string;
  fingerRegistration: null;
  fingerUpdate: null;
  prepareAttendance: {
    preparedSchedules: [];
    preparedDate: null;
    scheduleId: number;
    progress: number;
    totalWorkAmount: number;
    completedWorkAmount: number;
    totalFingers: number;
  };
  errors: [];
}
