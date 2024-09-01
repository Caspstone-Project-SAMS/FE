export interface System {
  title: string;
  result: {
    systemConfigurationId: number;
    revertableDurationInHours: number;
    classCodeMatchRate: number;
    semesterDurationInDays: number;
    slotDurationInMins: number;
  };
  status: number;
  errors: string[];
}
