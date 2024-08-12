import React, { useEffect, useState } from 'react';
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
} from 'antd';
import './Header.css';
import styles from '../header/contentHeader/index.module.less';
import { IoIosArrowDown } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { UserInfo } from '../../models/UserInfo';
import { logout } from '../../redux/slice/Auth';
import NotificationItem from './contentHeader/NotificationItem';
import { PiBellBold } from 'react-icons/pi';
import { HelperService } from '../../hooks/helpers/helperFunc';
import { NotificationService } from '../../hooks/Notification';
import { NotificationList } from '../../models/notification/Notification';

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

const Headers: React.FC = () => {
  const userID = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id,
  );
  const [notification, setNotification] = useState<NotificationList[]>([]);
  const [onFilterNoti, setOnFilterNoti] = useState<FilterNotiFication>('all');
  const [onOpen, setOnOpen] = useState<boolean>(false);

  const userDetail: UserInfo | undefined = useSelector(
    (state: RootState) => state.auth.userDetail,
  );
  const name = userDetail?.result?.displayName;
  const avatar = userDetail?.result?.avatar;
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleChangeFilter = (change: FilterNotiFication) => {
    setOnFilterNoti(change);
  };

  useEffect(() => {
    const response = NotificationService.getAllNotification(userID ?? '');

    response
      .then((data) => {
        setNotification(data?.result || []);
      })
      .catch((error) => {
        console.log('get notification error: ', error);
      });
  }, [userID]);

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
        <Button type="text" onClick={handleLogout}>
          Log out
        </Button>
      ),
    },
  ];

  useEffect(() => {
    // console.log("Changed ", onFilterNoti);
  }, [onFilterNoti]);

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
            notification.map((item, index) =>
              item ? (
                <React.Fragment key={index}>
                  <Menu.Item key={index}>
                    <div className={styles.notiItemCtn}>
                      <div className={styles.imageCtn}>
                        <Avatar
                          style={{
                            backgroundColor: ColorList[0],
                            verticalAlign: 'middle',
                          }}
                          size="large"
                          gap={4}
                        >
                          SAMS
                        </Avatar>
                      </div>
                      <div className={styles.notiDetailCtn}>
                        <Text style={{ fontWeight: 500 }}>{item.title}</Text>
                        <Text
                          style={{
                            color:
                              item.notificationType.typeName === 'Information'
                                ? 'green'
                                : item.notificationType.typeName === 'Error'
                                  ? 'red'
                                  : item.notificationType.typeName === 'Warning'
                                    ? 'orange'
                                    : 'inherit', // Fallback color
                          }}
                        >
                          {item.description}
                        </Text>
                        <Text className={styles.time}>
                          <Text>Today</Text>{' '}
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
    <AntHeader style={{ padding: '0 20px', borderBottom: '1px solid #d9d9d9' }} color="white" className="header">
      <p className="headerTitle">Student Attendance Management System</p>
      <div className="leftHeaderUserInfo">
        {/* <Button className="circular-button" type="link" shape="circle">
          <Progress type="circle" percent={30} size={40} />
        </Button> */}

        <Dropdown
          arrow
          open={onOpen}
          onOpenChange={(e) => setOnOpen(e)}
          dropdownRender={CustomDropdownMenu}
          placement="bottomRight"
          trigger={['click']}
        >
          <Badge dot>
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
            {name ? userDetail?.result?.displayName : 'Name'}
          </Title>
          <Text className="narrowTypography">
            {userDetail?.result?.role.name}
          </Text>
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
