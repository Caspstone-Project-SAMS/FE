export interface PreviewScheduleImage {
  userID: string;
  semesterID: number;
  year: number;
  datesCount: number;
  slotsCount: number;
  dates: Dates[];
  //   slots:
}

interface Dates {
  dateString: string;
  date: string;
  vertex_X: number;
}

// interface
