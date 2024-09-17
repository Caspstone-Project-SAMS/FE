import React, { useEffect, useState } from 'react';
import { Content, Header } from 'antd/es/layout/layout';
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
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import { CiImageOn } from 'react-icons/ci';
import { ModuleDetail } from '../../models/module/Module';
import { useDispatch, useSelector } from 'react-redux';
import { activeModule, clearModuleMessages, prepareScheduleDay } from '../../redux/slice/Module';
import { RootState } from '../../redux/Store';
import styles from '../../pages/class/Class.module.less';
import moduleImg from '../../assets/imgs/module00.png';
import Lottie from 'react-lottie';
import onlineDots from '../../assets/animations/Online_Dot.json';
import { ModuleService } from '../../hooks/Module';
import DatePicker from 'react-datepicker';
import { CiDatabase } from "react-icons/ci";

const { Option } = Select;

const PrepareSchedule: React.FC = () => {
  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const employeeID = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.employeeID,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [moduleID, setModuleID] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [statuss, setStatus] = useState('');
  const [searchModuleID, setSearchModuleID] = useState<number | undefined>(
    undefined,
  );
  const [connectionStatusFilter, setConnectionStatusFilter] = React.useState<
    number | undefined
  >(undefined);
  const [moduleDetail, setModuleDetail] = useState<ModuleDetail[]>([]);
  const [exit, setExit] = useState(false);
  const [isActiveModule, setIsActiveModule] = useState(false);
  const [moduleByID, setModuleByID] = useState<ModuleDetail>();
  const [sessionID, setSessionID] = useState<number>(0);
  const [isCheckAttendance, setIsCheckAttendance] = useState(false);
  const [preparedDate, setPreparedDate] = useState<string>('');

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const dispatch = useDispatch();

  const failMessage = useSelector((state: RootState) => state.module.message);
  const successMessage = useSelector(
    (state: RootState) => state.module.moduleDetail,
  );

  const handleDateChange = (date: Date | null) => {

    if (date) {
      const formattedDate = date.toISOString().slice(0, 10); // Formats as yyyy-mm-dd
      setSelectedDate(date);
      setPreparedDate(formattedDate);
    } else {
      setSelectedDate(null);
    }
  };


  useEffect(() => {
    if (successMessage) {
      if (exit === false) {
        message.success(successMessage.title);
        setIsActiveModule(false);
      }
      if (successMessage.title == 'Connect module successfully') {
        setSessionID(successMessage.result.sessionId);
        setStatus('success');
      }
      if (successMessage.title == 'No schedules data to prepare') {
        setIsActiveModule(false);
      }
      dispatch(clearModuleMessages());
    }
    if (failMessage && failMessage.data.error.title) {
      // message.error(`${failMessage.data.error.errors}`);
      if (failMessage.data.error) {
        message.error(`${failMessage.data.error.errors}`);
        setIsActiveModule(false);
      }
      if (failMessage.data.error.title == 'Connect module failed') {
        // message.error(`${failMessage.data.error.title}`);
        setStatus('fail');
      }

      dispatch(clearModuleMessages());
    }
  }, [successMessage, failMessage, dispatch]);

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

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const activeModulePrepareAttendanceDay = async (
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
    const PrepareSchedules = {
      preparedDate: preparedDate,
    };

    const arg = {
      ModuleID: moduleID,
      Mode: 5,
      SessionId: SessionId,
      PrepareSchedules: PrepareSchedules,
      token: token,
    };

    await dispatch(prepareScheduleDay(arg) as any);
  };

  const LoadingIndicator = () => (
    <span className="loading-spinner">
      <Spin size="medium" />
    </span>
  );

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

  const onlineDot = {
    loop: true,
    autoplay: true,
    animationData: onlineDots,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };

  return (
    <>
      <Button
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        size="large"
        icon={<CiDatabase size={18} />}
        onClick={() => {
          showModal();
        }}
      >
        Prepare Schedule For Day
      </Button>
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
                        className={`${styles.unselectedModule} ${moduleID === item.moduleID
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
                                    Online
                                  </div>
                                </div>
                              ) : item.connectionStatus === 2 ? (
                                <div style={{ gap: 4 }}>
                                  <Badge status="error" /> Offline
                                </div>
                              ) : null}
                            </p>
                          </Col>
                        </Row>
                      </Button>
                    ))}
                </Card>
              )}
            </Content>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                width: '100%',
                marginTop: 5,
              }}
            >
              <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                placeholderText="Select date"
                className={styles.datePicker}
              />
              <Button
                type="primary"
                onClick={() => {
                  setIsActiveModule(true);
                  activeModulePrepareAttendanceDay(moduleID, sessionID);
                }}
                style={{ width: 'auto', marginTop: 0 }}
                disabled={isActiveModule || !moduleID}
              >
                Check Attendance
              </Button>
            </div>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default PrepareSchedule;
