import React, { useEffect, useState } from "react";
import {
  Button,
  Typography,
  Avatar,
  Badge,
  Layout,
  Dropdown,
  Menu,
  MenuProps,
} from "antd";
import "./Header.css";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { UserInfo } from "../../models/UserInfo";
import { logout } from "../../redux/slice/Auth";
import NotificationItem from "./contentHeader/NotificationItem";
import { PiBellBold } from "react-icons/pi";
import { HelperService } from "../../hooks/helpers/helperFunc";

const { Header: AntHeader } = Layout;

const { Title, Text } = Typography

type FilterNotiFication = 'all' | 'today' | 'past'

const Headers: React.FC = () => {
  const [onFilterNoti, setOnFilterNoti] = useState<FilterNotiFication>('all');
  const [onOpen, setOnOpen] = useState<boolean>(false);

  const userDetail: UserInfo | undefined = useSelector((state: RootState) => state.auth.userDetail);
  const name = userDetail?.result?.displayName;
  const avatar = userDetail?.result?.avatar
  const dispatch = useDispatch();

  const handleLogout = async () => {
    dispatch(logout());
  };

  const handleChangeFilter = (change: FilterNotiFication) => {
    setOnFilterNoti(change)
  }

  const notificationItems: MenuProps['items'] = [
    {
      key: "1",
      label: (
        <NotificationItem date="" info="" time="" image="" key={'noti_0'} />
      ),
    },
    {
      key: "2",
      label: (
        <NotificationItem date="" info="" time="" image="" key={'noti_1'} />
      ),
    },
    {
      key: "3",
      label: (
        <NotificationItem date="" info="" time="" image="" key={'noti_2'} />
      ),
    },
    // {
    //   key: "4",
    //   label: (
    //     <NotificationItem date="" info="" time="" image="" key={'noti_3'} />
    //   ),
    // },
    // {
    //   key: "5",
    //   label: (
    //     <NotificationItem date="" info="" time="" image="" key={'noti_4'} />
    //   ),
    // },
    // {
    //   key: "6",
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
        <Button
          type="text"
          onClick={handleLogout}
        >
          Log out
        </Button>
      ),
    },
  ];

  useEffect(() => {
    console.log("Changed ", onFilterNoti);
  }, [onFilterNoti])

  const CustomDropdownMenu = () => {
    return (
      <div style={{
        maxWidth: '30vw',
        height: '60vh',
        overflow: 'auto',
        scrollbarWidth: 'none',
      }}>
        <Menu>
          <div className='notificationFilterCtn'>
            <Text style={{ marginRight: '10px', fontSize: '1rem' }}>Notification</Text>
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
                onClick={() => { handleChangeFilter('all') }}
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
          {
            notificationItems.map((item, index) => item && (
              <React.Fragment key={item.key}>
                <Menu.Item key={item.key}>{item.label}</Menu.Item>
                {index < notificationItems.length - 1 && <Menu.Divider />}
              </React.Fragment>
            ))
          }
        </Menu>
      </div>
    )
  };

  return (
    <AntHeader style={{ padding: '0 20px' }} color="white" className="header">
      <p className="headerTitle">Student Attendance Management System</p>
      <div className="leftHeaderUserInfo">
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
          src={<img src={
            avatar
              ? avatar
              : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1718108394~exp=1718111994~hmac=133f803dd1192a01c2db5decc8c445321e7376559b5c19f03028cc2ef0c73d4a&w=740'
          } alt="avatar" />}
        />

        <div
          style={{
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Title
            style={{ marginBottom: '2px' }}
            level={5} className="narrowTypography">
            {name ? userDetail?.result?.displayName : 'Name'}
          </Title>
          <Text className="narrowTypography">{userDetail?.result?.role.name}</Text>
        </div>
        <Dropdown
          menu={{ items }}
          placement="bottomRight"
          arrow
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
