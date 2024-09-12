import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  Typography,
  Avatar,
  Badge,
  Layout,
  Dropdown,
  Menu,
  MenuProps,
  Empty,
  Progress,
  notification as AntNotification,
  Table,
} from 'antd';
import './Header.css';
import styles from '../header/contentHeader/index.module.less';
import {
  IoIosArrowDown,
  IoIosInformationCircle,
  IoIosCloseCircleOutline,
  IoIosWarning,
  IoMdClose,
  IoIosCloseCircle,
  IoIosArrowRoundBack,
  IoIosInformation,
} from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { UserInfo } from '../../models/UserInfo';
import { logout } from '../../redux/slice/Auth';
import NotificationItem from './contentHeader/NotificationItem';
import { PiBellBold } from 'react-icons/pi';
import { HelperService } from '../../hooks/helpers/helperFunc';
import { NotificationService } from '../../hooks/Notification';
import { NotificationList } from '../../models/notification/Notification';
import HeaderProgress from './HeaderProgress';
import { useNavigate } from 'react-router-dom';
import { ModuleService } from '../../hooks/Module';
import {
  ModuleActivityByID,
  preparedSchedule,
} from '../../models/module/Module';
import { CalendarService } from '../../hooks/Calendar';
import { ScheduleResult, Schedules } from '../../models/calendar/Schedule';

const { Header: AntHeader } = Layout;

const { Title, Text } = Typography;

const UserList = ['SAMS'];
const ColorList = [
  '#f56a00', //orange
  '#7265e6',
  '#ffbf00',
  '#00a2ae',
];

type FilterNotiFication = 'all' | 'today' | 'past';

interface PreparationProgress {
  SessionId: number;
  Progress: number;
}

interface HeadersProps {
  handleNavigateScript: () => void;
  handleNavigateHome: () => void;
  closeWebsocket: () => void;
  // notificationss: number;
  preparationProgress?: PreparationProgress | null;
  NotificationId: number;
  setNotificationId: (NotificationId: number) => void;
}

interface NotificationListt {
  notificationID: number;
  title: string;
  description: string;
  timeStamp: string;
  read: boolean;
  moduleId: number;
  moduleActivityId: number;
  scheduleID: number;
  notificationType: NotificationTypee;
  user: null;
}

interface NotificationTypee {
  notificationTypeID: number;
  typeName: string;
  typeDescription: string;
  notifications: [];
}

const Headers: React.FC<HeadersProps> = ({
  handleNavigateScript,
  handleNavigateHome,
  closeWebsocket,
  // notificationss,
  preparationProgress,
  NotificationId,
  setNotificationId,
}) => {
  const userID = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id,
  );
  const [notification, setNotification] = useState<NotificationList[]>([]);
  const [onFilterNoti, setOnFilterNoti] = useState<FilterNotiFication>('all');
  const [onOpen, setOnOpen] = useState<boolean>(false);
  const [newNotificaton, setNewNotificaton] = useState<NotificationListt>();
  const [readNotificationsCount, setReadNotificationsCount] = useState(0);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationListt | null>(null);

  const [moduleActivity, setModuleActivity] =
    useState<ModuleActivityByID | null>();

  const [scheduleList, setScheduleList] = useState<
    ScheduleResult[] | undefined
  >([]);
  const [schedule, setSchedule] = useState<Schedules | undefined>();

  const userDetail: UserInfo | undefined = useSelector(
    (state: RootState) => state.auth.userDetail,
  );

  const user = useSelector((state: RootState) => state.auth.data);
  const name = user?.result?.displayName;
  const avatar = user?.result?.avatar;
  const [reload, setReload] = useState(0);
  const [read, setRead] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    closeWebsocket();
  };

  const handleChangeFilter = (change: FilterNotiFication) => {
    setOnFilterNoti(change);
  };

  // const handleReadNotification = async (
  //   NotificationID: number,
  //   moduleActivityID: number,
  //   scheduleID: number,
  // ) => {

  //   try {
  //     setScheduleList(undefined);
  //     setSchedule(undefined);
  //     setModuleActivity(null);
  //     setSelectedNotification(null)
  //     const response = await NotificationService.readNotification(
  //       NotificationID,
  //     );
  //     setRead(true);
  //     setReload((prev) => prev + 1);
  //     setDropdownVisible(true);
  //     const notificationDetail = notification.find(
  //       (n) => n.notificationID === NotificationID,
  //     );
  //     setSelectedNotification(notificationDetail || null);
  //     if (moduleActivityID) {
  //       const moduleActivities = await ModuleService.getModuleActivityByID(
  //         moduleActivityID,
  //       );
  //       setModuleActivity(moduleActivities || null);
  //       if (
  //         moduleActivities?.result?.preparationTask?.preparedSchedules &&
  //         moduleActivities.result.preparationTask.preparedSchedules.length > 0
  //       ) {
  //         setSchedule(undefined);
  //         getAllSchedule(
  //           moduleActivities.result.preparationTask.preparedSchedules,
  //         );
  //       } else if (
  //         moduleActivities?.result?.preparationTask?.preparedScheduleId
  //       ) {
  //         setScheduleList(undefined);
  //         getScheduleByID(
  //           moduleActivities.result.preparationTask.preparedScheduleId,
  //         );
  //       } else if (scheduleID) {
  //         console.log('schedule id: ', scheduleID);
  //         setScheduleList(undefined);
  //         getScheduleByID(scheduleID);
  //       }
  //     }
  //     return response;
  //   } catch (error) {
  //     console.log('Error on read notification: ', error);
  //   }
  // };

  const handleReadNotification = async (
    NotificationID: number,
    moduleActivityID: number,
    scheduleID: number,
  ) => {
    console.log(moduleActivityID);
    try {
      // Reset states before processing
      setScheduleList(undefined);
      setSchedule(undefined);
      setModuleActivity(null);
      setSelectedNotification(null);

      // Mark the notification as read
      const response = await NotificationService.readNotification(
        NotificationID,
      );
      setRead(true);
      setReload((prev) => prev + 1);
      setDropdownVisible(true);

      // Find the notification details
      const notificationDetail = notification.find(
        (n) => n.notificationID === NotificationID,
      );
      setSelectedNotification(notificationDetail || null);

      // Process module activities if moduleActivityID exists
      if (moduleActivityID) {
        const moduleActivities = await ModuleService.getModuleActivityByID(
          moduleActivityID,
        );
        setModuleActivity(moduleActivities || null);

        // Check for prepared schedules
        const preparedSchedules =
          moduleActivities?.result?.preparationTask?.preparedSchedules;
        const preparedScheduleId =
          moduleActivities?.result?.preparationTask?.preparedScheduleId;

        if (preparedSchedules && preparedSchedules.length > 0) {
          // If prepared schedules exist, fetch all schedules
          setSchedule(undefined);
          getAllSchedule(preparedSchedules);
        } else if (preparedScheduleId) {
          // If a single preparedScheduleId exists, fetch by ID
          setScheduleList(undefined);
          getScheduleByID(preparedScheduleId);
        } else if (scheduleID) {
          // If no prepared schedules, check scheduleID as fallback
          console.log('schedule id: ', scheduleID);
          setScheduleList(undefined);
          getScheduleByID(scheduleID);
        }
      } else if (scheduleID) {
        // Handle case where there's no moduleActivityID but scheduleID exists
        console.log('schedule id: ', scheduleID);
        setScheduleList(undefined);
        getScheduleByID(scheduleID);
      }

      return response;
    } catch (error) {
      console.log('Error on read notification: ', error);
    }
  };

  const handleMoreDetail = (
    moduleId: number | null,
    moduleActivityId: number | null,
    scheduleId: number | null,
  ) => {
    if (scheduleId !== null) {
      // navigate('/')
    } else if (moduleId !== null) {
      navigate(`/module/module-detail`, {
        state: {
          moduleActivityID: moduleActivityId,
          moduleID: moduleId,
          key: '3',
        },
      });
    }
  };

  const getAllSchedule = async (schedules: preparedSchedule[]) => {
    if (userID !== '') {
      const scheduleIds =
        schedules.length === 0 ? [0] : schedules.map((s) => s.scheduleId);
      const response = await CalendarService.getAllSchedule(
        userID?.toString() || '',
        scheduleIds,
      );
      const result = response?.result || [];

      result.forEach((s) => {
        const schedule = schedules.filter(
          (s1) => s1.scheduleId === s.scheduleID,
        )[0];
        s.total = schedule.totalFingers ?? 0;
        s.uploaded = schedule.uploadedFingers ?? 0;
      });
      setScheduleList(result);
    }
  };

  const getScheduleByID = async (scheduleID: number) => {
    try {
      const response = await CalendarService.getScheduleByID(scheduleID);
      setSchedule(response || undefined);
      return response;
    } catch (error) {
      console.log('error on get schedule by id: ', error);
    }
  };

  const handleBackToList = () => {
    setSelectedNotification(null);
  };

  useEffect(() => {
    const response = NotificationService.getAllNotification(userID ?? '');

    response
      .then((data) => {
        setNotification(data?.result || []);
        if (read === false) {
          setNewNotificaton(
            data?.result?.find((n) => n.notificationID === NotificationId),
          );
        }
        setNotificationId(0);
        setReadNotificationsCount(
          data?.result.filter((n) => n.read === false).length || 0,
        );
        setRead(false);
      })
      .catch((error) => {
        console.log('get notification error: ', error);
      });
  }, [userID, NotificationId, reload]);

  useEffect(() => {
    if (newNotificaton) {
      let descriptionColor = 'inherit';

      if (newNotificaton.notificationType.typeName === 'Information') {
        descriptionColor = 'green';
      } else if (newNotificaton.notificationType.typeName === 'Error') {
        descriptionColor = 'red';
      } else if (newNotificaton.notificationType.typeName === 'Warning') {
        descriptionColor = 'orange';
      }
      AntNotification.open({
        message: newNotificaton.title,
        description: (
          <span style={{ color: descriptionColor }}>
            {newNotificaton.description}
          </span>
        ),
        icon:
          newNotificaton.notificationType.typeName === 'Information' ? (
            <IoIosInformationCircle style={{ color: 'green' }} />
          ) : newNotificaton.notificationType.typeName === 'Error' ? (
            <IoIosCloseCircle style={{ color: 'red' }} />
          ) : newNotificaton.notificationType.typeName === 'Warning' ? (
            <IoIosWarning style={{ color: 'orange' }} />
          ) : null,
        showProgress: true,
        // pauseOnHover: false,
      });
      setNewNotificaton(undefined);
    }
  }, [newNotificaton]);

  const items: MenuProps['items'] = [
    {
      key: '1',
      style: { padding: 0 },
      label: (
        <>
          {(user?.result?.role.name as any === 'Admin') ||
            (user?.result?.role.name as any === 'Lecturer') ? (
              <>
                <Button type="text" onClick={handleNavigateHome}>
                  Home
                </Button>
                <br />
              </>
            ) : null}

          {(user?.result?.role.name as any) === 'Admin' ? (
            <div>
              <Button type="text" onClick={handleNavigateScript}>
                Script
              </Button>
              <br />
            </div>
          ) : null}

          <Button type="text" onClick={handleLogout}>
            Log out
          </Button>
        </>
      ),
    },
  ];

  // useEffect(() => {
  //   // console.log("Changed ", onFilterNoti);
  // }, [onFilterNoti]);

  const reversedNotification = [...notification].reverse();

  const NotificationModuleDetail = [
    { label: 'Title', value: moduleActivity?.result.title },
  ];

  const columns = [
    {
      key: '1',
      title: 'Date',
      dataIndex: 'date',
    },
    {
      key: '2',
      title: 'Slot',
      dataIndex: 'slot',
    },
    {
      key: '3',
      title: 'Time',
      dataIndex: 'time',
    },
    {
      key: '4',
      title: 'Class',
      dataIndex: 'class',
    },
    {
      key: '5',
      title: 'Uploaded Fingerprints',
      dataIndex: 'uploadFingerprints',
    },
  ];

  const CustomDropdownMenu = () => {
    return (
      <>
        {selectedNotification ? (
          <div
            style={{
              backgroundColor: '#f9f9f9',
              padding: 20,
              maxWidth: '40vw',
              height: 'auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'auto',
              msOverflowStyle: 'auto',
              marginRight: 'auto',
              borderRadius: 10,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                  marginLeft: -20,
                }}
                onClick={handleBackToList}
              >
                <IoIosArrowRoundBack size={25} />
              </Button>
              <Button
                style={{
                  border: 'none',
                  boxShadow: 'none',
                  background: 'transparent',
                }}
                type="link"
                onClick={() =>
                  handleMoreDetail(
                    selectedNotification.moduleId,
                    selectedNotification.moduleActivityId,
                    selectedNotification.scheduleID,
                  )
                }
              >
                <p>More Detail</p>
              </Button>
            </div>
            <div className={styles.notiDetailCtn}>
              <Text style={{ fontWeight: 'bold', fontSize: '1rem' }}>
                {selectedNotification.title}
              </Text>
              <Text
                style={{
                  color:
                    selectedNotification.notificationType.typeName ===
                    'Information'
                      ? 'green'
                      : selectedNotification.notificationType.typeName ===
                        'Error'
                      ? 'red'
                      : selectedNotification.notificationType.typeName ===
                        'Warning'
                      ? 'orange'
                      : 'inherit',
                  display: 'block',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {selectedNotification.description}
              </Text>
              <Text className={styles.time}>
                {' ' +
                  new Date(selectedNotification.timeStamp).toLocaleString(
                    'en-GB',
                    {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false,
                    },
                  )}
              </Text>
            </div>
            <div>
              {/* {NotificationModuleDetail.map((item, index) => ( */}
              <>
                {/* <Text style={{ fontSize: '1rem', fontWeight: 500 }}>
                    {item.label}: {item.value}
                  </Text> */}
                <div>
                  {scheduleList !== undefined && (
                    <Table
                      columns={columns}
                      dataSource={scheduleList.map((item1, index) => ({
                        key: index,
                        date: item1.date
                          ? new Date(item1.date).toLocaleDateString('en-GB')
                          : 'N/A',
                        slot: item1.slot.slotNumber || 'N/A',
                        time: (
                          <div>
                            {item1.slot.startTime.slice(0, 5)} -{' '}
                            {item1.slot.endtime.slice(0, 5)}
                          </div>
                        ),
                        class: item1.class.classCode || 'N/A',
                        uploadFingerprints: (
                          <>
                            {item1.uploaded} / {item1.total}
                          </>
                        ),
                      }))}
                      pagination={false}
                    ></Table>
                  )}
                  {schedule !== undefined && (
                    <>
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div style={{ width: '50%' }}>
                          <p>
                            <b>Date:</b> {schedule?.result.date || 'N/A'}
                          </p>
                          <p>
                            <b>Class:</b>{' '}
                            {schedule?.result.class.classCode || 'N/A'}
                          </p>
                        </div>
                        <div style={{ width: '50%' }}>
                          <p>
                            <b>Slot:</b>{' '}
                            {schedule?.result.slot.slotNumber || 'N/A'}
                          </p>
                          <p>
                            <b>Time:</b>{' '}
                            {schedule?.result.slot
                              ? schedule?.result.slot.startTime +
                                '-' +
                                schedule?.result.slot.endtime
                              : 'N/A'}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </>
              {/* ))} */}
            </div>
          </div>
        ) : (
          <div
            style={{
              maxWidth: '30vw',
              height: '60vh',
              overflowY: 'auto',
              overflowX: 'hidden',
              scrollbarWidth: 'auto',
              msOverflowStyle: 'auto',
            }}
          >
            <Menu>
              <div className="notificationFilterCtn">
                <Text style={{ marginRight: '10px', fontSize: '1rem' }}>
                  Notification
                </Text>
                <Menu.SubMenu
                  key="sub1"
                  title={
                    <Text style={{ fontSize: '0.9rem', color: '#64748B' }}>
                      {HelperService.capitalizeFirstLetter(onFilterNoti)}
                    </Text>
                  }
                  style={{ color: '#64748B' }}
                >
                  <Menu.Item
                    key="all"
                    onClick={() => {
                      handleChangeFilter('all');
                    }}
                  >
                    <Text>All</Text>
                  </Menu.Item>
                  <Menu.Item
                    key="today"
                    onClick={() => handleChangeFilter('today')}
                  >
                    <Text>Today</Text>
                  </Menu.Item>
                  <Menu.Item
                    key="past"
                    onClick={() => handleChangeFilter('past')}
                  >
                    <Text>Last 2 weeks</Text>
                  </Menu.Item>
                </Menu.SubMenu>
              </div>
              {notification.length === 0 ? (
                <Empty description={'No Notification found'}></Empty>
              ) : (
                reversedNotification.map((item, index) =>
                  item ? (
                    <React.Fragment key={index}>
                      <Menu.Item
                        key={index}
                        className={`${styles.notiItemCtn} ${
                          item.read
                            ? styles.readNotification
                            : styles.unreadNotification
                        }`}
                        style={{ marginBottom: 5 }}
                        onClick={() =>
                          handleReadNotification(
                            item.notificationID,
                            item.moduleActivityId,
                            item.scheduleID,
                          )
                        }
                      >
                        <div className={styles.notiItemCtn}>
                          <div className={styles.imageCtn}>
                            {/* <Avatar
                          style={{
                            backgroundColor: ColorList[0],
                            verticalAlign: 'middle',
                          }}
                          size="large"
                          gap={4}
                        >
                          SAMS
                        </Avatar> */}
                            <div style={{ marginLeft: 'auto' }}>
                              {item.notificationType.typeName ===
                              'Information' ? (
                                <IoIosInformationCircle
                                  style={{ color: 'green', fontSize: '1.5rem' }}
                                />
                              ) : item.notificationType.typeName === 'Error' ? (
                                <IoIosCloseCircle
                                  style={{ color: 'red', fontSize: '1.5rem' }}
                                />
                              ) : item.notificationType.typeName ===
                                'Warning' ? (
                                <IoIosWarning
                                  style={{
                                    color: 'orange',
                                    fontSize: '1.5rem',
                                  }}
                                />
                              ) : null}
                            </div>
                          </div>
                          <div className={styles.notiDetailCtn}>
                            <div
                              style={{ display: 'flex', alignItems: 'center' }}
                            >
                              <Text
                                style={{ fontWeight: 'bold', fontSize: '1rem' }}
                              >
                                {item.title}
                              </Text>
                              {/* <div style={{ marginLeft: 'auto' }}>
                            {item.notificationType.typeName ===
                            'Information' ? (
                              <IoIosCheckmark
                                style={{ color: 'green', fontSize: '1.5rem' }}
                              />
                            ) : item.notificationType.typeName === 'Error' ? (
                              <IoIosCloseCircleOutline
                                style={{ color: 'red', fontSize: '1.5rem' }}
                              />
                            ) : item.notificationType.typeName === 'Warning' ? (
                              <IoIosWarning
                                style={{ color: 'orange', fontSize: '1.5rem' }}
                              />
                            ) : null}
                          </div> */}
                            </div>

                            <Text
                              style={{
                                color:
                                  item.notificationType.typeName ===
                                  'Information'
                                    ? 'green'
                                    : item.notificationType.typeName === 'Error'
                                    ? 'red'
                                    : item.notificationType.typeName ===
                                      'Warning'
                                    ? 'orange'
                                    : 'inherit',
                                display: 'block',
                                whiteSpace: 'pre-wrap',
                              }}
                            >
                              {item.description}
                            </Text>
                            <Text className={styles.time}>
                              {/* <Text>Today</Text>{' '} */}
                              {' ' +
                                new Date(item.timeStamp).toLocaleString(
                                  'en-GB',
                                  {
                                    day: '2-digit',
                                    month: '2-digit',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                    second: '2-digit',
                                    hour12: false,
                                  },
                                )}
                            </Text>
                          </div>
                        </div>
                      </Menu.Item>
                      {/* {index < notification.length - 1 && <Menu.Divider />} */}
                    </React.Fragment>
                  ) : null,
                )
              )}
            </Menu>
          </div>
        )}
      </>
    );
  };

  return (
    <AntHeader
      style={{ padding: '0 20px', borderBottom: '1px solid #d9d9d9' }}
      color="white"
      className="header"
    >
      <p className="headerTitle">Student Attendance Management System</p>
      <div className="leftHeaderUserInfo">
        <HeaderProgress
          preparationProgress={preparationProgress}
          newNotificaton={newNotificaton}
        />

        <Dropdown
          // arrow
          // open={onOpen}
          // onOpenChange={(e) => setOnOpen(e)}
          // dropdownRender={CustomDropdownMenu}
          // placement="bottomRight"
          // trigger={['click']}
          // arrow
          overlay={CustomDropdownMenu}
          trigger={['click']}
          open={dropdownVisible}
          onOpenChange={(flag) => setDropdownVisible(flag)}
          placement="bottom"
        >
          <Badge count={readNotificationsCount}>
            <Button shape="circle" icon={<PiBellBold />} size="large" />
          </Badge>
        </Dropdown>
        <Avatar
          size={{
            xs: 24,
            sm: 32,
            md: 10,
            lg: 14,
            xl: 40,
            xxl: 10,
          }}
          src={
            <img
              src={
                avatar
                  ? avatar
                  : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1718108394~exp=1718111994~hmac=133f803dd1192a01c2db5decc8c445321e7376559b5c19f03028cc2ef0c73d4a&w=740'
              }
              alt="avatar"
            />
          }
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Title
            style={{ marginBottom: '2px' }}
            level={5}
            className="narrowTypography"
          >
            {name ? user?.result?.displayName : 'Name'}
          </Title>
          <Text className="narrowTypography">{user?.result?.role.name}</Text>
        </div>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow
          trigger={['click']}
        >
          <Button shape="default" className="btnDrop">
            <IoIosArrowDown size={25} className="down-arrow" />
          </Button>
        </Dropdown>
      </div>
    </AntHeader>
  );
};

export default Headers;
