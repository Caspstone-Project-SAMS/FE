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
  FingerprintTemplate,
  StudentDetail,
} from '../../../../models/student/Student';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';
import { ModuleService } from '../../../../hooks/Module';
import {
  Module,
  ModuleByID,
  ModuleDetail,
} from '../../../../models/module/Module';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';
import { StudentService } from '../../../../hooks/StudentList';
import { CiSearch } from 'react-icons/ci';
import { BsFingerprint } from 'react-icons/bs';
import personIcon from '../../../../assets/imgs/person-icon.jpg';
import moduleImg from '../../../../assets/imgs/module00.png';
import {
  activeModule,
  clearModuleMessages,
} from '../../../../redux/slice/Module';
import { SessionServive } from '../../../../hooks/Session';
import modules from '../../../../assets/imgs/module.png';
import { Select } from 'antd';

const { Option } = Select;

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
  const [studentFinger, setStudentFinger] = useState<FingerprintTemplate[]>([]);
  const [studentID, setStudentID] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleModule, setIsModalVisibleModule] = useState(false);
  const [progressStep1, setProgressStep1] = useState(0);
  const [progressStep2, setProgressStep2] = useState(0);
  const [timeoutIds, setTimeoutIds] = useState<number[]>([]);
  const [module, setModule] = useState<Module>();
  const [moduleByID, setModuleByID] = useState<ModuleByID>();
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
  const [changeModuleUI, setChangeModuleUI] = useState(0);
  // const [change, setChange] = useState(0);
  const [modalContinue, setModalContinue] = useState(false);
  const [connectionStatusFilter, setConnectionStatusFilter] = React.useState<
    number | undefined
  >(undefined);

  const [searchModuleID, setSearchModuleID] = useState<number | undefined>(
    undefined,
  );

  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  console.log('finger', studentFinger);

  const failMessage = useSelector((state: RootState) => state.module.message);
  const successMessage = useSelector(
    (state: RootState) => state.module.moduleDetail,
  );

  console.log('type', typeof moduleDetail);

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

  // const modifyModuleConnection = (moduleId: number, conenctionStatus: number) => {
  //   console.log('0', moduleDetail)
  //   const existedModule = moduleDetail.find(m => m.moduleID == moduleId);
  //   console.log('1', moduleDetail)
  //   if(existedModule){
  //     existedModule.connectionStatus = conenctionStatus;
  //   }
  //   console.log('2', moduleDetail)
  //   setModuleDetail(moduleDetail)
  // }

  const modifyModuleConnection = useCallback(
    (moduleId: number, connectionStatus: number) => {
      const existedModule = moduleDetail.find((m) => m.moduleID === moduleId);
      if (existedModule) {
        existedModule.connectionStatus = connectionStatus;
      }
      console.log('2', moduleDetail);
    },
    [moduleDetail],
  );

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
              setProgressStep2(1);
            } else if (fingerNumber == 2) {
              setProgressStep2(3);
            }
          }
          break;
        }
        case 'ModuleConnected': {
          console.log('c', moduleDetail);
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 1);
          setModuleDetail([...moduleDetail]);
          // setChange((prev) => prev + 1);
          console.log('connected');
          const specificModule = moduleDetail.find(
            (module) => module.moduleID === moduleId,
          );
          setModuleByID(specificModule as ModuleByID | undefined);
          break;
        }
        case 'ModuleLostConnected': {
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 2);
          setModuleDetail([...moduleDetail]);
          // setChange((prev) => prev + 1);
          console.log('disconnected');
          const specificModule = moduleDetail.find(
            (module) => module.moduleID === moduleId,
          );
          setModuleByID(specificModule as ModuleByID | undefined);
          break;

          // setTimeout(() => {
          //   50
          // }, 50);

          // setModuleDetail(moduleDetail || []);
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
  }, [token, studentID, moduleDetail, modifyModuleConnection]);

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
    if (moduleID !== 0) {
      const response = ModuleService.getModuleByID(moduleID);

      response
        .then((data) => {
          setModuleByID(data || undefined);
        })
        .catch((error) => {
          console.log('get module by id error: ', error);
        });
    }
  }, [moduleID]);

  useEffect(() => {
    if (studentID !== '') {
      const response = StudentService.getStudentByID(studentID);

      response
        .then((data) => {
          // setStudent(data || undefined);
          // setStudentClass(data?.result.enrolledClasses || []);
          // setStudentFinger(data?.result.fingerprintTemplates || []);
          setStudent((prevStudent) => {
            if (JSON.stringify(prevStudent) !== JSON.stringify(data)) {
              return data || undefined;
            }
            return prevStudent;
          });
          setStudentClass((prevClasses) => {
            if (
              JSON.stringify(prevClasses) !==
              JSON.stringify(data?.result.enrolledClasses)
            ) {
              return data?.result.enrolledClasses || [];
            }
            return prevClasses;
          });
          setStudentFinger((prevFingers) => {
            if (
              JSON.stringify(prevFingers) !==
              JSON.stringify(data?.result.fingerprintTemplates)
            ) {
              return data?.result.fingerprintTemplates || [];
            }
            return prevFingers;
          });
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
        console.log('detai', moduleDetail);
        console.log('detail', data?.result);
      })
      .catch((error) => {
        console.log('get module by id error: ', error);
      });
    setChangeModuleUI((prev) => prev + 1);
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
    setLoading(true);
    setIsActiveModule(true);
    if (moduleID === moduleId) {
      setModuleID(0); // Unclick will set moduleID to 0
      setStatus('');
      setModuleByID(undefined);
      setIsActiveModule(false);
      setLoading(false);
      dispatch(clearModuleMessages()); // Clear messages when unselecting
    } else {
      setModuleID(moduleId);
      const arg = {
        ModuleID: moduleId,
        Mode: 6,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
      setLoading(false);
      setIsActiveModule(false);
    }
  };

  const LoadingIndicator = () => (
    <span className="loading-spinner">
      <Spin size="medium" />
    </span>
  );

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
    if (modalContinue === false) {
      setIsModalVisible(true);
      setIsActiveModule(true);
      activeModuleRegisterThree(moduleID, sessionID, 3);
      setIsRegisterPressed(true);
      setProgressStep1(1);
      // setProgressStep2(1);
    } else {
      setIsModalVisible(true);
    }
  };

  const showModalModule = () => {
    setIsModalVisibleModule(true);
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
    setModalContinue(false);
  };

  const handleOkModule = () => {
    setIsModalVisibleModule(false);
  };

  const handleExit = async () => {
    try {
      const response = await ModuleService.cancelSession(
        moduleID,
        2,
        sessionID,
        token,
      );
      setIsRegisterPressed(false);
      setIsModalVisible(false);
      setIsActiveModule(false);
      setProgressStep1(0);
      setProgressStep2(0);
      setModalContinue(false);
      setModuleID(0);
      setStatus('');
      setModuleByID(undefined);
      message.success(response.title);
      console.log('adwcsad', response.title);
      return response;
    } catch (error: any) {
      message.error(error.errors);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setModalContinue(true);
    setIsActiveModule(false);
  };

  const handleCancelModule = () => {
    setIsModalVisibleModule(false);
  };

  // const handleConfirmUpload = () => {
  //   console.log('Fingerprint upload confirmed!');
  //   SessionServive.submitSession(sessionID, token);
  //   setIsModalVisible(false);
  //   setIsRegisterPressed(false);
  //   setProgressStep1(0);
  //   setProgressStep2(0);
  // };

  const handleConfirmUpload = async () => {
    try {
      console.log('Fingerprint upload confirmed!');
      const response = await SessionServive.submitSession(sessionID, token);
      message.success(response.title);
      setIsModalVisible(false);
      setIsRegisterPressed(false);
      setProgressStep1(0);
      setProgressStep2(0);
      return response;
    } catch (error: any) {
      console.error('Error uploading fingerprint:', error);
      message.error(error.errors);
    }
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

              <div>
                <Col>
                  {student.result.fingerprintTemplates.length === 0 && (
                    <Row>
                      <Button
                        style={{ width: '100%', marginBottom: 10 }}
                        type="primary"
                        block
                        onClick={() => {
                          showModal();
                          // activeModuleRegisterThree(moduleID, 3);
                        }}
                        disabled={
                          isActiveModule || !moduleID || status === 'fail'
                        }
                      >
                        <p>Register Fingerprints</p>
                      </Button>
                    </Row>
                  )}
                  <Row>
                    <Col
                      span={24}
                      style={{ display: 'flex', justifyContent: 'center' }}
                    >
                      <div className={styles.moduleCard}>
                        <div className={styles.moduleImgCtn}>
                          <img
                            src={modules}
                            alt="Module image"
                            className={styles.moduleImg}
                          />
                        </div>
                        <div className={styles.moduleInfo}>
                          <span>
                            <b>ID: </b>
                            {moduleByID?.result.moduleID}
                          </span>
                          <span>
                            <b>Status: </b>
                            <p
                              style={{
                                display: 'inline',
                                color: moduleByID?.result.status
                                  ? moduleByID?.result.status === 1
                                    ? 'green'
                                    : 'red'
                                  : 'inherit',
                              }}
                            >
                              {moduleByID?.result.status === 1
                                ? 'available'
                                : moduleByID?.result.status === 0
                                ? 'unavailable'
                                : ''}
                            </p>
                          </span>
                          <span>
                            <b>Connect: </b>
                            <p
                              style={{
                                display: 'inline',
                                alignItems: 'center',
                              }}
                            >
                              {moduleByID?.result.connectionStatus === 1 ? (
                                <>
                                  <Badge status="success" /> online
                                </>
                              ) : moduleByID?.result.connectionStatus === 2 ? (
                                <>
                                  <Badge status="error" /> offline
                                </>
                              ) : null}
                            </p>
                          </span>
                          <span>
                            <b>Mode: </b>
                            <p style={{ display: 'inline' }}>
                              {moduleByID?.result.mode === 1
                                ? 'Register'
                                : moduleByID?.result.mode === 2
                                ? 'Attendance'
                                : ''}
                            </p>
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Button
                      style={{
                        width: '100%',
                        marginTop: 20,
                        marginBottom: 20,
                      }}
                      type="primary"
                      block
                      onClick={() => {
                        showModalModule();
                      }}
                    >
                      <p>Select Module</p>
                    </Button>
                  </Row>
                  <Modal
                    title="Select Module"
                    visible={isModalVisibleModule}
                    onOk={handleOkModule}
                    onCancel={handleCancelModule}
                    width={500}
                    footer={[
                      <Button key="cancel" onClick={handleCancelModule}>
                        Exit
                      </Button>,
                    ]}
                  >
                    <Row style={{ marginTop: 20 }}>
                      <Card style={{ width: '100%' }}>
                        <Row gutter={[16, 16]}>
                          <Col span={14}>
                            <p style={{ fontWeight: 500 }}>
                              Module Connecting:{' '}
                              {moduleID > 0 && <span>{moduleID}</span>}
                            </p>
                          </Col>

                          <Col span={10}>
                            <p style={{ fontWeight: 500 }}>
                              Status:
                              {loading && <LoadingIndicator />}
                              {status === 'success' && (
                                <span style={{ color: 'green' }}>
                                  Connected
                                </span>
                              )}
                              {status === 'fail' && (
                                <span style={{ color: 'red' }}>Fail</span>
                              )}
                            </p>
                          </Col>
                        </Row>
                      </Card>
                      <Content
                        className="module_cards"
                        style={{ marginTop: 5 }}
                      >
                        <Row gutter={[16, 16]} style={{ marginBottom: 5 }}>
                          <Col span={18}>
                            <Input
                              placeholder="Search by Module ID"
                              type="number"
                              onChange={(e) =>
                                setSearchModuleID(
                                  Number(e.target.value) || undefined,
                                )
                              }
                            />
                          </Col>
                          <Col span={6}>
                            <Select
                              defaultValue=""
                              style={{ width: '100%' }}
                              onChange={(e) =>
                                setConnectionStatusFilter(
                                  Number(e) || undefined,
                                )
                              }
                            >
                              <Option value={''}>All</Option>
                              <Option value={'1'}>Online</Option>
                              <Option value={'2'}>Offline</Option>
                            </Select>
                          </Col>
                        </Row>
                        {moduleDetail.length === 0 ? (
                          <Empty description="No modules available" />
                        ) : (
                          <Card style={{ height: 400, overflowY: 'auto' }}>
                            {moduleDetail
                              .filter(
                                (item) =>
                                  (connectionStatusFilter === undefined ||
                                    item.connectionStatus ===
                                      connectionStatusFilter) &&
                                  (searchModuleID === undefined ||
                                    item.moduleID === searchModuleID),
                              )
                              .sort(
                                (a, b) =>
                                  a.connectionStatus - b.connectionStatus,
                              )
                              .map((item, index) => (
                                <Button
                                  onClick={() =>
                                    handleModuleClick(item.moduleID)
                                  }
                                  key={index}
                                  className={`${styles.unselectedModule} ${
                                    moduleID === item.moduleID
                                      ? styles.selectedModule
                                      : ''
                                  }`}
                                  disabled={isActiveModule || modalContinue}
                                >
                                  <Row>
                                    <Col span={3} style={{ marginRight: 80 }}>
                                      <p className={styles.upTitle}>
                                        Module {item.moduleID}
                                      </p>
                                      <br />
                                      <img
                                        src={moduleImg}
                                        alt="module"
                                        style={{ width: 45, height: 45 }}
                                      />
                                    </Col>
                                    <Col span={3}>
                                      <p>
                                        {item.mode === 1 ? (
                                          <p>
                                            Mode:{' '}
                                            <span
                                              style={{ fontWeight: 'bold' }}
                                            >
                                              Register
                                            </span>
                                          </p>
                                        ) : item.mode === 2 ? (
                                          <p>
                                            Mode:{' '}
                                            <span
                                              style={{ fontWeight: 'bold' }}
                                            >
                                              Attendance
                                            </span>
                                          </p>
                                        ) : null}
                                      </p>
                                      <p className={styles.upDetail}>
                                        {item.status === 1 ? (
                                          <p style={{ color: 'blue' }}>
                                            available
                                          </p>
                                        ) : item.status === 2 ? (
                                          <p style={{ color: 'red' }}>
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
                    </Row>
                  </Modal>
                </Col>
              </div>
            </div>
            <div>
              <Card style={{ width: '100%' }}>
                {studentFinger.length === 0 ? (
                  <Empty description="Student have no fingerprint data" />
                ) : (
                  <Row gutter={[5, 5]}>
                    {studentFinger.map((item, index) => (
                      <Col span={12}>
                        <Card>
                          <Row>
                            <Row>
                              <BsFingerprint size={30} />
                            </Row>
                            <Row>
                              <Row>
                                <b>Status:</b>
                                <span
                                  style={{
                                    color:
                                      item.status === 1
                                        ? 'green'
                                        : item.status === 2
                                        ? 'red'
                                        : 'inherit',
                                  }}
                                >
                                  {item.status === 1
                                    ? 'available'
                                    : item.status === 2
                                    ? 'unavailable'
                                    : ''}
                                </span>
                              </Row>
                              <Row>
                                <b>Create at: </b>
                                <span>
                                  {new Date(item.createdAt).toLocaleDateString(
                                    'en-GB',
                                    {
                                      day: '2-digit',
                                      month: 'long',
                                      year: 'numeric',
                                    },
                                  )}
                                </span>
                              </Row>
                            </Row>
                          </Row>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
                {student.result.fingerprintTemplates.length > 0 && (
                  <Row>
                    <Button style={{ width: ' 100%', marginTop: 5 }}>
                      Update Fingerprint
                    </Button>
                  </Row>
                )}
              </Card>
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
          <Button key="cancel" onClick={handleExit}>
            Cancel
          </Button>,
          <Button key="reset" onClick={handleReset}>
            Reset
          </Button>,
          <Button
            key="submit"
            type="primary"
            onClick={handleConfirmUpload}
            disabled={progressStep2 !== 3}
          >
            Submit
          </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          {isRegisterPressed && (
            <Col span={24}>
              <Col style={{ textAlign: 'center', marginBottom: 60 }}>
                <Lottie options={defaultOptions} height={100} width={100} />
                <p>Registering Fingerprint Template 1...</p>
                {renderProgress(progressStep1)}
              </Col>
              {(progressStep2 === 1 || progressStep2 === 3) && (
                <Col style={{ textAlign: 'center' }}>
                  <Lottie options={defaultOptions} height={100} width={100} />
                  <p>Registering Fingerprint Template 2...</p>
                  {renderProgress(progressStep2)}
                </Col>
              )}
            </Col>
          )}
        </Row>
      </Modal>
    </Content>
  );
};

export default AccountStudentsDetail;
