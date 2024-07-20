import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect, useCallback } from 'react';
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Input,
  Layout,
  Modal,
  Row,
  Spin,
  Table,
} from 'antd';
import { CheckCircleTwoTone } from '@ant-design/icons';
import Lottie from 'react-lottie';
import fingerprintScanAnimation from '../../../../assets/animations/Scanning_Fingerprint_animation.json'; // Adjust the path as needed
import styles from './AccountStudents.module.less';
import { useLocation } from 'react-router-dom';
import {
  EnrolledClasses,
  StudentDetail,
} from '../../../../models/student/Student';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';
import { ModuleService } from '../../../../hooks/Module';
import { Module, ModuleDetail } from '../../../../models/module/Module';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';
import { StudentService } from '../../../../hooks/StudentList';
import { CiSearch } from 'react-icons/ci';
import personIcon from '../../../../assets/imgs/person-icon.jpg';

const { Header: AntHeader } = Layout;

const AccountStudentsDetail: React.FC = () => {
  const employeeID = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.employeeID,
  );

  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const location = useLocation();
  const [student, setStudent] = useState<StudentDetail>();
  const [studentClass, setStudentClass] = useState<EnrolledClasses[]>([]);
  const [studentID, setStudentID] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [progressStep1, setProgressStep1] = useState(0);
  const [progressStep2, setProgressStep2] = useState(0);
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]);
  const [module, setModule] = useState<Module>();
  const [moduleID, setModuleID] = useState(0);
  const [moduleDetail, setModuleDetail] = useState<ModuleDetail[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemesterClass, setFilteredSemesterClass] =
    useState<EnrolledClasses[]>(studentClass);
  const [isUpdate, setIsUpdate] = useState(false);

  useEffect(() => {
    if (location.state && location.state.studentID) {
      setStudentID(location.state.studentID);
    }
  }, [location.state]);

  const ConnectWebsocket = useCallback(() => {
    const ws = new WebSocket('ws://34.81.224.196/ws/client', [
      'access_token',
      token,
    ]);
    ws.onopen = () => {
      console.log('WebSocket connection opened');
    };

    ws.onmessage = (event) => {
      console.log('Message received:', event.data);
      console.log('Student ID', studentID);
      const message = JSON.parse(event.data);
      switch (message.Event) {
        case 'RegisterFingerSuccessfully': {
          const data = message.Data;
          const StudentID = data.StudentID;
          const fingerNumber = data.Finger;

          if (studentID == StudentID) {
            console.log('Success!!!!!!!!!');
            if (fingerNumber == 1) {
              setProgressStep1(3);
            } else if (fingerNumber == 2) {
              setProgressStep2(3);
            }
          }
          break;
        }
        default: {
          console.log('Undefined Event!');
          break;
        }
      }
    };

    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      ws.close(); // Close the WebSocket when component unmounts
    };
  }, [token, studentID]);

  useEffect(() => {
    ConnectWebsocket();
  }, [ConnectWebsocket]);

  const studentDetails = [
    { title: 'Student Name', value: student?.result.displayName },
    { title: 'Student Code', value: student?.result.studentCode },
    { title: 'Address', value: student?.result.address },
    { title: 'Date Of Birth', value: student?.result.dob },
    { title: 'Email', value: student?.result.email },
    { title: 'Phone Number', value: student?.result.phoneNumber },
    { title: 'Address', value: student?.result.address },
    // {
    //   title: 'Authenticated',
    //   value: student?.isAuthenticated ? 'true' : 'false',
    //   isAuthenticated: true,
    // },
  ];

  useEffect(() => {
    if (studentID !== '') {
      const response = StudentService.getStudentByID(studentID);

      response
        .then((data) => {
          setStudent(data || undefined);
          setStudentClass(data?.result.enrolledClasses || []);
        })
        .catch((error) => {
          console.log('get student by id error: ', error);
        });
    }
  }, [studentID]);

  useEffect(() => {
    const response = ModuleService.getModuleByEmployeeID(employeeID ?? '');

    response
      .then((data) => {
        setModule(data || undefined);
        setModuleDetail(data?.result || []);
      })
      .catch((error) => {
        console.log('get module by id error: ', error);
      });
  }, [employeeID]);

  const handleSearchClass = (value: string) => {
    setSearchInput(value);
    const filtered = student?.result.enrolledClasses.filter(
      (item) =>
        item.classCode &&
        item.classCode.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSemesterClass(filtered ?? []);
    setIsUpdate(true);
  };

  const activeModuleRegisterThree = (
    moduleID: number,
    registerMode: number,
  ) => {
    const RegisterMode = {
      StudentID: studentID,
      FingerRegisterMode: registerMode,
    };
    // const schedule = {
    //   ScheduleID: 0,
    // };

    ModuleService.activeModuleMode(moduleID, 1, RegisterMode, token)
      .then((data) => {
        console.log('Response data:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleModuleClick = (moduleId: number) => {
    if (moduleID === moduleId) {
      setModuleID(0); // Unclick will set moduleID to 0
    } else {
      setModuleID(moduleId);
    }
  };

  const columns = [
    {
      key: '1',
      title: 'Class ID',
      dataIndex: 'classID',
    },
    {
      key: '2',
      title: 'Class Code',
      dataIndex: 'classCode',
    },
    {
      key: '3',
      title: 'status',
      dataIndex: 'classStatus',
      render: (classStatus: boolean) => (
        <div>
          <p style={{ color: classStatus ? 'green' : 'red' }}>
            {classStatus ? 'active' : 'inactive'}
          </p>
        </div>
      ),
    },
    {
      key: '4',
      title: 'Absence',
      dataIndex: 'absencePercentage',
      render: (absencePercentage: number) => (
        <div>
          <p style={{ color: absencePercentage >= 20 ? 'red' : 'green' }}>
            {absencePercentage}
          </p>
        </div>
      ),
    },
  ];

  const showModal = () => {
    console.log('module', moduleID);
    setIsModalVisible(true);
    setProgressStep1(1);
    setProgressStep2(1);

    // setTimeout(() => {
    //   setProgressStep1(2);
    // }, 2000);
    // setTimeout(() => {
    //   setProgressStep1(3);
    // }, 4000);
    // setTimeout(() => {
    //   setProgressStep2(2);
    // }, 6000);
    // setTimeout(() => {
    //   setProgressStep2(3);
    // }, 8000);
  };

  const clearTimeouts = () => {
    timeoutIds.forEach((id) => clearTimeout(id));
    setTimeoutIds([]);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setProgressStep1(0);
    setProgressStep2(0);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setProgressStep1(0);
    setProgressStep2(0);
  };

  const handleConfirmUpload = () => {
    // Perform actions to confirm upload, e.g., save fingerprint data
    console.log('Fingerprint upload confirmed!');
    // Optionally, close the modal
    setIsModalVisible(false);
    // Reset progress steps
    setProgressStep1(0);
    setProgressStep2(0);
  };

  const handleReset = () => {
    clearTimeouts();
    setProgressStep1(0);
    setProgressStep2(0);
    showModal();
  };

  const renderProgress = (step: number) => {
    switch (step) {
      case 1:
        return <Spin />;
      case 2:
        return <Spin />;
      case 3:
        return <CheckCircleTwoTone twoToneColor="#52c41a" />;
      default:
        return null;
    }
  };

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: fingerprintScanAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <Content className={styles.accountStudentContent}>
      <ContentHeader
        contentTitle="Student"
        previousBreadcrumb={'Home / Account / Student / '}
        currentBreadcrumb={'Student Detail'}
        key={''}
      />
      <Card className={styles.cardHeaderDetail}>
        <Row gutter={[16, 16]}>
          <Col span={9}>
            <div>
              <div>
                <img
                  src={student.result.avatar || personIcon}
                  alt="Student"
                  className={styles.studentImg}
                />
              </div>
              {student.result.fingerprintTemplates.length === 0 && (
                <div>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    block
                    onClick={() => {
                      showModal();
                      activeModuleRegisterThree(moduleID, 3);
                    }}
                  >
                    <p>Register Fingerprints</p>
                  </Button>

                  <Content style={{ marginTop: 20 }}>
                    {moduleDetail.length === 0 ? (
                      <Empty description="No modules available" />
                    ) : (
                      <Card>
                        {moduleDetail.map((item, index) => (
                          <Card
                            onClick={() => handleModuleClick(item.moduleID)}
                            key={index}
                            className={`${styles.unselectedModule} ${
                              moduleID === item.moduleID
                                ? styles.selectedModule
                                : ''
                            }`}
                          >
                            <Row>
                              <Col span={15}>
                                <p className={styles.upTitle}>
                                  Module {item.moduleID}
                                </p>
                                <br />
                                <p className={styles.upDetail}>
                                  {item.status === 1 ? (
                                    <>
                                      <Badge status="success" /> online
                                    </>
                                  ) : item.status === 2 ? (
                                    <>
                                      <Badge status="error" /> offline
                                    </>
                                  ) : null}
                                </p>
                              </Col>
                              <Col
                                span={9}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                }}
                              >
                                <p>
                                  {item.mode === 1 ? (
                                    <p>
                                      Mode:{' '}
                                      <span style={{ fontWeight: 'bold' }}>
                                        Register
                                      </span>
                                    </p>
                                  ) : item.mode === 2 ? (
                                    <p>
                                      Mode:{' '}
                                      <span style={{ fontWeight: 'bold' }}>
                                        Check Attendance
                                      </span>
                                    </p>
                                  ) : null}
                                </p>
                              </Col>
                            </Row>
                          </Card>
                        ))}
                      </Card>
                    )}
                  </Content>
                </div>
              )}
            </div>
          </Col>
          <Col span={15}>
            <Content>
              <AntHeader className={styles.tableHeader}>
                <p className={styles.tableTitle}>Student Details</p>
              </AntHeader>

              <Col span={24}>
                <Content>
                  <Content>
                    <table className={styles.studentDetailsTable}>
                      <tbody>
                        {studentDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className={styles.updateStudentTitle}>
                              {detail.title}
                            </td>
                            <td>
                              <p>{detail.value}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Content>
                </Content>
              </Col>
              <Col>
                <Card className={styles.cardHeader}>
                  <Content>
                    <AntHeader className={styles.tableHeader}>
                      <p className={styles.tableTitle}>
                        Class of {student.result.displayName}
                      </p>
                      <Row gutter={[16, 16]}>
                        <Col>
                          <Input
                            placeholder="Search by class code"
                            suffix={<CiSearch />}
                            variant="filled"
                            value={searchInput}
                            onChange={(e) => handleSearchClass(e.target.value)}
                          ></Input>
                        </Col>
                      </Row>
                    </AntHeader>
                  </Content>
                </Card>
                <Table
                  columns={columns}
                  dataSource={(!isUpdate
                    ? studentClass
                    : filteredSemesterClass
                  ).map((item, index) => ({
                    key: index,
                    classID: item.classID,
                    classCode: item.classCode,
                    classStatus: item.classStatus,
                    absencePercentage: item.absencePercentage + '%',
                  }))}
                  pagination={{
                    showSizeChanger: true,
                  }}
                ></Table>
              </Col>
            </Content>
          </Col>
        </Row>
      </Card>
      <Modal
        title="Fingerprint Registration"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="reset" onClick={handleReset}>
            Reset
          </Button>,
          <Button key="submit" type="primary" onClick={handleConfirmUpload}>
            Submit
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Lottie options={defaultOptions} height={100} width={100} />
            <p>Registering Fingerprint Template 1...</p>
            {renderProgress(progressStep1)}
          </Col>
          <Col span={12} style={{ textAlign: 'center' }}>
            <Lottie options={defaultOptions} height={100} width={100} />
            <p>Registering Fingerprint Template 2...</p>
            {renderProgress(progressStep2)}
          </Col>
        </Row>
      </Modal>
    </Content>
  );
};

export default AccountStudentsDetail;
