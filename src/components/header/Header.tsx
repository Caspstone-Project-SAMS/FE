import React from "react";
import {
  Button,
  Space,
  Typography,
  Avatar,
  Badge,
  Layout,
  Dropdown,
} from "antd";
import { CiBellOn } from "react-icons/ci";
import "./Header.css";
import { IoIosArrowDown } from "react-icons/io";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";

const { Header: AntHeader } = Layout;

const Headers: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth.userDetail)

  const items = [
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

  return (
    <AntHeader style={{ padding: '0 20px' }} color="white" className="header">
      <Typography.Title level={3} onClick={() => { console.log("Auth ", auth); }}>
        Student Attendance Management System
      </Typography.Title>
      <Space wrap size="middle">
        <Badge count={10}>
          <Dropdown
            menu={{
              items,
            }}
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
            abc
          </Typography.Title>
          <Typography.Text className="narrowTypography">abc</Typography.Text>
        </Space>
        <IoIosArrowDown size={25} className="down-arrow" />
      </Space>
    </AntHeader>
  );
};

export default Headers;
