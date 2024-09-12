import styles from '../Class.module.less';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation, useNavigate } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  Input,
  message,
  Modal,
  Row,
  Space,
  Typography,
  Select,
  Spin,
  Popconfirm,
  PopconfirmProps,
  List,
  Avatar,
  Popover,
} from 'antd';

import module from '../../../assets/imgs/module.png';
import fingerprintIcon from '../../../assets/icons/fingerprint.png';
import reportIcon from '../../../assets/icons/Report.png';
import fptimg from '../../../assets/imgs/FPT-Logo-PNG.png';

import ClassDetailTable from '../../../components/classdetails/ClassDetailTable';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import BtnDecoration from '../../../components/global/BtnDecoration';
import { HelperService } from '../../../hooks/helpers/helperFunc';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import { ModuleService } from '../../../hooks/Module';
import { IoReload } from 'react-icons/io5';
import {
  ModuleActivity,
  ModuleByID,
  ModuleDetail,
} from '../../../models/module/Module';
import moduleImg from '../../../assets/imgs/module00.png';
import {
  activeModule,
  clearModuleMessages,
  startCheckAttendances,
  stopCheckAttendances,
  syncAttendance,
} from '../../../redux/slice/Module';
import modules from '../../../assets/imgs/module.png';
import { BsThreeDotsVertical } from 'react-icons/bs';
import onlineDots from '../../../assets/animations/Online_Dot.json';
import Lottie from 'react-lottie';

const { Option } = Select;

const ClassDetails: React.FC = () => {
  const location = useLocation();
  const { event } = location.state || {};
  const { scheduleID, classCode, room, slot, start, end, status, subjectCode } =
    event || {};

  const [classInfo, setClassInfo] = useState<
    { label: string; value: string }[]
  >([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moduleDetail, setModuleDetail] = useState<ModuleDetail[]>([]);
  const [moduleID, setModuleID] = useState<number>(0);
  const [sessionID, setSessionID] = useState<number>(0);
  const [moduleByID, setModuleByID] = useState<ModuleDetail>();
  // const [ScheduleID, setScheduleID] = useState(0);

  const [isCheckAttendance, setIsCheckAttendance] = useState(false);
  const [isActiveModule, setIsActiveModule] = useState(false);
  const [statuss, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [exit, setExit] = useState(false);

  //Temp fix------------
  const [isOkOpen, setIsOkOpen] = useState(false);
  const [studentAttendedList, setStudentAttendedList] = useState<string[]>([]);

  //Temp fix------------

  const [change, setChange] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [preparationProgress, setPreparationProgress] = useState(0);

  const employeeID = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.employeeID,
  );

  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const failMessage = useSelector((state: RootState) => state.module.message);
  const successMessage = useSelector(
    (state: RootState) => state.module.moduleDetail,
  );

  const [connectionStatusFilter, setConnectionStatusFilter] = React.useState<
    number | undefined
  >(undefined);

  const [searchModuleID, setSearchModuleID] = useState<number | undefined>(
    undefined,
  );

  const [moduleActivity, setModuleActivity] = useState<ModuleActivity[]>([]);

  const onlineDot = {
    loop: true,
    autoplay: true,
    animationData: onlineDots,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  useEffect(() => {
    if (successMessage) {
      if (exit === false) {
        message.success(successMessage.title);
      }
      if (successMessage.title == 'Connect module successfully') {
        setSessionID(successMessage.result.sessionId);
        setStatus('success');
      }

      dispatch(clearModuleMessages());
    }
    if (failMessage && failMessage.data.error.title) {
      // message.error(`${failMessage.data.error.errors}`);
      if (failMessage.data.error.title == 'Syncing data failed') {
        message.error(`${failMessage.data.error.title}`);
      } else {
        message.error(`${failMessage.data.error.errors}`);
      }
      if (failMessage.data.error.title == 'Connect module failed') {
        // message.error(`${failMessage.data.error.title}`);
        setStatus('fail');
      }

      dispatch(clearModuleMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const fetchModuleActivity = useCallback(async () => {
    try {
      const response = await ModuleService.getModuleActivityByScheduleID(
        scheduleID,
      );
      if (response && response.result) {
        const reverseList = response.result.reverse();
        setModuleActivity(reverseList);
      } else {
        setModuleActivity([]);
      }
    } catch (error) {
      console.log('error at fetchModuleActivity', error);
    }
  }, [scheduleID]);

  console.log('aaaa');

  useEffect(() => {
    if (scheduleID !== 0) {
      fetchModuleActivity();
    }
  }, [scheduleID]);

  // useEffect(() => {
  //   if (scheduleID !== 0) {
  //     const response = ModuleService.getModuleActivityByScheduleID(scheduleID);

  //     response
  //       .then((data) => {
  //         //Newest on top
  //         if (data && data.result) {
  //           const reverseList = data.result.reverse();
  //           setModuleActivity(reverseList);
  //         } else {
  //           setModuleActivity([]);
  //         }
  //       })
  //       .catch((error) => {
  //         console.log('get module by id error: ', error);
  //       });
  //   }
  // }, [scheduleID]);

  const list = moduleActivity;

  const autoConnectModule = useCallback(async () => {
    try {
      const arg = {
        ModuleID: moduleID,
        Mode: 6,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
      console.log('testttt');
    } catch (error) {
      console.log('error at auto connect module', error);
    }
  }, [moduleID, token, dispatch]);

  const modifyModuleConnection = useCallback(
    (moduleId: number, connectionStatus: number) => {
      const existedModule = moduleDetail.find((m) => m.moduleID === moduleId);
      if (existedModule) {
        existedModule.connectionStatus = connectionStatus;
      }
    },
    [moduleDetail],
  );

  const ConnectWebsocket = useCallback(() => {
    const ws = new WebSocket('wss://sams-project.com/ws/client', [
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
        // case 'RegisterFingerSuccessfully': {
        //   const data = message.Data;
        //   const StudentID = data.StudentID;
        //   const fingerNumber = data.Finger;

        //   if (studentID == StudentID) {
        //     console.log('Success!!!!!!!!!');
        //     if (fingerNumber == 1) {
        //       setProgressStep1(3);
        //     } else if (fingerNumber == 2) {
        //       setProgressStep2(3);
        //     }
        //   }
        //   break;
        // }
        case 'ModuleConnected': {
          console.log('c', moduleDetail);
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 1);
          if (moduleID === moduleId) {
            const specificModule = moduleDetail.find(
              (module) => module.moduleID === moduleId,
            );
            // autoConnectModule().then(() => {
            setModuleByID(specificModule as ModuleDetail | undefined);
            //   console.log('run');
            // }).catch((error) => {

            //   console.log('Error in autoConnectModule:', error);
            // });
          }
          setModuleDetail([...moduleDetail]);

          break;
        }
        case 'ModuleLostConnected':
          {
            const data = message.Data;
            const moduleId = data.ModuleId;
            modifyModuleConnection(moduleId, 2);
            if (moduleID === moduleId) {
              const specificModule = moduleDetail.find(
                (module) => module.moduleID === moduleId,
              );
              // autoConnectModule().then(() => {
              setModuleByID(specificModule as ModuleDetail | undefined);
              //   console.log('run');
              // }).catch((error) => {
              //   console.log('Error in autoConnectModule:', error);
              // });
            }
            setModuleDetail([...moduleDetail]);
          }
          break;
        case 'PreparationProgress':
          {
            const data = message.Data;
            const socketSessionId = data.SessionId as number;
            const progress = data.Progress as number;
            if (socketSessionId === sessionID) setPreparationProgress(progress);
            if (progress === 100) {
              // ws.close();
              // setIsOkOpen(true);
            }
          }
          break;
        case 'StudentAttended':
          {
            try {
              const studentIDs = message.Data.studentIDs;
              console.log('studentIDS ', studentIDs);
              if (Array.isArray(studentIDs)) {
                setStudentAttendedList(studentIDs);
              }
            } catch (error) {
              toast.error('Unexpected error happened when connecting');
            }
          }
          break;
        default:
          {
            console.log('Undefined Event!');
          }
          break;
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
  }, [
    token,
    moduleDetail,
    modifyModuleConnection,
    sessionID,
    // autoConnectModule,
    moduleID,
  ]);

  useEffect(() => {
    ConnectWebsocket();
  }, [ConnectWebsocket]);

  useEffect(() => {
    const response = ModuleService.getModuleByEmployeeID(employeeID ?? '');

    response
      .then((data) => {
        setModuleDetail(data?.result || []);
      })
      .catch((error) => {
        console.log('get module by id error: ', error);
      });
  }, [employeeID]);

  const checkingStatus = (status: string) => {
    switch (status) {
      case 'Past':
        return styles.pastStatus;
      case 'On going':
        return styles.currentStatus;
      case 'Future':
        return styles.futureStatus;
      default:
        return styles.normalTxt;
    }
  };

  useEffect(() => {
    try {
      console.log('ScheduleID ', scheduleID);

      const date =
        start.getDate() +
        '/' +
        (start.getMonth() + 1) +
        '/' +
        start.getFullYear();
      const startTime =
        start.getHours().toString().padStart(2, '0') +
        ':' +
        start.getMinutes().toString().padStart(2, '0');
      const endTime =
        end.getHours().toString().padStart(2, '0') +
        ':' +
        end.getMinutes().toString().padStart(2, '0');
      const slotTime =
        slot.charAt(slot.length - 1) + ' / ' + startTime + ' - ' + endTime;
      const classStatus =
        status === 'past'
          ? 'Past'
          : status === 'current'
          ? 'On going'
          : 'Future';

      setClassInfo([
        { label: 'Class', value: classCode },
        { label: 'Subject', value: subjectCode },
        { label: 'Date', value: date },
        { label: 'Room', value: room },
        { label: 'Slot / time', value: slotTime },
        { label: 'Class status', value: classStatus },
      ]);
    } catch (error) {
      toast.error(
        'Error occure when handling the data, please try again later',
      );
    }
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleResetModule = async () => {
    try {
      const response = await ModuleService.cancelSession(
        moduleID,
        2,
        sessionID,
        token,
      );
      return response;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    return () => {
      handleResetModule();
    };
  }, []);

  // const handleReset = async (moduleID: number) => {
  //   const StopAttendance = {
  //     ScheduleID: scheduleID,
  //   };
  //   try {
  //     const response = await ModuleService.stopCheckAttendance(
  //       moduleID,
  //       4,
  //       StopAttendance,
  //       token,
  //     );
  //     // const arg = {
  //     //   ModuleID: moduleID,
  //     //   Mode: 6,
  //     //   token: token,
  //     // };

  //     // await dispatch(activeModule(arg) as any);
  //     setIsCheckAttendance(false);
  //     setIsModalVisible(false);
  //     setIsActiveModule(false);
  //     setExit(true);
  //     // setModuleID(0);
  //     // setStatus('');
  //     // setModuleByID(undefined);
  //     message.success(response.title);
  //     return response;
  //   } catch (error: any) {
  //     message.error(error.errors);
  //     console.log(error.errors);
  //   }
  // };

  // const handleSync = async (moduleID: number) => {
  //   const SyncingAttendanceData = {
  //     ScheduleID: scheduleID,
  //   };
  //   try {
  //     const response = await ModuleService.syncAttendanceData(
  //       moduleID,
  //       12,
  //       SyncingAttendanceData,
  //       token,
  //     );
  //     console.log(response);
  //     message.success(response.title);
  //     return response;
  //   } catch (error: any) {
  //     message.error(error.errors);
  //     console.log(error);
  //   }
  // };

  // const handleStart = async (moduleID: number) => {
  //   const StartAttendance = {
  //     ScheduleID: scheduleID,
  //   };
  //   try {
  //     const response = await ModuleService.startCheckAttendance(
  //       moduleID,
  //       10,
  //       StartAttendance,
  //       token,
  //     );
  //     message.success(response.title);
  //     return response;
  //   } catch (error: any) {
  //     message.error(error.errors);
  //     console.log(error);
  //   }
  // };

  // const handleStart = async (moduleID: number) => {
  //   const StartAttendance = {
  //     ScheduleID: scheduleID,
  //   };
  //   try {
  //     const response = await ModuleService.startCheckAttendance(
  //       moduleID,
  //       10,
  //       StartAttendance,
  //       token,
  //     );
  //     message.success(response.title);
  //     return response;
  //   } catch (error: any) {
  //     message.error(error.errors);
  //     console.log(error);
  //   }
  // };

  // const StartAttendance = {
  //   ScheduleID: scheduleID,
  // };

  const handleReset = async (moduleID: number) => {
    const StopAttendance = {
      ScheduleID: scheduleID,
    };
    const arg = {
      ModuleID: moduleID,
      Mode: 4,
      StopAttendance: StopAttendance,
      token: token,
    };
    await dispatch(stopCheckAttendances(arg) as any);

    setIsCheckAttendance(false);
    setIsModalVisible(false);
    setIsActiveModule(false);
    setExit(true);
  };

  const handleStart = async (moduleID: number) => {
    const StartAttendance = {
      ScheduleID: scheduleID,
    };
    const arg = {
      ModuleID: moduleID,
      Mode: 10,
      StartAttendance: StartAttendance,
      token: token,
    };
    await dispatch(startCheckAttendances(arg) as any);
  };

  const handleSync = async (moduleID: number) => {
    const SyncingAttendanceData = {
      ScheduleID: scheduleID,
    };
    const arg = {
      ModuleID: moduleID,
      Mode: 12,
      SyncingAttendanceData: SyncingAttendanceData,
      token: token,
    };
    await dispatch(syncAttendance(arg) as any);
  };

  const handleModuleClick = async (moduleId: number, module: any) => {
    setLoading(true);
    setExit(false);
    setIsActiveModule(true);
    setModuleByID(module);
    if (moduleID === moduleId && sessionID === 0) {
      setModuleID(0);
      setStatus('');
      setModuleByID(undefined);
      setIsActiveModule(false);
      setLoading(false);
      dispatch(clearModuleMessages());
      console.log('1');
    } else if (moduleID === moduleId && sessionID !== 0) {
      const arg = {
        ModuleID: moduleId,
        Mode: 2,
        SessionId: sessionID,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
      setModuleID(0);
      setStatus('');
      setSessionID(0);
      setModuleByID(undefined);
      setIsActiveModule(false);
      setLoading(false);
      dispatch(clearModuleMessages());
      console.log('2');
    } else if (moduleID !== moduleId) {
      if (sessionID > 0) {
        const args = {
          ModuleID: moduleID,
          Mode: 2,
          SessionId: sessionID,
          token: token,
        };
        await dispatch(activeModule(args) as any);
      }
      setModuleID(moduleId);
      const arg = {
        ModuleID: moduleId,
        Mode: 6,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
      setLoading(false);
      setIsActiveModule(false);
      console.log('3');
    }
  };

  const LoadingIndicator = () => (
    <span className="loading-spinner">
      <Spin size="medium" />
    </span>
  );

  const activeModuleCheckAttendance = async (
    moduleID: number,
    SessionId: number,
  ) => {
    if (exit === true) {
      const arg = {
        ModuleID: moduleID,
        Mode: 6,
        token: token,
      };

      await dispatch(activeModule(arg) as any);
    }
    setExit(false);
    setIsCheckAttendance(true);
    const PrepareAttendance = {
      ScheduleID: scheduleID,
    };

    await ModuleService.activeModuleAttendance(
      moduleID,
      SessionId,
      3,
      PrepareAttendance,
      token,
    )
      .then((data) => {
        console.log('Response data:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const cancel: PopconfirmProps['onCancel'] = (e) => {
    // console.log(e);
    // message.error('Click on No');
  };

  return (
    <Content className={styles.content}>
      <Space className={styles.classDetailsHeader}>
        <ContentHeader
          contentTitle="Class"
          previousBreadcrumb="Home / Class / "
          currentBreadcrumb={`${subjectCode}_Room.${room}`}
          key={'class-details-header'}
        />
        <Space>
          <Button
            onClick={() => HelperService.navigateFAP()}
            className={styles.btnFap}
          >
            <Space direction="horizontal">
              <Typography.Text className={styles.btnText}>
                Check on FAP
              </Typography.Text>
              <hr className={styles.hrLine}></hr>
              <img
                className={styles.fptLogo}
                style={{ width: 60, height: 40 }}
                src={fptimg}
                alt="fpt logo"
              />
            </Space>
          </Button>
        </Space>
      </Space>

      {/* <ClassDetail /> */}
      <Row className={styles.classDetailHeader} gutter={[16, 16]}>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={8}
          className={styles.cardParent1}
        >
          <Card className={styles.card1}>
            <div style={{ marginBottom: 30 }}>
              <div className={styles.detailsHeader}>Details</div>
            </div>
            {classInfo.map((detail, i) => (
              <div key={`info_${i}`}>
                <hr
                  style={{
                    borderColor: '#e6e7e9',
                    borderWidth: 0.5,
                  }}
                />

                <Row className={styles.rowDetails}>
                  <Col span={10}>
                    <div>{detail.label}</div>
                  </Col>
                  <Col>
                    {detail.label === 'Class status' ? (
                      <div
                        className={checkingStatus(detail.value)}
                        style={{ fontWeight: 500 }}
                      >
                        {detail.value}
                      </div>
                    ) : (
                      <div style={{ fontWeight: 500, color: '#667085' }}>
                        {detail.value}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </Card>
        </Col>
        <Col
          xs={24}
          sm={24}
          md={24}
          lg={24}
          xl={16}
          className={styles.cardParent2}
        >
          <Card className={styles.card2}>
            <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Col span={11}>
                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                  <text className={styles.moduleText}>Module</text>
                </Col>
                {/* <Col
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: 15,
                  }}
                >
                  <Button className={styles.btnConnect}>
                    <text>Connect</text>
                  </Button>
                  <Button className={styles.btnDisconnect}>
                    <text>Disconnect</text>
                  </Button>
                </Col> */}
                <Col style={{ display: 'flex', justifyContent: 'center' }}>
                  <div className={styles.moduleCard}>
                    <div className={styles.moduleImgCtn}>
                      <img
                        src={module}
                        alt="Module image"
                        className={styles.moduleImg}
                      />
                    </div>
                    <div className={styles.moduleInfo}>
                      <span>
                        <b>ID: </b>
                        {moduleID > 0 && moduleID}
                      </span>
                      <span>
                        <b>Status: </b>
                        <p
                          style={{
                            display: 'inline',
                            color: moduleByID?.status
                              ? moduleByID?.status === 1
                                ? 'green'
                                : 'red'
                              : 'inherit',
                          }}
                        >
                          {moduleByID?.status === 1
                            ? 'available'
                            : moduleByID?.status === 0
                            ? 'unavailable'
                            : ''}
                        </p>
                      </span>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                        }}
                      >
                        <b>Connect: </b>
                        {moduleByID?.connectionStatus === 1 ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                            }}
                          >
                            <div style={{ marginRight: -5 }}>
                              <Lottie
                                options={onlineDot}
                                height={30}
                                width={30}
                              />
                            </div>
                            <div style={{ marginBottom: 2 }}>online</div>
                          </div>
                        ) : moduleByID?.connectionStatus === 2 ? (
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              marginLeft: 5,
                            }}
                          >
                            <Badge status="error" /> offline
                          </div>
                        ) : null}
                      </span>
                      <span>
                        <b>Mode: </b>
                        <p style={{ display: 'inline' }}>
                          {moduleByID?.mode === 1
                            ? 'Register'
                            : moduleByID?.mode === 2
                            ? 'Attendance'
                            : ''}
                        </p>
                      </span>
                    </div>
                  </div>
                </Col>
                <Col style={{ marginTop: 10 }}>
                  <Button
                    style={{ width: '100%' }}
                    type="primary"
                    block
                    onClick={() => {
                      showModal();
                      // activeModuleRegisterThree(moduleID, 3);
                    }}
                  >
                    <p>Select Module</p>
                  </Button>
                </Col>
                <Col style={{ marginTop: 10 }}>
                  <BtnDecoration
                    btnFuncName="Prepare Data"
                    btnTitle="Fingerprints"
                    imgDecor={reportIcon}
                    key={'fingerprintImport'}
                    isActiveModule={isActiveModule}
                    moduleID={moduleID}
                    sessionID={sessionID}
                    status={statuss}
                    setIsActiveModule={setIsActiveModule}
                    isCheckAttendance={isCheckAttendance}
                    activeModuleCheckAttendance={activeModuleCheckAttendance}
                    preparationProgress={preparationProgress}
                  />
                </Col>
              </Col>

              <hr className={styles.hrVertical} />

              <Col
                span={12}
                style={{
                  marginRight: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-start',
                }}
              >
                {/* <Row className={styles.btnGroup}> */}
                {/* <div style={{ marginBottom: '10px', width: '100%' }}>
                    <BtnDecoration
                      btnFuncName="Import templates"
                      btnTitle="Fingerprint"
                      imgDecor={fingerprintIcon}
                      key={'fingerprintImport'}
                      isActiveModule={isActiveModule}
                      moduleID={moduleID}
                      setIsActiveModule={setIsActiveModule}
                    />
                  </div> */}
                {/* <Popconfirm
                    title="Disconnect Online Attendance Tracking"
                    description="Are you sure to disconnect?"
                    onConfirm={handleReset}
                    onCancel={cancel}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button
                      danger
                      type='primary'
                      style={{ alignSelf: 'end', marginBottom: '12px' }}
                    >
                      Disconnect tracking
                    </Button>
                  </Popconfirm> */}
                <Row style={{ width: '100%', height: '100%' }}>
                  <Space>
                    <Button type="link" onClick={() => fetchModuleActivity()}>
                      <IoReload size={25} />
                    </Button>
                  </Space>
                  <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    dataSource={list}
                    style={{
                      width: '100%',
                      borderRadius: 10,
                      height: 250,
                      overflowY: 'auto',
                    }}
                    renderItem={(item) => {
                      let totalFingers = 0;
                      let uploadedFingers = 0;

                      if (
                        item.preparationTask?.preparedScheduleId == scheduleID
                      ) {
                        totalFingers = item.preparationTask?.totalFingers ?? 0;
                        uploadedFingers = item.preparationTask?.uploadedFingers ?? 0;
                      } else {
                        const schedule =
                          item.preparationTask?.preparedSchedules.find(
                            (s) => s.scheduleId == scheduleID,
                          );
                        if (schedule !== undefined) {
                          totalFingers = schedule.totalFingers;
                          uploadedFingers = schedule.uploadedFingers;
                        }
                      }

                      return (
                        <List.Item
                          style={{
                            backgroundColor: '#f5f5f5',
                            borderRadius: 10,
                            marginBottom: 10,
                          }}
                          // actions={[
                          //   <a style={{ color: 'green' }} key="list-loadmore-edit">
                          //     start
                          //   </a>,
                          //   <a style={{ color: 'red' }} key="list-loadmore-more">
                          //     stop
                          //   </a>,
                          //   <a style={{ color: 'blue' }} key="list-loadmore-more">
                          //     sync
                          //   </a>,
                          // ]}
                        >
                          <List.Item.Meta
                            avatar={
                              <div style={{ marginLeft: 10 }}>
                                <b>Module {item.module.moduleID}</b>
                                <br />
                                <Avatar
                                  src={modules}
                                  style={{
                                    width: '120px',
                                    height: '80px',
                                    borderRadius: 5,
                                  }}
                                />
                              </div>
                            }
                            // title={
                            //   <a href="https://ant.design">{item.name?.last}</a>
                            // }
                            // title={`Module ${item.module.moduleID}`}
                            // description="a"
                          />
                          {/* <div style={{width:'10%', marginRight: 40}}>
                              <b>{'Module' + item.module.moduleID}</b>
                              <br/>
                              <img alt='module' src={modules} style={{height:25, width:25}}/>
                            </div>
                            <div style={{width:'25%'}}>
                              {item.startTime}
                            </div> */}
                          <div>
                            <b>Timestamp:</b>{' '}
                            {new Date(item.startTime).toLocaleString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                              hour12: false,
                            })}
                            <div>
                              <b>Uploaded:</b>{' '}
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '5px',
                                  padding: '0px 5px',
                                  fontSize: '10px',
                                  color: '#333',
                                  border: '1px solid #ddd',
                                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    marginRight: '5px',
                                  }}
                                >
                                  {uploadedFingers}
                                </span>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    color: '#108ee9',
                                    marginRight: '5px',
                                  }}
                                >
                                  /
                                </span>
                                <span
                                  style={{
                                    fontWeight: 'bold',
                                    marginRight: '5px',
                                  }}
                                >
                                  {totalFingers}
                                </span>
                                <span
                                  style={{
                                    fontSize: '12px',
                                    color: '#555',
                                  }}
                                >
                                  Fingers
                                </span>
                              </div>
                            </div>
                          </div>

                          <Space>
                            <Popover
                              placement="bottomRight"
                              content={
                                <Space direction="vertical" size="small">
                                  <Button
                                    type="text"
                                    onClick={() =>
                                      handleStart(item.module.moduleID)
                                    }
                                  >
                                    Start
                                  </Button>
                                  <Button
                                    type="text"
                                    onClick={() =>
                                      handleReset(item.module.moduleID)
                                    }
                                  >
                                    Stop
                                  </Button>
                                  <Button
                                    type="text"
                                    onClick={() =>
                                      handleSync(item.module.moduleID)
                                    }
                                  >
                                    Sync
                                  </Button>
                                </Space>
                              }
                              trigger="click"
                            >
                              <Button style={{ marginBottom: 50 }} type="link">
                                <BsThreeDotsVertical size={25} />
                              </Button>
                            </Popover>
                          </Space>
                        </List.Item>
                      );
                    }}
                  />
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>

        <ClassDetailTable
          scheduleID={scheduleID}
          isOkOpen={isOkOpen}
          studentAttendedList={studentAttendedList}
        />
      </Row>

      <Modal
        title="Select Module"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={500}
        // bodyStyle={{ minHeight: '300px' }}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Exit
          </Button>,
          // <Button key="reset" onClick={handleReset}>
          //   Reset
          // </Button>,
          // <Button key="submit" type="primary" onClick={handleConfirmUpload}>
          //   Submit
          // </Button>,
        ]}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Row gutter={[16, 16]}>
                <Col span={14}>
                  <p style={{ fontWeight: 500 }}>
                    Module Connecting: {moduleID > 0 && <span>{moduleID}</span>}
                  </p>
                </Col>

                <Col span={10}>
                  <p style={{ fontWeight: 500 }}>
                    Status: {loading && <LoadingIndicator />}
                    {statuss === 'success' && (
                      <span style={{ color: 'green' }}>Connected</span>
                    )}
                    {statuss === 'fail' && (
                      <span style={{ color: 'red' }}>Fail</span>
                    )}
                  </p>
                </Col>
              </Row>
            </Card>
            <Content className="module_cards" style={{ marginTop: 5 }}>
              <Row gutter={[16, 16]} style={{ marginBottom: 5 }}>
                <Col span={18}>
                  <Input
                    placeholder="Search by Module ID"
                    type="number"
                    onChange={(e) =>
                      setSearchModuleID(Number(e.target.value) || undefined)
                    }
                  />
                </Col>
                <Col span={6}>
                  <Select
                    defaultValue=""
                    style={{ width: '100%' }}
                    onChange={(e) =>
                      setConnectionStatusFilter(Number(e) || undefined)
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
                          item.connectionStatus === connectionStatusFilter) &&
                        (searchModuleID === undefined ||
                          item.moduleID === searchModuleID),
                    )
                    .sort((a, b) => a.connectionStatus - b.connectionStatus)
                    .map((item, index) => (
                      <Button
                        onClick={() => handleModuleClick(item.moduleID, item)}
                        key={index}
                        className={`${styles.unselectedModule} ${
                          moduleID === item.moduleID
                            ? styles.selectedModule
                            : ''
                        }`}
                        disabled={isActiveModule}
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
                                <p style={{ color: 'blue' }}>available</p>
                              ) : item.status === 2 ? (
                                <p style={{ color: 'red' }}>unavailable</p>
                              ) : null}
                            </p>
                            <p className={styles.upDetail}>
                              {item.connectionStatus === 1 ? (
                                <div
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginLeft: -10,
                                  }}
                                >
                                  <div style={{ marginRight: 5 }}>
                                    <Lottie
                                      options={onlineDot}
                                      height={30}
                                      width={30}
                                    />
                                  </div>
                                  <div
                                    style={{ marginLeft: -10, marginBottom: 3 }}
                                  >
                                    online
                                  </div>
                                </div>
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
            {/* <Button
              type="primary"
              block
              onClick={() => {
                setIsActiveModule(true);
                // activeModuleRegisterThree(moduleID, sessionID, 3);
                // setIsRegisterPressed(true);
                // setProgressStep1(1);
                // setProgressStep2(1);
              }}
              style={{ width: '100%', marginTop: 20 }}
              disabled={isActiveModule || !moduleID}
            >
              Check Attendance
            </Button> */}
          </Col>
        </Row>
      </Modal>
    </Content>
  );
};

export default ClassDetails;
