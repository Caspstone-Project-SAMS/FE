export interface ScheduleImageResponse {
  isSuccess: boolean;
  title: string;
  errors: string[];
  importedEntities: Entity[];
  errorEntities: ErrorEntity[];
}

interface Entity {
  scheduleID: number;
  date: string;
  dateOfWeek: number;
  scheduleStatus: number;
  slotNumber: number;
  classCode: string;
}

interface ErrorEntity {
  errorEntity: Entity;
  errors: string[];
}
