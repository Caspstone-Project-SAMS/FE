export interface StudentAttendance {
    title: string;
    result: AttendanceDetail[];
}

export interface AttendanceDetail {
    attendanceID: number;
    attendanceStatus: boolean;
    date: string;
    comments: string;
    student: Student;
    class: Class;
    slot: Slot;
    room: Room;
}

export interface Student {
    id: string;
    displayName: string;
    avatar: string;
    email: string;
    studentCode: string;
}

export interface Class {
    classID: number;
    classCode: string;
    classStatus: boolean;
}

export interface Slot {
    slotID: number;
    slotNumber: number;
    status: boolean;
    order: number;
    startTime: string;
    endTime: string;
}

export interface Room {
    roomID: number;
    roomName: string;
    roomDescription: string;
    roomStatus: boolean;
}