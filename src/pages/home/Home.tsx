import styles from './Home.module.less';
import React, { useState, useEffect } from 'react';
import moment from 'moment';

import { Button, Card, Col, Row, Typography } from 'antd';
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
import { useNavigate } from 'react-router-dom';
import SetUpWifi from '../../components/wifi/SetUpWifi';

type scheduleStatus = 'past' | 'current' | 'future';
interface ScheduleExtend extends Schedule {
  status: 'past' | 'current' | 'future'
}

interface FormattedSchedule {
  room: string;
  slot: string;
  status: 'past' | 'current' | 'future';
  classCode: string;
  scheduleID: number;
  subjectCode: string;
  start: Date,
  end: Date
}

type Dashboard = {
  curUpClass: ScheduleExtend,
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

  const navigate = useNavigate()

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
        status: 'past'
      },
      upcomingTxt: '',
      todayClass: '',
      subjectPrepare: []
    }
    const schedules = calendar.schedule;
    const today = moment(new Date()).format('YYYY-MM-DD');
    if (schedules && schedules.length > 0) {
      //Current date
      const todaySchedules = schedules.map(schedule => {
        if (schedule.date === today) {
          const startDateTime = new Date(`${schedule.date}T${schedule.startTime}`);
          const endDateTime = new Date(`${schedule.date}T${schedule.endTime}`);

          const status = validateStatusSchedule(startDateTime, endDateTime);
          if (status === 'current' || status === 'future') {
            if (status === 'current') {
              dashboardInfoVal.curUpClass = { ...schedule, status: status };
            } else {
              dashboardInfoVal.curUpClass = { ...schedule, status: status };
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
        if (pastEvent !== 0) { // sau khi co tiet hoc ket thuc 
          dashboardInfoVal.todayClass = `${pastEvent}/${todaySchedules.length}`
        } else { // past event = 0, bat dau ngay
          const futureEvents = todaySchedules.filter(item => item.status === 'future')
          if (futureEvents.length > 0) { // chua bat dau tiet hoc
            dashboardInfoVal.todayClass = `0/${todaySchedules.length}`
          } else { // hoan thanh ngay
            dashboardInfoVal.todayClass = `${todaySchedules.length}/${todaySchedules.length}`
          }
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

  const formatCurUpClass = (obj: ScheduleExtend): FormattedSchedule => {
    //   des slot status classCode scheduleID subjectCode
    const startDateTime = new Date(`${obj.date}T${obj.startTime}`);
    const endDateTime = new Date(`${obj.date}T${obj.endTime}`);

    return {
      room: obj.roomName,
      slot: `Slot ${obj.slotNumber}`,
      start: startDateTime,
      end: endDateTime,
      status: obj.status,
      classCode: obj.classCode,
      scheduleID: obj.scheduleID,
      subjectCode: obj.subjectCode
    };
  }

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
                <div style={{ textAlign: 'right' }}>
                  <span>{todayDate}</span>
                  <h1>{formatTime(time)}</h1>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col span={14}>
                <Button
                  style={{
                    height: 'fit-content',
                    width: '95%',
                  }}
                  onClick={() => {
                    if (dashBoardInfo && dashBoardInfo.curUpClass) {
                      //
                      try {
                        const event = formatCurUpClass(dashBoardInfo.curUpClass)
                        navigate('/class/classdetails', { state: { event } });
                      } catch (error) {
                        console.log("Unknown error when navigate class detail");
                      }
                    } else {
                      navigate('/class')
                    }
                  }}
                >
                  <div className={styles.dashboardCard}>
                    {dashBoardInfo ? (
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
                    ) : (
                      <div className={styles.cardInfoCtn} style={{ height: '100%' }}>
                        View classes
                      </div>
                    )}
                    <RightOutlined className={styles.iconNav} />
                  </div>
                </Button>
              </Col>
              <Col style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} span={10}>
                <SetUpWifi />
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
                        <text className={styles.upDetail}>
                          {dashBoardInfo?.upcomingTxt ? dashBoardInfo.upcomingTxt : 'Done'}
                        </text>
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
                        <text className={styles.toDetail}>
                          {dashBoardInfo?.todayClass ? dashBoardInfo.todayClass : 'Done'}
                        </text>
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
                  <Row style={{ height: '100%' }}>
                    <text className={styles.subTitle}>Subject Prepare</text>
                    <div style={{ height: '100%' }} className={styles.subInfoCtn}>
                      <Col style={{ height: '100%', display: 'flex', flexDirection: 'column' }} span={17}>
                        {
                          dashBoardInfo?.subjectPrepare.length ? dashBoardInfo.subjectPrepare.map(subject => (
                            <>
                              <text className={styles.subDetail}>{subject}</text>
                              <br />
                            </>
                          )) : (
                            <text className={styles.subDetail}>Done</text>
                          )
                        }
                      </Col>
                      <Col
                        span={7}
                        style={{ display: 'flex', alignItems: 'center' }}
                      >
                        <FaSwatchbook size={'40px'} />
                      </Col>
                    </div>
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
