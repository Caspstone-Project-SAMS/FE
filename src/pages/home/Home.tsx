import styles from './Home.module.less';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { Button, Card, Col, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import { RightOutlined } from '@ant-design/icons';
import { GoPeople } from 'react-icons/go';
import { FaSwatchbook } from 'react-icons/fa6';
import { IoPeopleOutline } from 'react-icons/io5';
import { SiGoogleclassroom } from 'react-icons/si';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';

import HomeCalendar from '../../components/calendar/HomeCalendar';
import { Schedule } from '../../models/calendar/Schedule';
import { slots } from '../../components/calendar/data/RawData';

type scheduleStatus = 'past' | 'current' | 'future';
type Dashboard = {
  curUpClass: Schedule,
  upcomingTxt: string,
  todayClass: string,
  subjectPrepare: string[]
}

const Home: React.FC = () => {
  const [dashBoardInfo, setDashboardInfo] = useState<Dashboard | undefined>(undefined)
  const [time, setTime] = useState(new Date());

  const auth = useSelector((state: RootState) => state.auth)
  const calendar = useSelector((state: RootState) => state.calendar)
  const todayDate = moment().format('dddd, MMMM DD, YYYY');
  const slotSample = slots;

  const validateStatusSchedule = (startTime: Date, endTime: Date): scheduleStatus => {
    const currentTime = new Date();
    //future/current event
    if ((currentTime.valueOf() - endTime.valueOf()) <= 0) {
      if (currentTime.valueOf() - startTime.valueOf() >= 0) {
        return 'current'
      }
      return 'future'
    } else {
      return 'past'
    }
  };

  //Return current|next slot, upcoming class, subject prepare, today class
  const lectureDashboardCalculator = () => {
    console.log("Calendar ", calendar);
    let hasEventToday = false
    let pastEvent = 0;
    const dashboardInfoVal: Dashboard = {
      curUpClass: {
        classCode: '',
        date: '',
        endTime: '',
        roomName: '',
        scheduleID: 0,
        slotNumber: 0,
        startTime: '',
        subjectCode: '',
      },
      upcomingTxt: '',
      todayClass: '',
      subjectPrepare: []
    }
    const schedules = calendar.schedule;
    const today = moment(new Date()).format('YYYY-MM-DD');
    if (schedules.length > 0) {
      //Current date
      const todaySchedules = schedules.map(schedule => {
        if (schedule.date === today) {
          const startDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
          const endDateTime = new Date(`${schedule.date}T${schedule.endTime}`);

          const status = validateStatusSchedule(startDateTime, endDateTime);
          if (status === 'current' || status === 'future') {
            if (status === 'current') {
              dashboardInfoVal.curUpClass = schedule;
            } else {
              dashboardInfoVal.curUpClass = schedule;
              dashboardInfoVal.subjectPrepare.push(schedule.subjectCode)
            }
            hasEventToday = true;
          }
          if (status === 'past') {
            pastEvent++;
          }
          return { ...schedule, status }
        }
      }).filter(item => item !== undefined)
      // calculate upcoming, class left, subject prepare, when time not the end of the day
      if (hasEventToday) {
        let isFirst = false;
        //Subject prepare, upcomingtxt
        todaySchedules.forEach(schedule => {
          if (schedule.status === 'future') {
            if (!isFirst) {
              dashboardInfoVal.upcomingTxt = schedule.subjectCode;
              isFirst = true;
            }
            dashboardInfoVal.subjectPrepare.push(schedule.subjectCode);
          }
        })
        if (pastEvent !== 0) {
          dashboardInfoVal.todayClass = `${pastEvent}/${todaySchedules.length}`
        } else {
          dashboardInfoVal.todayClass = `${todaySchedules.length}/${todaySchedules.length}`
        }
        setDashboardInfo(dashboardInfoVal)
      }
    }
    // console.log("cateried ", todaySchedules);
    // console.log("dashboardInfo ", dashboardInfoVal);
  }

  useEffect(() => {
    lectureDashboardCalculator();
    const interval = setInterval(() => {
      setTime(new Date());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    lectureDashboardCalculator()
  }, [calendar])

  useEffect(() => {
    console.log('dashboard change ', dashBoardInfo);
  }, [dashBoardInfo])

  const formatTime = (time: Date) => {
    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');
    // const seconds = time.getSeconds().toString().padStart(2, '0');

    return `${hours}:${minutes}:00`;
  };
  return (
    <Content className={styles.home}>
      <Row
        style={{ marginRight: '14px', marginLeft: '14px' }}
        gutter={12}
        justify={'space-between'}
      >
        <Col style={{ padding: 0 }} xs={24} sm={24} md={24} lg={24} xl={14}>
          <Card style={{ height: '100%' }}>
            <Row>
              <Col style={{ marginBottom: 25 }} span={14}>
                <div className={styles.firstCardTitle}
                  onClick={() => {
                    console.log("Current dashboard ", dashBoardInfo);
                  }}
                >
                  Lecturer Dashboard
                </div>
                <div>Current / Upcoming class</div>
              </Col>
              <Col className={styles.date} span={10}>
                <div>{todayDate}</div>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={14}>
                {/* <Button
                  onClick={() => {
                    lectureDashboardCalculator()
                  }}
                  className={styles.btnClass}>
                  <Row>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <Col span={6} className={styles.peopleIcon}>
                        <IoPeopleOutline size={50} />
                      </Col>
                      <Col span={12} style={{ textAlign: 'left' }}>
                        <text className={styles.classTitle}>
                          Room:{' '}
                          <span>
                            <text className={styles.classDetail}>
                              {dashBoardInfo && dashBoardInfo.curUpClass.roomName}
                            </text>
                          </span>
                        </text>
                        <br />
                        <text className={styles.classTitle}>
                          Slot 1:{' '}
                          <span>
                            <text className={styles.classDetail}>
                              {
                                dashBoardInfo && (
                                  `${dashBoardInfo.curUpClass.startTime} - ${dashBoardInfo.curUpClass.endTime}`
                                )
                              }
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
                    </div>

                    <Col span={6} className={styles.arrowIcon}>
                      <RightOutlined />
                    </Col>
                  </Row>
                </Button> */}
                <Button
                  style={{ height: 'fit-content' }}
                >
                  <div className={styles.dashboardCard}>
                    {dashBoardInfo && (
                      <div className={styles.cardInfoCtn}>
                        <IoPeopleOutline size={50} />
                        <div className={styles.cardInfo}>
                          <span>Room: {dashBoardInfo.curUpClass.roomName}</span>
                          <span>Slot {dashBoardInfo.curUpClass.slotNumber}: {' '}
                            {
                              dashBoardInfo.curUpClass.startTime.slice(0, -3) + '-' + dashBoardInfo.curUpClass.endTime.slice(0, -3)
                            }
                          </span>
                          <span>Subject: {dashBoardInfo.curUpClass.subjectCode}</span>
                          <span>Class: {dashBoardInfo.curUpClass.classCode}</span>
                        </div>
                      </div>
                    )}
                    <RightOutlined className={styles.iconNav} />
                  </div>
                </Button>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} span={10}>
                <h1>{formatTime(time)}</h1>
              </Col>
            </Row>
          </Card>
        </Col>
        <Col style={{ padding: 0 }} xs={24} sm={24} md={24} lg={24} xl={10}>
          <Card style={{ backgroundColor: 'white' }}>
            <Row gutter={[5, 10]}>
              <Col span={12}>
                <Col>
                  <Card className={styles.upcomeClass}>
                    <Row>
                      <Col span={17}>
                        <text className={styles.upTitle}>Upcoming class</text>
                        <br />
                        <text className={styles.upDetail}>{dashBoardInfo && dashBoardInfo.upcomingTxt}</text>
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
                        <text className={styles.toDetail}>{dashBoardInfo && dashBoardInfo.todayClass}</text>
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
                      {
                        dashBoardInfo && dashBoardInfo.subjectPrepare.map(subject => (
                          <>
                            <text className={styles.subDetail}>{subject}</text>
                            <br />
                          </>
                        ))
                      }
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
