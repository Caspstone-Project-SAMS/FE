import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './HomeAdmin.module.less';
import { Card, Col, Row, Typography, Select } from 'antd';
import { GoBook, GoPeople } from 'react-icons/go';
import { PiStudent } from 'react-icons/pi';
import { GiTeacher } from 'react-icons/gi';
import HomeCalendar from '../../../components/calendar/HomeCalendar';
import useDispatch from '../../../redux/UseDispatch';
import { getAllSemester } from '../../../redux/slice/global/GlobalSemester';
import { DashboardService } from '../../../hooks/Dashboard';
import LineChart from '../../../components/chart/LineChart';
import BarChart from '../../../components/chart/BarChart';
import { PieChart } from '@mui/x-charts/PieChart';
import { CalendarService } from '../../../hooks/Calendar';
import { Semester } from '../../../models/calendar/Semester';
import ColorShowcase from '../../../components/color/ColorShowcase';
import { MdOutlineViewModule } from 'react-icons/md';

const { Option } = Select;

type AdminDashnoard = {
  totalStudent: string;
  totalTeacher: string;
  totalSubject: string;
  totalClass: string;
  totalModule: string;
};

type ScheduleStatistic = {
  totalSchedules: number;
  notYetCount: number;
  attendedCount: number;
  absenceCount: number;
};

type moduleActivities = {
  successCount: number;
  failedCount: number;
};

const HomeAdmin: React.FC = () => {
  const [dashboardStat, setDashboardStat] = useState<AdminDashnoard>({
    totalClass: '',
    totalStudent: '',
    totalSubject: '',
    totalTeacher: '',
    totalModule: '',
  });
  const pieParamSchedule = { height: 200, margin: { right: 5 } };
  const paletteSchedule = ['#9A9999', '#4EFD4E', '#E83B3B'];

  const pieParamModuleActivity = { height: 200, margin: { right: 5 } };
  const paletteModuleActivity = ['#4EFD4E', '#E83B3B'];

  const [scheduleSemester, setScheduleSemester] = useState<ScheduleStatistic>();
  const [semesterId, setSemesterId] = useState(0);
  const [moduleActivityStat, setModuleActivityStat] =
    useState<moduleActivities>();
  const [semester, setSemester] = useState<Semester[]>([]);

  const dispatch = useDispatch();

  const handleFetchDashboard = async () => {
    try {
      const students = await DashboardService.getTotalStudent();
      const lecturers = await DashboardService.getTotalLecturer();
      const subjects = await DashboardService.getTotalSubject();
      const classes = await DashboardService.getTotalClass();
      const modules = await DashboardService.getTotalModule();

      if (students && lecturers && subjects && classes) {
        setDashboardStat((prev) => ({
          ...prev,
          totalStudent: students.data,
          totalClass: classes.data,
          totalSubject: subjects.data,
          totalTeacher: lecturers.data,
          totalModule: modules.data,
        }));
      }
    } catch (error) {
      console.log('Unknown error occurer when get data dashboard');
    }
  };

  // const handleFetchChartData = async () => {
  //   try {
  //     const response = await CalendarService.getAllSemester();
  //     const currenSemester: Semester | undefined = response?.find(
  //       (se) => se.semesterStatus === 2,
  //     );
  //     const currentSemesterId = currenSemester?.semesterID || 0;
  //     setSemesterId(currentSemesterId);
  //     const scheduleStatistics = await DashboardService.getScheduleStatistic(
  //       semesterId
  //     );
  //     const moduleActivityStatistics =
  //     await DashboardService.getAllModuleActivityStatistic(
  //       semesterId
  //     );
  //     setScheduleSemester(scheduleStatistics);
  //     setModuleActivityStat(moduleActivityStatistics);
  //   } catch (error) {
  //     console.log('Unknown error occurer when get data chart data');
  //   }
  // };

  const handleFetchChartData = async () => {
    try {
      const response = await CalendarService.getAllSemester();
      setSemester(response || []);
      const currentSemester: Semester | undefined = response?.find(
        (se) => se.semesterStatus === 2,
      );
      const currentSemesterId = currentSemester?.semesterID || 0;

      // Set the semesterId state
      setSemesterId(currentSemesterId);

      // Don't trigger anything here, wait for semesterId to change
    } catch (error) {
      console.log('Unknown error occurred when fetching chart data');
    }
  };

  useEffect(() => {
    handleFetchDashboard();
    handleFetchChartData();
  }, []);

  useEffect(() => {
    const fetchAdditionalData = async () => {
      if (semesterId !== 0) {
        try {
          // Now that semesterId is updated, make the other requests
          const scheduleStatistics =
            await DashboardService.getScheduleStatistic(semesterId);
          setScheduleSemester(scheduleStatistics);

          const moduleActivityStatistics =
            await DashboardService.getAllModuleActivityStatistic(semesterId);
          setModuleActivityStat(moduleActivityStatistics);
        } catch (error) {
          console.log('Error occurred when fetching additional data');
        }
      }
    };

    fetchAdditionalData();
    // dispatch(getAllSemester());
  }, [semesterId]);

  console.log('sdffvfv');

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
            <Row gutter={[16, 16]} justify="space-between" align="middle">
              <Col flex="1">
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
              <Col flex="1">
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
              <Col flex="1">
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
              <Col flex="1">
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
              <Col flex="1">
                <Card style={{ backgroundColor: '#f1e7ff' }}>
                  <Row>
                    <Col span={17}>
                      <Typography.Text className={styles.subTitle}>
                        Modules
                      </Typography.Text>
                      <br />
                      <Typography.Text className={styles.subInfo}>
                        {dashboardStat.totalModule
                          ? dashboardStat.totalModule
                          : '...'}
                      </Typography.Text>
                    </Col>
                    <Col
                      span={7}
                      style={{ display: 'flex', alignItems: 'center' }}
                    >
                      <MdOutlineViewModule size={'40px'} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      {/* <div>
        <HomeCalendar />
      </div> */}
      <Card style={{ marginTop: 10 }}>
        <Select
          showSearch
          style={{ width: 200 }}
          value={semesterId}
          onChange={(value) => {
            setSemesterId(value);
          }}
          placeholder="Search for an option"
          optionFilterProp="children"
          filterOption={(input, option) => {
            const children = option?.children as unknown as string;
            const normalizeString = (str: string) => {
              return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            };

            const normalizedChildren = normalizeString(children).toLowerCase();
            const normalizedInput = normalizeString(input).toLowerCase();
            return normalizedChildren.includes(normalizedInput);
          }}
        >
          {semester.map((sem) => (
            <Select.Option
              key={sem.semesterID}
              value={sem.semesterID}
              style={{
                color:
                  sem.semesterStatus === 2
                    ? 'blue'
                    : sem.semesterStatus === 1
                    ? 'gray'
                    : sem.semesterStatus === 3
                    ? 'green'
                    : 'transparent',
              }}
            >
              {sem.semesterCode +
                ' (' +
                (sem.semesterStatus === 1
                  ? 'Not Yet)'
                  : sem.semesterStatus === 2
                  ? 'On-going)'
                  : sem.semesterStatus === 3
                  ? 'Finished)'
                  : '...')}
            </Select.Option>
          ))}
        </Select>

        <Row gutter={[24, 0]} style={{ marginTop: '20px' }}>
          <Col xs={24} sm={24} md={12} lg={12} xl={11} className="mb-24">
            <Card
              bordered={false}
              className="criclebox h-full"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* <BarChart /> */}
              <Typography className={styles.tableTitle}>Attendance</Typography>
              <PieChart
                colors={paletteSchedule}
                series={[
                  {
                    data: [
                      {
                        value: scheduleSemester?.notYetCount ?? 0,
                        label: 'Not Yet',
                      },
                      {
                        value: scheduleSemester?.attendedCount ?? 0,
                        label: 'Attended',
                      },
                      {
                        value: scheduleSemester?.absenceCount ?? 0,
                        label: 'Absence',
                      },
                    ],
                  },
                ]}
                {...pieParamSchedule}
              />
              {/* <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <ColorShowcase color="primary" explain={'lecturerAttendance'} />
            </div> */}
            </Card>
          </Col>
          <Col xs={24} sm={24} md={12} lg={12} xl={13} className="mb-24">
            <Card
              bordered={false}
              className="criclebox h-full"
              style={{
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* <LineChart /> */}
              <Typography className={styles.tableTitle}>
                Module Activity
              </Typography>
              <PieChart
                colors={paletteModuleActivity}
                series={[
                  {
                    data: [
                      {
                        value: moduleActivityStat?.successCount ?? 0,
                        label: 'Success',
                      },
                      {
                        value: moduleActivityStat?.failedCount ?? 0,
                        label: 'Fail',
                      },
                    ],
                  },
                ]}
                {...pieParamModuleActivity}
              />
              {/* <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginTop: 20,
              }}
            >
              <ColorShowcase color="custom" explain={'status'} />
            </div> */}
            </Card>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default HomeAdmin;
