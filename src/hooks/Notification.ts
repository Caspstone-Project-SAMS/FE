import axios from 'axios';
import { NOTIFICATION_API } from '.';
import { Notification } from '../models/notification/Notification';

const getAllNotification = async (
  userId: string,
): Promise<Notification | null> => {
  try {
    const response = await axios.get(NOTIFICATION_API, {
      params: {
        userId,
      },
    });

    return response.data as Notification;
  } catch (error) {
    console.log('Error on get Notification: ', error);
    return null;
  }
};

const getAllNotificationByID = async (
  notificationID: number,
): Promise<Notification | null> => {
  try {
    const response = await axios.get(`${NOTIFICATION_API}/${notificationID}`);

    return response.data as Notification;
  } catch (error) {
    console.log('Error on get Notification by ID: ', error);
    return null;
  }
};

export const NotificationService = {
  getAllNotification,
  getAllNotificationByID,
};
