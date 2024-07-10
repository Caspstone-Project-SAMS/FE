import React from "react";
import {
  Button,
  Space,
  Typography,
  Avatar,
  Badge,
  Layout,
  Dropdown,
  Menu,
} from "antd";
import { CiBellOn } from "react-icons/ci";
import "./Header.css";
import { IoIosArrowDown } from "react-icons/io";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import { UserInfo } from "../../models/UserInfo";
import { logout } from "../../redux/slice/Auth";

const { Header: AntHeader } = Layout;

const Headers: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth.userDetail);
  const userDetail: UserInfo | undefined = useSelector((state: RootState) => state.auth.userDetail);
  const name = userDetail?.result?.displayName;
  const dispatch = useDispatch();

  const handleLogout = async () => {
    console.log('test');
    dispatch(logout());
  };

  console.log('test', userDetail?.result);

  const notificationItems = [
    {
      key: "1",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          1st menu item
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          2nd menu item
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          3rd menu item
        </a>
      ),
    },
  ];

  const dropdownMenu = (
    <Menu onClick={handleLogout}>
      <Menu.Item key="1">Logout</Menu.Item>
    </Menu>
  );

  return (
    <AntHeader style={{ padding: '0 20px' }} color="white" className="header">
      {/* <Typography.Title level={3} onClick={() => { console.log("Auth ", auth); }}>
        Student Attendance Management System
      </Typography.Title> */}
      <p className="headerTitle">Student Attendance Management System</p>
      <Space wrap size="middle">
        <Badge count={10}>
          <Dropdown
            overlay={<Menu items={notificationItems} />}
            placement="bottomRight"
            arrow
          >
            <Button shape="circle">
              <CiBellOn />
            </Button>
          </Dropdown>
        </Badge>
        <Avatar
          size={{
            xs: 24,
            sm: 32,
            md: 10,
            lg: 14,
            xl: 40,
            xxl: 10,
          }}
          // icon={}
        />
        <Space direction="vertical">
          <Typography.Title level={5} className="narrowTypography">
            {name ? userDetail?.result?.displayName : 'Name'}
          </Typography.Title>
          <Typography.Text className="narrowTypography">{userDetail?.result?.role.name}</Typography.Text>
        </Space>
        <Dropdown
          overlay={dropdownMenu}
          placement="bottomRight"
          arrow
        >
          <Button shape="circle" className="btnDrop">
            <IoIosArrowDown size={25} className="down-arrow" />
          </Button>
        </Dropdown>
      </Space>
    </AntHeader>
  );
};

export default Headers;
