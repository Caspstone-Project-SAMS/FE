import { Button, Card, Col, Input, Layout, message, Row, Table } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './Notification.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import {
  clearScriptMessages,
  resgisterAllFingerprint,
} from '../../redux/slice/Script';
import { NotificationService } from '../../hooks/Notification';
import {
  NotificationDetails,
  NotificationList,
  Notification as Notifications,
} from '../../models/notification/Notification';

const { Header: AntHeader } = Layout;

const Notification: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [notificationId, setNotificationId] = useState(0);
  const [notification, setNotification] = useState<
    NotificationDetails | undefined
  >();
  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  useEffect(() => {
    if (location.state && location.state.notificationId) {
      setNotificationId(location.state.notificationId);
    }
  }, [location.state]);

  useEffect(() => {
    if (notificationId) {
      const response =
        NotificationService.getAllNotificationByID(notificationId);
      response
        .then((response) =>
          setNotification(response as NotificationDetails | undefined),
        )
        .catch((error) => message.error(error.message));
    }
  }, [notificationId]);

  const notificationDetails = [
    { title: 'Title', value: notification?.result.title },
    { title: 'Description', value: notification?.result.description },
    { title: 'Time', value: notification?.result.timeStamp },
  ];

  return (
    <Content className={styles.accountScriptContent}>
      <ContentHeader
        contentTitle="Notification"
        previousBreadcrumb={''}
        currentBreadcrumb={'Notification Detail'}
        key={''}
      />
      <Card>
        {notificationDetails.map((notification, i) => (
          <div key={i}>
            <p>{notification.value}</p>
          </div>
        ))}
      </Card>
    </Content>
  );
};

export default Notification;
