export interface FormatResponse {
  status: boolean;
  data: string;
  errors: string[];
}

export interface ScheduleResponse {
  isSuccess: boolean;
  title: string;
  errors?: string[];
  result?: string[];
}
