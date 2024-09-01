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
} from 'antd';
import './Header.css';
import styles from '../header/contentHeader/index.module.less';
import {
  IoIosArrowDown,
  IoIosInformationCircle ,
  IoIosCloseCircleOutline,
  IoIosWarning,
  IoMdClose,
  IoIosCloseCircle
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

  const userDetail: UserInfo | undefined = useSelector(
    (state: RootState) => state.auth.userDetail,
  );
  const user = useSelector((state: RootState) => state.auth.data);
  const name = user?.result?.displayName;
  const avatar = user?.result?.avatar;
  const [reload, setReload] = useState(0);
  const [read, setRead] = useState(false);
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
    closeWebsocket();
  };

  const handleChangeFilter = (change: FilterNotiFication) => {
    setOnFilterNoti(change);
  };

  const handleReadNotification = async (NotificationID: number) => {
    try {
      const response = await NotificationService.readNotification(
        NotificationID,
      );
      setRead(true);
      setReload((prev) => prev + 1);
      return response;
    } catch (error) {
      console.log('Error on read notification: ', error);
    }
  };

  // console.log('notification', notification);

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
            <IoIosInformationCircle  style={{ color: 'green' }} />
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

  const notificationItems: MenuProps['items'] = [
    // {
    //   key: '1',
    //   label: (
    //     <div className={styles.notiItemCtn}>
    //       <div className={styles.imageCtn}>
    //         <Avatar
    //           style={{ backgroundColor: ColorList[0], verticalAlign: 'middle' }}
    //           size="large"
    //           gap={4}
    //         >
    //           SAMS
    //         </Avatar>
    //       </div>
    //       <div className={styles.notiDetailCtn}>
    //         <Text>
    //           YOU haven't checking attendance at FAP system class MLN301-NJS1602
    //           Please make an action!!
    //         </Text>
    //         <Text className={styles.time}>
    //           <Text>Today</Text> at 7:30 AM
    //         </Text>
    //       </div>
    //     </div>
    //   ),
    // },
    // {
    //   key: '4',
    //   label: (
    //     <NotificationItem date="" info="" time="" image="" key={'noti_3'} />
    //   ),
    // },
    // {
    //   key: '5',
    //   label: (
    //     <NotificationItem date="" info="" time="" image="" key={'noti_4'} />
    //   ),
    // },
    // {
    //   key: '6',
    //   label: (
    //     <NotificationItem date="" info="" time="" image="" key={'noti_1'} />
    //   ),
    // },
  ];

  const items: MenuProps['items'] = [
    {
      key: '1',
      style: { padding: 0 },
      label: (
        <>
          <Button type="text" onClick={handleNavigateHome}>
            Home
          </Button>
          <br />
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

  useEffect(() => {
    // console.log("Changed ", onFilterNoti);
  }, [onFilterNoti]);

  const reversedNotification = [...notification].reverse();

  const CustomDropdownMenu = () => {
    return (
      <div
        style={{
          maxWidth: '30vw',
          height: '60vh',
          overflow: 'auto',
          scrollbarWidth: 'none',
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
              <Menu.Item key="past" onClick={() => handleChangeFilter('past')}>
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
                    onClick={() => handleReadNotification(item.notificationID)}
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
                          {item.notificationType.typeName === 'Information' ? (
                            <IoIosInformationCircle 
                              style={{ color: 'green', fontSize: '1.5rem' }}
                            />
                          ) : item.notificationType.typeName === 'Error' ? (
                            <IoIosCloseCircle 
                              style={{ color: 'red', fontSize: '1.5rem' }}
                            />
                          ) : item.notificationType.typeName === 'Warning' ? (
                            <IoIosWarning
                              style={{ color: 'orange', fontSize: '1.5rem' }}
                            />
                          ) : null}
                        </div>
                      </div>
                      <div className={styles.notiDetailCtn}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                          <Text style={{ fontWeight: 500 }}>{item.title}</Text>
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
                              item.notificationType.typeName === 'Information'
                                ? 'green'
                                : item.notificationType.typeName === 'Error'
                                ? 'red'
                                : item.notificationType.typeName === 'Warning'
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
                            new Date(item.timeStamp).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                            })}
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
          arrow
          open={onOpen}
          onOpenChange={(e) => setOnOpen(e)}
          dropdownRender={CustomDropdownMenu}
          placement="bottomRight"
          trigger={['click']}
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
