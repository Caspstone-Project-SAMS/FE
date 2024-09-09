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

export interface NotificationDetails {
  result: {
    notificationID: number;
    title: string;
    description: string;
    timeStamp: string;
    read: boolean;
    moduleId: number;
    moduleActivityId: number;
    scheduleID: number;
    notificationType: NotificationType;
    user: null;
  };
}

interface NotificationType {
  notificationTypeID: number;
  typeName: string;
  typeDescription: string;
  notifications: [];
}
