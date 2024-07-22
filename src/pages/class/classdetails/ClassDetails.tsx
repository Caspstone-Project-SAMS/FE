import styles from '../Class.module.less';
import React, { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { Content } from 'antd/es/layout/layout';
import {
  Badge,
  Button,
  Card,
  Col,
  Empty,
  message,
  Modal,
  Row,
  Space,
  Typography,
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
import { ModuleByID, ModuleDetail } from '../../../models/module/Module';
import moduleImg from '../../../assets/imgs/module00.png';
import { activeModule, clearModuleMessages } from '../../../redux/slice/Module';

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
  const [moduleByID, setModuleByID] = useState<ModuleByID>();
  // const [ScheduleID, setScheduleID] = useState(0);

  const [isActiveModule, setIsActiveModule] = useState(false);
  const [statuss, setStatus] = useState('');

  const dispatch = useDispatch();

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
          setModuleDetail([...moduleDetail]);
          console.log('connected');

          break;
        }
        case 'ModuleLostConnected': {
          const data = message.Data;
          const moduleId = data.ModuleId;
          modifyModuleConnection(moduleId, 2);
          setModuleDetail([...moduleDetail]);
          console.log('disconnected');

          // setTimeout(() => {
          //   50
          // }, 50);

          // setModuleDetail(moduleDetail || []);

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
  }, [token, moduleDetail, modifyModuleConnection]);

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

  const handleReset = () => {
    setIsActiveModule(false);
  };

  const handleModuleClick = async (moduleId: number) => {
    setIsActiveModule(true);
    if (moduleID === moduleId) {
      setModuleID(0); // Unclick will set moduleID to 0
      setStatus('');
      setModuleByID(undefined);
      setIsActiveModule(false);
      dispatch(clearModuleMessages());
    } else {
      setModuleID(moduleId);
      const arg = {
        ModuleID: moduleId,
        Mode: 6,
        token: token,
      };
      await dispatch(activeModule(arg) as any);
      setIsActiveModule(false);
    }
  };

  const activeModuleCheckAttendance = (
    moduleID: number,
    SessionId: number,
  ) => {
    const PrepareAttendance = {
      ScheduleID: scheduleID
    };

    ModuleService.activeModuleAttendance(moduleID, SessionId, 3, PrepareAttendance, token)
      .then((data) => {
        console.log('Response data:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
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
                <Col
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
                </Col>
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
                        <p style={{ display: 'inline', alignItems: 'center' }}>
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
                <Col style={{ marginTop: 20 }}>
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
              </Col>

              <hr className={styles.hrVertical} />

              <Col
                span={10}
                style={{
                  marginRight: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Row className={styles.btnGroup}>
                  <div style={{ marginBottom: '10px', width: '100%' }}>
                    {/* <BtnDecoration
                      btnFuncName="Import templates"
                      btnTitle="Fingerprint"
                      imgDecor={fingerprintIcon}
                      key={'fingerprintImport'}
                      isActiveModule={isActiveModule}
                      moduleID={moduleID}
                      setIsActiveModule={setIsActiveModule}
                    /> */}
                  </div>
                  <BtnDecoration
                    btnFuncName="Start session"
                    btnTitle="Attendance"
                    imgDecor={reportIcon}
                    key={'fingerprintImport'}
                    isActiveModule={isActiveModule}
                    moduleID={moduleID}
                    sessionID={sessionID}
                    setIsActiveModule={setIsActiveModule}
                    activeModuleCheckAttendance={activeModuleCheckAttendance}
                  />
                  <Button onClick={handleReset} style={{marginTop: 10, backgroundColor:'red', color:'white'}}>
                    Stop
                  </Button>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>

        <ClassDetailTable scheduleID={scheduleID} />
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
            Cancel
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
                    Status:{' '}
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
              {moduleDetail.length === 0 ? (
                <Empty description="No modules available" />
              ) : (
                <Card style={{ height: 300, overflowY: 'auto' }}>
                  {moduleDetail.map((item, index) => (
                    <Button
                      onClick={() => handleModuleClick(item.moduleID)}
                      key={index}
                      className={`${styles.unselectedModule} ${
                        moduleID === item.moduleID ? styles.selectedModule : ''
                      }`}
                      disabled={isActiveModule}
                    >
                      <Row>
                        <Col span={4} style={{ marginRight: 80 }}>
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
                        <Col span={3} style={{ margin: 'auto' }}>
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
