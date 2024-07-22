import { Card, Col, Input, Layout, Row, Space, Table, Typography } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import styles from './AdminClass.module.less';
import { useLocation } from 'react-router-dom';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { CiSearch } from 'react-icons/ci';
import { ClassDetail, Schedule, Student } from '../../../models/Class';
import { ClassService } from '../../../hooks/Class';
import { IoPersonSharp } from 'react-icons/io5';

const { Header: AntHeader } = Layout;

const AdminClassDetail: React.FC = () => {
  const location = useLocation();
  const [classStudent, setClassStudent] = useState<Student[]>([]);
  const [classSchedule, setClassSchedule] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<ClassDetail>();
  const [classID, setClassID] = useState<number>(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudentClass, setFilteredStudentClass] =
    useState<Student[]>(classStudent);

  console.log('clss', classID);

  const classDetails = [
    { title: 'Class ID', value: classes?.result.classID },
    { title: 'Class Code', value: classes?.result.classCode },
    {
      title: 'Status',
      value: classes?.result.classStatus ? 'active' : 'inactive',
      classStatus: true,
    },
    { title: 'Semester', value: classes?.result.semester.semesterCode },
    { title: 'Room', value: classes?.result.room.roomName },
    { title: 'Subject', value: classes?.result.subject.subjectName },
    {
      title: 'Lecturer',
      value: classes?.result.lecturer.displayName,
    },
  ];

  useEffect(() => {
    if (location.state && location.state.classID) {
      setClassID(location.state.classID);
    }
  }, [location.state]);

  useEffect(() => {
    if (classID !== 0) {
      const response = ClassService.getClassByID(classID);

      response
        .then((data) => {
          setClasses(data || undefined);
          setClassStudent(data?.result.students || []);
          setClassSchedule(data?.result.schedules || []);
          setFilteredStudentClass(data?.result.students || []);
        })
        .catch((error) => {
          console.log('get class by id error: ', error);
        });
    }
  }, [classID]);

  const handleSearchStudent = (value: string) => {
    setSearchInput(value);
    const filtered = classes?.result.students.filter(
      (item) =>
        (item.displayName &&
          item.displayName.toLowerCase().includes(value.toLowerCase())) ||
        (item.email &&
          item.email.toLowerCase().includes(value.toLowerCase())) ||
        (item.studentCode &&
          item.studentCode.toLowerCase().includes(value.toLowerCase())),
    );
    setFilteredStudentClass(filtered ?? []);
    setIsUpdate(true);
  };

  const columnsStudent = [
    {
      key: '1',
      title: 'Student Name',
      dataIndex: 'studentName',
    },
    {
      key: '2',
      title: 'Email',
      dataIndex: 'studentEmail',
    },
    {
      key: '3',
      title: 'Student Code',
      dataIndex: 'studentCode',
    },
    {
      key: '4',
      title: 'Absence',
      dataIndex: 'absencePercentage',
      render: (absencePercentage: number) => (
        <div>
          <p style={{ color: absencePercentage >= 20 ? 'red' : 'green' }}>
            {absencePercentage}%
          </p>
        </div>
      ),
    },
  ];

  const columnsSchedule = [
    {
      key: '1',
      title: 'Schedule ID',
      dataIndex: 'scheduleID',
    },
    {
      key: '2',
      title: 'Date',
      dataIndex: 'date',
    },
    {
      key: '3',
      title: 'Date Of Week',
      dataIndex: 'dateOfWeek',
    },
    {
      key: '4',
      title: 'Status',
      dataIndex: 'scheduleStatus',
      render: (scheduleStatus: boolean) => (
        <div>
          <p style={{ color: scheduleStatus ? 'green' : 'red' }}>
            {scheduleStatus ? 'active' : 'inactive'}
          </p>
        </div>
      ),
    },
    {
      key: '5',
      title: 'Slot',
      dataIndex: 'slot',
    },
  ];

  const teacherDetails = [
    { label: 'Name', value: classes?.result.lecturer.displayName },
    { label: 'Email', value: classes?.result.lecturer.email },
    { label: 'Department', value: classes?.result.lecturer.department },
  ];

  return (
    <Content className={styles.accountClassContent}>
      <ContentHeader
        contentTitle="Class"
        previousBreadcrumb={'Home / Class / '}
        currentBreadcrumb={'Class Detail'}
        key={''}
      />
      <Card className={styles.cardHeaderDetail}>
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <Card style={{ height: '100%' }}>
              <Row>
                <Col span={4}>
                  <img
                    alt="Lecturer"
                    src={classes?.result.lecturer.avatar}
                    style={{ width: 100, height: 100 }}
                  />
                </Col>
                <Col span={19} style={{ marginLeft: 20 }}>
                  {/* <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Row style={{ marginBottom: 40 }}>
                        <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                          <IoPersonSharp size={20} /> About
                        </p>
                      </Row>
                      <Row style={{ marginBottom: 40 }}>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>Name: </p>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>Name: </p>
                      </Row>
                    </Col>
                    <Col span={12}>
                      <br />
                      <Row style={{ marginTop: 40 }}>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>Name: </p>
                      </Row>
                    </Col>
                  </Row> */}
                  <Content>
                    <Space
                      direction="horizontal"
                      className={styles.accountInfo}
                    >
                      {teacherDetails.map((detail) => (
                        <Space
                          direction="vertical"
                          className={styles.accountDetails}
                          key={detail.label}
                        >
                          <Typography.Text className={styles.textTitle}>
                            {detail.label}
                          </Typography.Text>
                          <Typography.Title level={4}>
                            {detail.value}
                          </Typography.Title>
                        </Space>
                      ))}
                    </Space>
                  </Content>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={10}>
            <Content>
              <AntHeader className={styles.tableHeader}>
                <p className={styles.tableTitle}>Class Details</p>
              </AntHeader>
              <Col span={24}>
                <Content>
                  <Content>
                    <table className={styles.classDetailsTable}>
                      <tbody>
                        {classDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className={styles.updateClassTitle}>
                              {detail.title}
                            </td>
                            <td>
                              <p
                                style={{
                                  color: detail.classStatus
                                    ? detail.value === 'true'
                                      ? 'green'
                                      : 'red'
                                    : 'inherit',
                                }}
                              >
                                {detail.value}
                              </p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Content>
                </Content>
              </Col>
            </Content>
          </Col>
        </Row>
        <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
          <Col span={24}>
            <Card className={styles.cardHeader}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Schedule</p>
                </AntHeader>
              </Content>
            </Card>
            <Table
              columns={columnsSchedule}
              dataSource={classSchedule.map((item, index) => ({
                key: index,
                scheduleID: item.scheduleID,
                date: item.date,
                dateOfWeek: item.dateOfWeek,
                scheduleStatus: item.scheduleStatus,
                slot: item.slot,
              }))}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card className={styles.cardHeader}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Student</p>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Input
                        placeholder="Search "
                        suffix={<CiSearch />}
                        variant="filled"
                        value={searchInput}
                        onChange={(e) => handleSearchStudent(e.target.value)}
                      ></Input>
                    </Col>
                  </Row>
                </AntHeader>
              </Content>
            </Card>
            <Table
              columns={columnsStudent}
              dataSource={(!isUpdate ? classStudent : filteredStudentClass).map(
                (item, index) => ({
                  key: index,
                  studentName: item.displayName,
                  studentEmail: item.email,
                  studentCode: item.studentCode,
                  absencePercentage: item.absencePercentage,
                }),
              )}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default AdminClassDetail;
