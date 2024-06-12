import { Button, Card, Col, Row } from 'antd';
import { IoPeopleOutline } from 'react-icons/io5';
import { RightOutlined } from '@ant-design/icons';
import { FaSwatchbook } from 'react-icons/fa6';
import { GoPeople } from 'react-icons/go';
import { SiGoogleclassroom } from 'react-icons/si';
import { Content } from 'antd/es/layout/layout';
import HomeCalendar from '../../components/calendar/HomeCalendar';
import styles from './Home.module.less';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

const Home: React.FC = () => {
  const [time, setTime] = useState(new Date());
  const auth = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    const seconds = time.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  };
  return (
    <Content className={styles.home}>
      <Row
        style={{ marginRight: '20px', marginLeft: '20px' }}
        gutter={[16, 16]}
      >
        <Col xs={24} sm={24} md={24} lg={24} xl={14}>
          <Card style={{ height: '100%' }}>
            <Row>
              <Col style={{ marginBottom: 25 }} span={14}>
                <text className={styles.firstCardTitle}>
                  Lecturer Dashboard
                </text>
                <br />
                <text>Current / Upcoming class</text>
              </Col>
              <Col className={styles.date} span={10}>
                <text>Tuesday, May 14, 2024</text>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={14}>
                <Button
                  onClick={() => { console.log(auth); }}
                  className={styles.btnClass}>
                  <Row>
                    <Col className={styles.peopleIcon}>
                      <IoPeopleOutline size={60} />
                    </Col>
                    <Col style={{ textAlign: 'left' }}>
                      <text className={styles.classTitle}>
                        Room:{' '}
                        <span>
                          <text className={styles.classDetail}>NVH - 309</text>
                        </span>
                      </text>
                      <br />
                      <text className={styles.classTitle}>
                        Slot 1:{' '}
                        <span>
                          <text className={styles.classDetail}>
                            07:00 - 9:30
                          </text>
                        </span>
                      </text>
                      <br />
                      <text className={styles.classTitle}>
                        Subject:{' '}
                        <span>
                          <text className={styles.classDetail}>MLN131</text>
                        </span>
                      </text>
                      <br />
                      <text className={styles.classTitle}>
                        Class:{' '}
                        <span>
                          <text className={styles.classDetail}>NET1601</text>
                        </span>
                      </text>
                    </Col>
                    <Col className={styles.arrowIcon}>
                      <RightOutlined />
                    </Col>
                  </Row>
                </Button>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} span={10}>
                <h1>{formatTime(time)}</h1>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={24} lg={24} xl={10}>
          <Card style={{ backgroundColor: 'white' }}>
            <Row gutter={[5, 10]}>
              <Col span={12}>
                <Col>
                  <Card className={styles.upcomeClass}>
                    <Row>
                      <Col span={17}>
                        <text className={styles.upTitle}>Upcoming class</text>
                        <br />
                        <text className={styles.upDetail}>SWT301</text>
                      </Col>
                      <Col
                        span={7}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <GoPeople size={'40px'} />
                      </Col>
                    </Row>
                  </Card>
                </Col>
                <Col>
                  <Card className={styles.todayClass}>
                    <Row>
                      <Col span={17}>
                        <text className={styles.toTitle}>Today class</text>
                        <br />
                        <text className={styles.toDetail}>3/5</text>
                      </Col>
                      <Col
                        span={7}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <SiGoogleclassroom size={'40px'} />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Col>
              <Col span={12}>
                <Card className={styles.subPrepare}>
                  <Row>
                    <Col span={17}>
                      <text className={styles.subTitle}>Subject Prepare</text>
                      <br />
                      <text className={styles.subDetail}>SWT301</text>
                      <br />
                      <text className={styles.subDetail}>EXE101</text>
                      <br />
                      <text className={styles.subDetail}>MLN131</text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <FaSwatchbook size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <HomeCalendar />
    </Content>
  );
};

export default Home;
