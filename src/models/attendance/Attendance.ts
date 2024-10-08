//Chua chot kieu du lieu
// https://drive.google.com/uc?id=

export interface Attendance {
  studentID?: string;
  attendanceStatus?: number;
  email?: null;
  avatar?: string;
  image?: string;
  studentCode?: string;
  studentName?: string;
  isAuthenticated: boolean;
  comments?: string;
}

export interface UpdateListAttendance {
  scheduleID: number;
  attendanceStatus: number;
  attendanceTime: string; //ISO string format
  studentID: string;
  comments?: string;
}
