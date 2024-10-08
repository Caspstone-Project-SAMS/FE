export interface CustomEvent {
  //rbc default
  id: number;
  title: string;
  start: Date;
  end: Date;
  month?: Date;
  //custom
  des?: string;
  slot?: string;
  status?: 'past' | 'current' | 'future';
  room?: string;
  classCode?: string;
  scheduleID?: number;
  subjectCode?: string;
}
