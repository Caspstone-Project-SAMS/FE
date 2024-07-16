export interface DataType {
  key: React.Key;
  day: string;
  subject: string;
  room: string;
  slot: number;
  classcode: string;
  specialized: string;
  groupsize: number;
}

export interface ExcelClassList {
  classCode: string;
  studentCode: string;
}
