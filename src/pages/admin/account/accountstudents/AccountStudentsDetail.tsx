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
  message,
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
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';
import { StudentService } from '../../../../hooks/StudentList';
import { CiSearch } from 'react-icons/ci';
import personIcon from '../../../../assets/imgs/person-icon.jpg';
import moduleImg from '../../../../assets/imgs/module00.png';
import {
  activeModule,
  clearModuleMessages,
} from '../../../../redux/slice/Module';
import { SessionServive } from '../../../../hooks/Session';

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
  const [moduleID, setModuleID] = useState<number>(0);
  const [moduleDetail, setModuleDetail] = useState<ModuleDetail[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemesterClass, setFilteredSemesterClass] =
    useState<EnrolledClasses[]>(studentClass);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isRegisterPressed, setIsRegisterPressed] = useState(false);
  const [sessionID, setSessionID] = useState<number>(0);
  const [status, setStatus] = useState('');
  const [isActiveModule, setIsActiveModule] = useState(false);
  const [changeModuleUI, setChangeModuleUI] = useState(0)

  const dispatch = useDispatch();

  const failMessage = useSelector((state: RootState) => state.module.message);
  const successMessage = useSelector(
    (state: RootState) => state.module.moduleDetail,
  );

  console.log('session', sessionID);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage.title);
      setSessionID(successMessage.result.sessionId);
      setStatus('success');
      dispatch(clearModuleMessages());
    }
    if (failMessage && failMessage.data.error.title) {
      message.error(`${failMessage.data.error.title}`);
      setStatus('fail');
      dispatch(clearModuleMessages());
    }
  }, [successMessage, failMessage, dispatch]);

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
        case 'ModuleConnected': {
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 1);

          setModuleDetail(moduleDetail || []);
          console.log('change module view')


          break;
        }
        case 'ModuleLostConnected': {
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 2);
          setModuleDetail(moduleDetail || []);

          setTimeout(() => {
            50
          }, 50);

          setModuleDetail(moduleDetail || []);

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

  const modifyModuleConnection = (moduleId: number, conenctionStatus: number) => {
    const existedModule = moduleDetail.find(m => m.moduleID == moduleId);
    if(existedModule){
      existedModule.connectionStatus = conenctionStatus;
    }
  }

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
      setChangeModuleUI((prev) => (prev) + 1);
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
    SessionId: number,
    registerMode: number,
  ) => {
    const RegisterMode = {
      StudentID: studentID,
      FingerRegisterMode: registerMode,
    };
    // const schedule = {
    //   ScheduleID: 0,
    // };

    ModuleService.activeModuleMode(moduleID, 1, SessionId, RegisterMode, token)
      .then((data) => {
        console.log('Response data:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  // const handleModuleClick = (moduleId: number) => {
  //   if (moduleID === moduleId) {
  //     setModuleID(0); // Unclick will set moduleID to 0
  //   } else {
  //     setModuleID(moduleId);
  //   }
  //   ModuleService.activeModule(moduleID, 6, token);
  // };

  const handleModuleClick = async (moduleId: number) => {
    if (moduleID === moduleId) {
      setModuleID(0); // Unclick will set moduleID to 0
      setStatus('');
      dispatch(clearModuleMessages()); // Clear messages when unselecting
    } else {
      setModuleID(moduleId);
      const arg = {
        ModuleID: moduleId,
        Mode: 6,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
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
  };

  const clearTimeouts = () => {
    timeoutIds.forEach((id) => clearTimeout(id));
    setTimeoutIds([]);
  };

  const handleOk = () => {
    setIsRegisterPressed(false);
    setIsModalVisible(false);
    setProgressStep1(0);
    setProgressStep2(0);
  };

  const handleCancel = () => {
    setIsRegisterPressed(false);
    setIsModalVisible(false);
    setProgressStep1(0);
    setProgressStep2(0);
  };

  const handleConfirmUpload = () => {
    console.log('Fingerprint upload confirmed!');
    SessionServive.submitSession(sessionID, token);
    setIsModalVisible(false);
    setIsRegisterPressed(false);
    setProgressStep1(0);
    setProgressStep2(0);
  };

  const handleReset = () => {
    clearTimeouts();
    setProgressStep1(0);
    setProgressStep2(0);
    setIsRegisterPressed(false);
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
                      // activeModuleRegisterThree(moduleID, 3);
                    }}
                  >
                    <p>Register Fingerprints</p>
                  </Button>
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
        width={800}
        // bodyStyle={{ minHeight: '300px' }}
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
          <Col span={12}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={14}>
                  <p style={{ fontWeight: 500 }}>
                    Module Connecting: {moduleID > 0 && <span>{moduleID}</span>}
                  </p>
                </Col>

                <Col span={10}>
                  <p style={{ fontWeight: 500 }}>
                    Status:{' '}
                    {status === 'success' && (
                      <span style={{ color: 'green' }}>Connected</span>
                    )}
                    {status === 'fail' && (
                      <span style={{ color: 'red' }}>Fail</span>
                    )}
                  </p>
                </Col>
              </Row>
            </Card>
            <Content className='module_cards' style={{ marginTop: 5 }}>
              {moduleDetail.length === 0 ? (
                <Empty description="No modules available" />
              ) : (
                ////////////////vô đc
                <Card style={{ height: 300, overflowY: 'auto' }}>
                  <>{console.log("Trc khi vô")}</>
                  {moduleDetail.map((item, index) => (
                    //ko vo đc
                    <Button
                      onClick={() => handleModuleClick(item.moduleID)}
                      key={index}
                      className={`${styles.unselectedModule} ${
                        moduleID === item.moduleID ? styles.selectedModule : ''
                      }`}
                      disabled={isActiveModule}
                    >
                      <>{console.log("sau khi vô")}</>
                      <Row>
                        <Col span={3} style={{ marginRight: 80 }}>
                          <p className={styles.upTitle}>
                            Module {item.moduleID}
                          </p>
                          <br />
                          <img src={moduleImg} alt='module' style={{width:45, height:45}}/>
                        </Col>
                        <Col span={3} style={{}}>
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
                                  Attendance
                                </span>
                              </p>
                            ) : null}
                          </p>
                          <p className={styles.upDetail}>
                            {item.status === 1 ? (
                              <p style={{color:'blue'}}>
                                available
                              </p>
                            ) : item.status === 2 ? (
                              <p style={{color:'red'}}>
                                 unavailable
                              </p>
                            ) : null}
                          </p>
                          <p className={styles.upDetail}>
                            {item.connectionStatus === 1 ? (
                              <>
                                <Badge status="success" /> online
                              </>
                            ) : item.connectionStatus === 2 ? (
                              <>
                                <Badge status="error" /> offline
                              </>
                            ) : null}
                          </p>
                        </Col>
                      </Row>
                    </Button>
                  ))}
                </Card>
              )}
            </Content>
            <Button
              type="primary"
              block
              onClick={() => {
                setIsActiveModule(true);
                activeModuleRegisterThree(moduleID, sessionID, 3);
                setIsRegisterPressed(true);
                setProgressStep1(1);
                setProgressStep2(1);
              }}
              style={{ width: '100%', marginTop: 20 }}
              disabled={isActiveModule || !moduleID}
            >
              Register
            </Button>
          </Col>

          {isRegisterPressed && (
            <Col span={12}>
              <Col style={{ textAlign: 'center', marginBottom: 60 }}>
                <Lottie options={defaultOptions} height={100} width={100} />
                <p>Registering Fingerprint Template 1...</p>
                {renderProgress(progressStep1)}
              </Col>
              <Col style={{ textAlign: 'center' }}>
                <Lottie options={defaultOptions} height={100} width={100} />
                <p>Registering Fingerprint Template 2...</p>
                {renderProgress(progressStep2)}
              </Col>
            </Col>
          )}
        </Row>
      </Modal>
    </Content>
  );
};

export default AccountStudentsDetail;
