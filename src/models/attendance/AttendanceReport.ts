export interface AttendanceReport {
  studentCode: string;
  studentName: string;
  absencePercentage: number;
  attendanceRecords: AttendanceRecord[];
}

export interface AttendanceRecord {
  date: string;
  slotNumber: number;
  status: number;
}
