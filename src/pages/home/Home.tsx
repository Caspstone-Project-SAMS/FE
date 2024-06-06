import { Button, Card, Layout, Space, Typography } from 'antd';
import React from 'react';
import { IoPeopleOutline } from 'react-icons/io5';
import './Home.css';
import { RightOutlined } from '@ant-design/icons';
import { FaSwatchbook } from 'react-icons/fa6';
import { GoPeople } from 'react-icons/go';
import { SiGoogleclassroom } from 'react-icons/si';
import { Content } from 'antd/es/layout/layout';
import HomeCalendar from '../../components/calendar/HomeCalendar';

const Home: React.FC = () => {
  return (
    <Content className="home">
      <Layout style={{ marginRight: '20px', marginLeft: '20px' }}>
        <Content>
          <Space direction="vertical" className="home-space-card">
            <Space direction="horizontal" className="home-card">
              <Card className="home-parent-card1">
                <Content style={{ width: '645px' }}>
                  <Space direction="horizontal" className="home-info">
                    <div className="card-header">
                      <Space direction="vertical">
                        <Typography.Title level={4}>
                          Lecturer Dashboard
                        </Typography.Title>
                        <Typography.Text>
                          Current / Upcoming class
                        </Typography.Text>
                        <Button className="class-info">
                          <Space>
                            <IoPeopleOutline size={60} />
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
                      <Space direction="vertical" style={{}}>
                        <Typography.Text style={{}}>
                          Tuesday, May 14, 2024
                        </Typography.Text>
                      </Space>
                    </div>
                  </Space>
                </Content>
              </Card>
              <Card className="home-parent-card2">
                <Content>
                  <Space
                    direction="horizontal"
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      width: '100%',
                    }}
                  >
                    <Space direction="vertical">
                      <Card style={{ backgroundColor: '#f1e7ff' }}>
                        <Space direction="horizontal" className="home-card-1">
                          <Space
                            direction="vertical"
                            style={{ width: '150px' }}
                          >
                            <text className="status-card">Upcoming class</text>
                            <text className="classcode">SWT301</text>
                          </Space>
                          <Space>
                            <GoPeople size={'40px'} />
                          </Space>
                        </Space>
                      </Card>
                      <Card style={{ backgroundColor: '#e5f5ff' }}>
                        <Space direction="horizontal" className="home-card-1">
                          <Space direction="vertical" style={{}}>
                            <text className="status-card">Today class</text>
                            <text className="classcode">3/5</text>
                          </Space>
                          <Space>
                            <SiGoogleclassroom size={'40px'} />
                          </Space>
                        </Space>
                      </Card>
                    </Space>
                    <Space>
                      <Card
                        style={{
                          backgroundColor: '#ebfdef',
                          height: '230px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Space direction="horizontal" className="home-card-2">
                          <Space
                            direction="vertical"
                            style={{ width: '130px' }}
                          >
                            <text className="status-card">Subject prepare</text>
                            <text className="classcode">SWT301</text>
                            <text className="classcode">EXE201</text>
                            <text className="classcode">MLN131</text>
                          </Space>
                          <Space>
                            <FaSwatchbook size={'40px'} />
                          </Space>
                        </Space>
                      </Card>
                    </Space>
                  </Space>
                </Content>
              </Card>
            </Space>
          </Space>
        </Content>
      </Layout>

      <HomeCalendar />
    </Content>
  );
};

export default Home;
