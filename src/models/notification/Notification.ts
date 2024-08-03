export interface Notification {
    title: string;
    result: NotificationList[];
}

export interface NotificationList {
    notificationID: number;
    title: string;
    description: string;
    timeStamp: string;
    read: boolean;
    notificationType: NotificationType;
    user: null;
}

interface NotificationType {
    notificationTypeID: number;
    typeName: string;
    typeDescription: string;
}