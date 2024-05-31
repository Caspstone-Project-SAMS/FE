import { Button, Card, Space, Typography } from "antd";
import React from "react";
import { IoPeopleOutline } from "react-icons/io5";
import "./Home.css";
import { RightOutlined } from "@ant-design/icons";
import { FaSwatchbook } from "react-icons/fa6";
import { GoPeople } from "react-icons/go";
import { SiGoogleclassroom } from "react-icons/si";
import { Content } from "antd/es/layout/layout";
import HomeCalendar from "../../components/calendar/HomeCalendar";
import { logout } from "../../redux/slice/Auth";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";
import useDispatch from "../../redux/UseDispatch";

const Home: React.FC = () => {
  const auth = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch();

  return (
    <Content className="home">
      <Space direction="horizontal" className="spaces-container">
        {/* <Space className="card-container"> */}
        <Card className="card-content">
          <div className="card-header">
            <Space direction="vertical">
              <Typography.Title level={4}>Lecturer Dashboard</Typography.Title>
              <Typography.Text>Current / Upcoming class</Typography.Text>
              <Button
                onClick={() => {
                  dispatch(logout())
                  console.log("Auth ", auth);
                }}
                className="class-info">
                <Space>
                  <IoPeopleOutline />
                  <Space direction="vertical">
                    <Space className="info">
                      <Typography.Text>Room: </Typography.Text>
                      <Typography.Text>NHV - 309</Typography.Text>
                    </Space>
                    <Space className="info">
                      <Typography.Text>Slot 1: </Typography.Text>
                      <Typography.Text>7:00 - 9:30</Typography.Text>
                    </Space>
                    <Space className="info">
                      <Typography.Text>Subject: </Typography.Text>
                      <Typography.Text>MLN131</Typography.Text>
                    </Space>
                    <Space className="info">
                      <Typography.Text>Class: </Typography.Text>
                      <Typography.Text>NET1601</Typography.Text>
                    </Space>
                  </Space>
                </Space>
                <RightOutlined />
              </Button>
            </Space>
            <Space direction="vertical">
              <Typography.Text>Tuesday, May 14, 2024</Typography.Text>
            </Space>
          </div>
        </Card>
        {/* </Space> */}

        {/* <Space className="card-container1"> */}
        <Card className="card-content1">
          <Space direction="horizontal" className="two-card">
            <Space direction="vertical">
              <Card className="card1" style={{ backgroundColor: "#f1e7ff" }}>
                <div className="icon-container">
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Typography.Text>Upcoming class</Typography.Text>
                      <Typography.Title level={2}>SWT301</Typography.Title>
                    </Space>
                    <Space direction="vertical">
                      <GoPeople className="upcome-icon" />
                    </Space>
                  </Space>
                </div>
              </Card>
              <Card className="card3" style={{ backgroundColor: "#e5f5ff" }}>
                <div className="icon-container">
                  <Space direction="horizontal">
                    <Space direction="vertical">
                      <Typography.Text>Today class</Typography.Text>
                      <Typography.Title level={2}>5</Typography.Title>
                    </Space>
                    <Space direction="vertical">
                      <SiGoogleclassroom className="today-icon" />
                    </Space>
                  </Space>
                </div>
              </Card>
            </Space>
            <Card className="card2">
              <Space className="space-container" direction="horizontal">
                <Space direction="vertical">
                  <Typography.Text>Subject Prepare</Typography.Text>
                  <Typography.Title level={2}>SWT301</Typography.Title>
                  <Typography.Title level={2}>EXE101</Typography.Title>
                  <Typography.Title level={2}>MLN131</Typography.Title>
                </Space>
                <Space direction="vertical">
                  <FaSwatchbook className="book-icon" />
                </Space>
              </Space>
            </Card>
          </Space>
        </Card>
        {/* </Space> */}
      </Space>
      <HomeCalendar />
    </Content>
  );
};

export default Home;
