import axios, { AxiosError } from 'axios';
import { NOTIFICATION_API } from '.';
import { Notification, NotificationDetails } from '../models/notification/Notification';

const getAllNotification = async (
  userId: string,
): Promise<Notification | null> => {
  try {
    const response = await axios.get(NOTIFICATION_API, {
      params: {
        userId,
        startPage:1,
        endPage:10,
        quantity:10,
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
): Promise<NotificationDetails | null> => {
  try {
    const response = await axios.get(`${NOTIFICATION_API}/${notificationID}`);

    return response.data as NotificationDetails;
  } catch (error) {
    console.log('Error on get Notification by ID: ', error);
    return null;
  }
};

const readNotification = async (NotificationID: number) => {
  try {
    const response = await axios.put(
      `${NOTIFICATION_API}/read`,
      [NotificationID],
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Axios Error:', error.response.data);
      throw new AxiosError(error.response.data);
    } else {
      console.error('Unexpected Error:', error.message);
      throw new Error(error.message);
    }
  }
};


export const NotificationService = {
  getAllNotification,
  getAllNotificationByID,
  readNotification,
};
