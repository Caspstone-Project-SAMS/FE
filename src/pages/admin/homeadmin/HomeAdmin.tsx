import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './HomeAdmin.module.less';
import { Card, Col, Row, Typography } from 'antd';
import { GoBook, GoPeople } from 'react-icons/go';
import { PiStudent } from 'react-icons/pi';
import { GiTeacher } from 'react-icons/gi';
import HomeCalendar from '../../../components/calendar/HomeCalendar';
import useDispatch from '../../../redux/UseDispatch';
import { getAllSemester } from '../../../redux/slice/global/GlobalSemester';
import { DashboardService } from '../../../hooks/Dashboard';
import LineChart from '../../../components/chart/LineChart';

type AdminDashnoard = {
  totalStudent: string;
  totalTeacher: string;
  totalSubject: string;
  totalClass: string;
};

const HomeAdmin: React.FC = () => {
  const [dashboardStat, setDashboardStat] = useState<AdminDashnoard>({
    totalClass: '',
    totalStudent: '',
    totalSubject: '',
    totalTeacher: '',
  });
  const dispatch = useDispatch();

  const handleFetchDashboard = async () => {
    try {
      const students = await DashboardService.getTotalStudent();
      const lecturers = await DashboardService.getTotalLecturer();
      const subjects = await DashboardService.getTotalSubject();
      const classes = await DashboardService.getTotalClass();

      if (students && lecturers && subjects && classes) {
        setDashboardStat((prev) => ({
          ...prev,
          totalStudent: students.data,
          totalClass: classes.data,
          totalSubject: subjects.data,
          totalTeacher: lecturers.data,
        }));
      }
    } catch (error) {
      console.log('Unknown error occurer when get data dashboard');
    }
  };

  useEffect(() => {
    handleFetchDashboard();

    dispatch(getAllSemester());
  }, []);

  return (
    <Content className={styles.homeAdminContent}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={[16, 16]}>
              <Typography.Text className={styles.title}>
                Admin Dashboard
              </Typography.Text>
            </Row>
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#f1e7ff' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Students
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        {dashboardStat.totalStudent
                          ? dashboardStat.totalStudent
                          : '...'}
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <PiStudent size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#e5f5ff' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Teachers
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        {dashboardStat.totalTeacher
                          ? dashboardStat.totalTeacher
                          : '...'}
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <GiTeacher size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#ffefe7' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Subjects
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        {dashboardStat.totalSubject
                          ? dashboardStat.totalSubject
                          : '...'}
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <GoBook size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
              <Col xs={24} sm={24} md={12} lg={6} xl={6}>
                <Card style={{ backgroundColor: '#ebfdef' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Class
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        {dashboardStat.totalClass
                          ? dashboardStat.totalClass
                          : '...'}
                      </Typography.Text>
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
            </Row>
          </Card>
        </Col>
      </Row>
      <div>
        <HomeCalendar />
      </div>
      {/* <Row gutter={[24, 0]} style={{ marginTop: '20px' }}>
        <Col xs={24} sm={24} md={12} lg={12} xl={10} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <Echart />
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={14} className="mb-24">
          <Card bordered={false} className="criclebox h-full">
            <LineChart />
          </Card>
        </Col>
      </Row> */}
    </Content>
  );
};

export default HomeAdmin;
