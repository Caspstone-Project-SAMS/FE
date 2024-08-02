export interface ScheduleImage {
    title: string;
    result: ScheduleData;
}

export interface ScheduleData {
    year: number;
    datesCount: number;
    slotsCount: number;
    dates: ScheduleDate[];
    slots: ScheduleSlot[];
}

export interface ScheduleDate {
    dateString: string;
    date: string;
    vertex_X: number;
}

export interface ScheduleSlot {
    slotNumber: number;
    slotOrder: number;
    vertex_Y: number;
    classSlots: [];
    adjustedClassSlots: ScheduleClassSlot[];
}

export interface ScheduleClassSlot {
    classCode: string;
    vertex_X: number;
    recommendations: Recomment[];
}

export interface Recomment {
    classCode: string;
    suggestRate: number;
    correctCount: number;
}