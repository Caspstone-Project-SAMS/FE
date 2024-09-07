import React, { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Layout,
  Row,
  Space,
  Typography,
  Tabs,
  List,
  Collapse,
  Progress,
  message,
  Radio,
  Button,
  TimePicker,
  Switch,
  Table,
  Pagination,
  Select,
  Tag,
  InputNumber,
} from 'antd';
import dayjs from 'dayjs';
import { Content } from 'antd/es/layout/layout';
import { useLocation } from 'react-router-dom';
import { SettingOutlined, HistoryOutlined } from '@ant-design/icons';
import styles from './index.module.less';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';

import type {
  ModuleActivity,
  ModuleByID,
  ModuleDetail,
  preparedSchedule,
} from '../../models/module/Module';
import { ModuleService } from '../../hooks/Module';
import { CalendarService } from '../../hooks/Calendar';
import { ScheduleResult, Schedules } from '../../models/calendar/Schedule';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import {
  applySetting,
  clearModuleMessages,
  settingModules,
} from '../../redux/slice/Module';

const { Header: AntHeader } = Layout;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const LecturerModuleDetail: React.FC = () => {
  const location = useLocation();
  const [module, setModule] = useState<ModuleByID>();
  const [lecturerId, setLecturerId] = useState('');
  const [moduleActivity, setModuleActivity] = useState<ModuleActivity[]>([]);
  const [moduleID, setModuleID] = useState<number>(0);
  const [listScheduleId, setListScheduleId] = useState<number[]>([]);
  const [scheduleList, setScheduleList] = useState<ScheduleResult[]>([]);
  const [filteredScheduleList, setFilteredScheduleList] = useState<
    ScheduleResult[]
  >([]);
  const [schedule, setSchedule] = useState<Schedules>();
  const [activeKey, setActiveKey] = useState<string | string[]>();
  const [AutoPrepare, setAutoPrepare] = useState(false);
  const [PreparedTime, setPreparedTime] = useState('');
  const [AttendanceDurationMinutes, setAttendanceDurationMinutes] = useState(0);
  const [ConnectionLifeTimeSeconds, setConnectionLifeTimeSeconds] = useState(0);
  const [ConnectionSound, setConnectionSound] = useState(true);
  const [ConnectionSoundDurationMs, setConnectionSoundDurationMs] = useState(0);
  const [AttendanceSound, setAttendanceSound] = useState(true);
  const [AttendanceSoundDurationMs, setAttendanceSoundDurationMs] = useState(0);

  const [reload, setReload] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [10, 20, 30, 50];

  console.log('test', moduleActivity);

  const dispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const failMessage = useSelector((state: RootState) => state.module.message);
  const successMessage = useSelector(
    (state: RootState) => state.module.moduleDetail,
  );

  // useEffect(() => {
  //   if (successMessage) {
  //     if (successMessage.title == 'Apply configuration successfully') {
  //       message.success(successMessage.title);
  //     } else {
  //       message.success(successMessage);
  //     }
  //     dispatch(clearModuleMessages());
  //   }
  //   if (failMessage && failMessage.data.error) {
  //     if (failMessage.data.error.title == 'Apply configurations failed') {
  //       message.error(`${failMessage.data.error.title}`);
  //     } else {
  //       message.error(`${failMessage.data.error.errors}`);
  //     }
  //     dispatch(clearModuleMessages());
  //   }
  // }, [successMessage, failMessage, dispatch]);
  useEffect(() => {
    if (successMessage) {
      if (successMessage.title) {
        message.success(successMessage.title);
      } else {
        message.success(successMessage);
      }
      dispatch(clearModuleMessages());
    }
    if (failMessage && failMessage.data.error) {
      if (failMessage.data.error.title) {
        message.error(`${failMessage.data.error.title}`);
      } else {
        message.error(`${failMessage.data.error.errors}`);
      }
      dispatch(clearModuleMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  // const [isUpdate, setIsUpdate] = useState(false);
  // const [searchInput, setSearchInput] = useState('');

  const autoPrepareStatus = module?.result.autoPrepare;
  const status = module?.result.status;
  const mode = module?.result.mode;
  const autoReset = module?.result.autoReset;

  // useEffect(() => {
  const getAllSchedule = async (schedules: preparedSchedule[]) => {
    if (lecturerId !== '') {
      const scheduleIds =
        schedules.length === 0 ? [0] : schedules.map((s) => s.scheduleId);
      const response = await CalendarService.getAllSchedule(
        lecturerId,
        scheduleIds,
      );
      const result = response?.result || [];

      result.forEach((s) => {
        const schedule = schedules.filter(
          (s1) => s1.scheduleId === s.scheduleID,
        )[0];
        s.total = schedule.totalFingers ?? 0;
        s.uploaded = schedule.uploadedFingers ?? 0;
      });

      setScheduleList(result);
    }
  };
  //   getAllSchedule();
  // }, [lecturerId, listScheduleId]);

  // useEffect(() => {
  //   setFilteredScheduleList(
  //     Array.isArray(scheduleList)
  //       ? scheduleList.filter((schedule) =>
  //           listScheduleId.includes(schedule.scheduleID),
  //         )
  //       : [],
  //   );
  // }, [listScheduleId, scheduleList]);

  const moduleDetails = [
    { title: 'Module', value: module?.result.moduleID || 'N/A' },
    { title: 'Employee', value: module?.result.employee.displayName || 'N/A' },
    {
      title: 'Mode',
      value: (
        <div>
          <Tag
            color={mode === 1 ? 'green' : 'blue'}
            style={{
              fontWeight: 'bold',
              fontSize: '10px',
              textAlign: 'center',
            }}
          >
            {mode === 1 ? 'Register' : 'Attendance'}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Status',
      value: (
        <Tag
          color={status ? 'green' : 'red'}
          style={{ fontWeight: 'bold', fontSize: '10px' }}
        >
          {status ? 'active' : 'inactive'}
        </Tag>
      ),
      status: true,
    },
    {
      title: 'Auto Prepare',
      value: (
        <Tag
          color={autoPrepareStatus ? 'green' : 'red'}
          style={{ fontWeight: 'bold', fontSize: '10px' }}
        >
          {autoPrepareStatus ? 'Auto' : 'Not Auto'}
        </Tag>
      ),
    },
    {
      title: 'Prepare Time',
      value: (typeof module?.result?.preparedTime === 'string'
        ? module.result.preparedTime
        : String(module?.result?.preparedTime ?? '')
      ).slice(0, 5),
    },
    {
      title: 'Auto Reset',
      value: (
        <Tag
          color={autoReset ? 'green' : 'red'}
          style={{ fontWeight: 'bold', fontSize: '10px' }}
        >
          {autoReset ? 'Auto' : 'Not Auto'}
        </Tag>
      ),
    },
    { title: 'Reset Time', value: module?.result.resetTime || 'N/A' },
  ];

  const columns = [
    {
      key: '1',
      title: 'Date',
      dataIndex: 'date',
    },
    {
      key: '2',
      title: 'Slot',
      dataIndex: 'slot',
    },
    {
      key: '3',
      title: 'Time',
      dataIndex: 'time',
    },
    {
      key: '4',
      title: 'Class',
      dataIndex: 'class',
    },
    {
      key: '5',
      title: 'Uploaded Fingerprints',
      dataIndex: 'uploadFingerprints',
    },
  ];

  useEffect(() => {
    if (location.state && location.state.moduleID) {
      setModuleID(location.state.moduleID);
    }
  }, [location.state]);

  useEffect(() => {
    if (moduleID !== 0) {
      const response = ModuleService.getModuleByID(moduleID);

      response
        .then((data) => {
          setModule(data || undefined);
          setAutoPrepare(data?.result.autoPrepare || false);
          setPreparedTime(data?.result.preparedTime || '');
          setConnectionLifeTimeSeconds(
            data?.result.connectionLifeTimeSeconds || 0,
          );
          setConnectionSound(data?.result.connectionSound || false);
          setConnectionSoundDurationMs(
            data?.result.connectionSoundDurationMs || 0,
          );
          setAttendanceSound(data?.result.attendanceSound || false);
          setAttendanceSoundDurationMs(
            data?.result.attendanceSoundDurationMs || 0,
          );
          setAttendanceDurationMinutes(
            data?.result.attendanceDurationMinutes || 0,
          );
          setLecturerId(data?.result.employee.userId || '');
          //Newest on top
          if (data && data.result.moduleActivities) {
            const reverseList = data.result.moduleActivities.reverse();
            setModuleActivity(reverseList);
          } else {
            setModuleActivity([]);
          }
        })
        .catch((error) => {
          console.log('get module by id error: ', error);
        });
    }
  }, [moduleID, reload]);

  const getScheduleByID = async (scheduleID: number) => {
    try {
      const response = await CalendarService.getScheduleByID(scheduleID);
      setSchedule(response || undefined);
      return response;
    } catch (error) {
      console.log('error on get schedule by id: ', error);
    }
  };

  const settingModule = async (
    moduleID: number,
    AutoPrepare: boolean,
    PreparedTime: string,
    AttendanceDurationMinutes: number,
    ConnectionLifeTimeSeconds: number,
    ConnectionSound: boolean,
    ConnectionSoundDurationMs: number,
    AttendanceSound: boolean,
    AttendanceSoundDurationMs: number,
    token: string,
  ) => {
    const arg = {
      moduleID: moduleID,
      AutoPrepare: AutoPrepare,
      PreparedTime: PreparedTime,
      AttendanceDurationMinutes: AttendanceDurationMinutes,
      ConnectionLifeTimeSeconds: ConnectionLifeTimeSeconds,
      ConnectionSound: ConnectionSound,
      ConnectionSoundDurationMs: ConnectionSoundDurationMs,
      AttendanceSound: AttendanceSound,
      AttendanceSoundDurationMs: AttendanceSoundDurationMs,
      token: token,
    };
    await dispatch(settingModules(arg) as any);
  };

  const handleSubmit = async () => {
    await settingModule(
      moduleID,
      AutoPrepare,
      PreparedTime,
      AttendanceDurationMinutes,
      ConnectionLifeTimeSeconds,
      ConnectionSound,
      ConnectionSoundDurationMs,
      AttendanceSound,
      AttendanceSoundDurationMs,
      token,
    );
    setReload((prev) => prev + 1);
  };

  const handleApply = async () => {
    const arg = {
      ModuleID: moduleID,
      Mode: 13,
      token: token,
    };
    await dispatch(applySetting(arg) as any);
  };

  const handlePanelChange = (key: string | string[]) => {
    setActiveKey(key); // Update the active key
  };

  const teacherDetails = [
    { label: 'Name', value: module?.result.employee.displayName },
    { label: 'Department', value: module?.result.employee.department },
  ];

  const data = moduleActivity;
  const paginatedData = moduleActivity.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (value: number) => {
    setPageSize(value);
    setCurrentPage(1);
  };

  return (
    <Content className={styles.moduleContent}>
      <ContentHeader
        contentTitle="Module"
        previousBreadcrumb="Home / Module / "
        currentBreadcrumb="Module Detail"
        key=""
      />
      <Card className={styles.cardHeaderDetail}>
        <Row gutter={[16, 16]}>
          <Col span={14}>
            <Card style={{ height: '100%' }}>
              <Row>
                <Col span={4}>
                  <img
                    alt="Employee"
                    src={module?.result.employee.avatar}
                    style={{ width: 100, height: 100 }}
                  />
                </Col>
                <Col span={19} style={{ marginLeft: 20 }}>
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
                <p className={styles.tableTitle}>Module Details</p>
              </AntHeader>
              {/* <Col span={24}>
                <Content>
                  <Content>
                    <table className={styles.moduleDetailsTable}>
                      <tbody>
                        {moduleDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className={styles.updateModuleTitle}>
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
              </Col> */}
              <Col span={24}>
                <Card className={styles.card1}>
                  {moduleDetails.map((detail, i) => (
                    <div key={`info_${i}`}>
                      <hr
                        style={{
                          borderColor: '#e6e7e9',
                          borderWidth: 0.5,
                        }}
                      />

                      <Row className={styles.rowDetails}>
                        <Col span={14}>
                          <div style={{ fontWeight: 500 }}>{detail.title}</div>
                        </Col>
                        <Col span={10}>
                          <div style={{ fontWeight: 500, color: '#667085' }}>
                            {detail.value}
                          </div>
                        </Col>
                      </Row>
                    </div>
                  ))}
                </Card>
              </Col>
            </Content>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <SettingOutlined style={{ marginRight: 5 }} />
                    Settings
                  </span>
                }
                key="2"
              >
                <div className={styles.moduleSettingsContainer}>
                  <b className={styles.moduleSettingsTitle}>Module Setting</b>

                  <Col>
                    <b className={styles.moduleSettingTitle}>Preparation</b>
                    <hr className={styles.lines} />
                    <div className={styles.settingItem}>
                      <div>
                        <span className={styles.settingLabel}>
                          Auto Prepare:
                        </span>
                        <Switch
                          checked={AutoPrepare}
                          onChange={(checked) => setAutoPrepare(checked)}
                        />
                        <p className={styles.suggestText}>
                          Turn on or off auto prepare attendance data of class
                          schedule
                        </p>
                      </div>
                    </div>
                    <div className={styles.settingItem}>
                      <div>
                        <span className={styles.settingLabel}>
                          Prepare Time
                        </span>
                        <TimePicker
                          placeholder="Prepare Time"
                          value={
                            PreparedTime ? dayjs(PreparedTime, 'HH:mm') : null
                          }
                          onChange={(time, timeString) => {
                            if (typeof timeString === 'string') {
                              setPreparedTime(timeString);
                            }
                          }}
                          format="HH:mm"
                          className={styles.timePicker}
                        />
                        <p className={styles.suggestText}>
                          Set auto prepare time attendance data of class
                          schedule
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <b className={styles.moduleSettingTitle}>Check Attendance Duration</b>
                    <hr className={styles.lines} />
                    <div className={styles.settingItem}>
                      <div>
                        <p className={styles.settingLabel}>
                          Duration Time (minutes)
                        </p>
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          {/* <TimePicker
                            placeholder="Duration Time"
                            value={
                              AttendanceDurationMinutes !== null
                                ? dayjs().minute(AttendanceDurationMinutes)
                                : null
                            }
                            onChange={(time) => {
                              if (time) {
                                const minutes = time.minute(); // Extract minutes from the selected time
                                setAttendanceDurationMinutes(minutes);
                              }
                            }}
                            format="mm" // Display only minutes
                            className={styles.timePicker}
                          /> */}
                          <InputNumber
                            placeholder="Duration Time"
                            min={15}
                            max={135}
                            value={
                              AttendanceDurationMinutes !== null
                                ? AttendanceDurationMinutes
                                : null
                            }
                            onChange={(value: any) => {
                              if (value < 15) {
                                setAttendanceDurationMinutes(15);
                              } else if (value > 135) {
                                setAttendanceDurationMinutes(135);
                              } else {
                                setAttendanceDurationMinutes(value);
                              }
                            }}
                            className={styles.inputNumber}
                          />
                          {/* <span> minutes</span> */}
                        </div>
                        <p className={styles.suggestText}>
                          Set duration time for check attendance
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <b className={styles.moduleSettingTitle}>Activities</b>
                    <hr className={styles.lines} />
                    <div className={styles.settingItem}>
                      <div>
                        <span className={styles.settingLabel}>
                          Connection Life Time (seconds)
                        </span>
                        <br />
                        <InputNumber
                          placeholder="Connection Life Time (second)"
                          value={ConnectionLifeTimeSeconds}
                          onChange={(value) => {
                            if (value !== null) {
                              setConnectionLifeTimeSeconds(value);
                            }
                          }}
                          min={0}
                          step={1} // Set the step to 1 millisecond
                          className={styles.inputNumber}
                        />{' '}
                        {/* {' second'} */}
                        <p className={styles.suggestText}>
                          Set connection life time for module with millisecond
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <b className={styles.moduleSettingTitle}>Connection Sound</b>
                    <hr className={styles.lines} />
                    <div className={styles.settingItem}>
                      <div>
                        <span className={styles.settingLabel}>Sound:</span>
                        <Switch
                          checked={ConnectionSound}
                          onChange={(checked) => setConnectionSound(checked)}
                        />
                        <p className={styles.suggestText}>
                          Turn on or off sound when connecting module
                        </p>
                      </div>
                    </div>
                    <div className={styles.settingItem}>
                      <div>
                        <span className={styles.settingLabel}>
                          Connection Sound Duration (milliseconds)
                        </span>
                        <br />
                        <InputNumber
                          placeholder="Connection Sound Duration (ms)"
                          value={ConnectionSoundDurationMs} // Convert seconds to milliseconds for display
                          onChange={(value) => {
                            if (value !== null) {
                              setConnectionSoundDurationMs(value); // Convert milliseconds back to seconds
                            }
                          }}
                          min={0}
                          step={1} // Set the step to 1 millisecond
                          className={styles.inputNumber}
                        />{' '}
                        {/* {' millisecond'} */}
                        <p className={styles.suggestText}>
                          Set connection time duration for module
                        </p>
                      </div>
                    </div>
                  </Col>
                  <Col>
                    <b className={styles.moduleSettingTitle}>Attendance Sound</b>
                    <hr className={styles.lines} />
                    <div className={styles.settingItem}>
                      <div>
                        <span className={styles.settingLabel}>Sound:</span>
                        <Switch
                          checked={AttendanceSound}
                          onChange={(checked) => setAttendanceSound(checked)}
                        />
                        <p className={styles.suggestText}>
                          Turn on or off sound when check attendance
                        </p>
                      </div>
                    </div>
                    <div className={styles.settingItem}>
                      <div>
                        <span className={styles.settingLabel}>
                          Attendance Sound Duration (milliseconds)
                        </span>
                        <br />
                        <InputNumber
                          placeholder="Attendance Sound Duration (ms)"
                          value={AttendanceSoundDurationMs} // Convert seconds to milliseconds for display
                          onChange={(value) => {
                            if (value !== null) {
                              setAttendanceSoundDurationMs(value); // Convert milliseconds back to seconds
                            }
                          }}
                          min={0}
                          step={1} // Set the step to 1 millisecond
                          className={styles.inputNumber}
                        />{' '}
                        {/* {' millisecond'} */}
                        <p className={styles.suggestText}>
                          Set connection time duration for module
                        </p>
                      </div>
                    </div>
                  </Col>
                  <div className={styles.submitButtonContainer}>
                    <Button
                      onClick={handleApply}
                      className={styles.submitButton}
                    >
                      Apply
                    </Button>
                    <Button
                      onClick={handleSubmit}
                      className={styles.submitButton}
                    >
                      Submit
                    </Button>
                  </div>
                </div>
              </TabPane>
              <TabPane
                tab={
                  <span>
                    <HistoryOutlined style={{ marginRight: 5 }} />
                    History
                  </span>
                }
                key="3"
              >
                <div
                  id="scrollableDiv"
                  style={{
                    height: 'auto',
                    overflow: 'auto',
                    // padding: '0 16px',
                    // border: '1px solid rgba(140, 140, 140, 0.35)',
                  }}
                >
                  {/* <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < 1}
                    loader={
                      <Skeleton
                        avatar
                        paragraph={{
                          rows: 1,
                        }}
                        active
                      />
                    }
                    endMessage={
                      <Divider plain>It is all, nothing more 🤐</Divider>
                    }
                    scrollableTarget="scrollableDiv"
                  > */}
                  <List
                    dataSource={paginatedData}
                    renderItem={(item) => (
                      <Collapse
                        style={{ width: '100%', marginTop: 5, marginBottom: 5 }}
                        activeKey={activeKey}
                        onChange={handlePanelChange}
                        accordion
                      >
                        <Panel
                          header={
                            <div style={{ display: 'flex' }}>
                              <div style={{ marginRight: 10, width: '20%' }}>
                                <b
                                  style={{
                                    color:
                                      item.title === 'Schedule preparation'
                                        ? 'green'
                                        : item.title === 'Schedules preparation'
                                        ? 'blue'
                                        : 'initial',
                                  }}
                                >
                                  {item.title}
                                </b>
                              </div>
                              <div style={{ width: '60%' }}>
                                <b
                                  style={{
                                    color: item.description
                                      .toLowerCase()
                                      .includes('failed')
                                      ? 'red'
                                      : item.description
                                          .toLowerCase()
                                          .includes('successfully')
                                      ? 'green'
                                      : 'black',
                                  }}
                                >
                                  {item.description}
                                </b>
                              </div>
                              <div style={{ width: '20%' }}>
                                <Progress
                                  percent={item.preparationTask.progress}
                                ></Progress>
                              </div>
                            </div>
                          }
                          key={item.moduleActivityId}
                          style={{ cursor: 'pointer' }}
                          onClick={() => {
                            if (item.preparationTask.preparedSchedules) {
                              // setListScheduleId(
                              //   item.preparationTask.preparedSchedules,
                              // );
                              getAllSchedule(
                                item.preparationTask.preparedSchedules,
                              );
                              console.log(
                                'srgvrsdgvswrdvgs',
                                item.preparationTask.preparedSchedules,
                              );
                            } else if (
                              item.preparationTask.preparedScheduleId
                            ) {
                              getScheduleByID(
                                item.preparationTask.preparedScheduleId,
                              );
                            }
                          }}
                        >
                          <List.Item key={item.moduleActivityId}>
                            {/* <List.Item.Meta
                                title={item.title}
                                description={item.description}
                              />
                              <div>Additional Content</div> */}
                            <div style={{ width: '60%' }}>
                              <div
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  backgroundColor: '#f5f5f5',
                                  borderRadius: '5px',
                                  padding: '5px 10px',
                                  fontSize: '14px',
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
                                  {item.preparationTask.uploadedFingers}
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
                                  {item.preparationTask.totalFingers}
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
                              <br />
                              <b>{item.title}</b>
                              <p>{item.description}</p>
                              <p>
                                <b>Start Time:</b>
                                {' ' +
                                  new Date(item.startTime).toLocaleString(
                                    'en-GB',
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                      hour12: false,
                                    },
                                  )}
                              </p>
                              <p>
                                <b>End Time:</b>
                                {' ' +
                                  new Date(item.endTime).toLocaleString(
                                    'en-GB',
                                    {
                                      day: '2-digit',
                                      month: '2-digit',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                      second: '2-digit',
                                      hour12: false,
                                    },
                                  )}
                              </p>
                            </div>
                            {item.preparationTask.preparedScheduleId && (
                              <>
                                <div style={{ width: '20%' }}>
                                  <p>
                                    <b>Date:</b> {schedule?.result.date}
                                  </p>
                                  <p>
                                    <b>Class:</b>{' '}
                                    {schedule?.result.class.classCode}
                                  </p>
                                </div>
                                <div style={{ width: '20%' }}>
                                  <p>
                                    <b>Slot:</b>{' '}
                                    {schedule?.result.slot.slotNumber}
                                  </p>
                                  <p>
                                    <b>Time:</b>{' '}
                                    {schedule?.result.slot.startTime +
                                      '-' +
                                      schedule?.result.slot.endtime}
                                  </p>
                                </div>
                              </>
                            )}
                          </List.Item>
                          {scheduleList.length > 0 && (
                            <Table
                              columns={columns}
                              dataSource={scheduleList.map((item1, index) => ({
                                key: index,
                                date: new Date(item1.date).toLocaleDateString(
                                  'en-GB',
                                ),
                                slot: item1.slot.slotNumber || 'N/A',
                                time: (
                                  <div>
                                    {item1.slot.startTime.slice(0, 5)} -{' '}
                                    {item1.slot.endtime.slice(0, 5)}
                                  </div>
                                ),
                                class: item1.class.classCode || 'N/A',
                                uploadFingerprints: (
                                  <>
                                    {item1.uploaded} / {item1.total}
                                  </>
                                ),
                              }))}
                              pagination={false}
                            ></Table>
                          )}
                        </Panel>
                      </Collapse>
                    )}
                  />
                  {/* </InfiniteScroll> */}
                </div>
                <Row style={{ marginTop: 10 }}>
                  <Col>
                    <Pagination
                      current={currentPage}
                      pageSize={pageSize}
                      total={moduleActivity.length}
                      onChange={handlePageChange}
                    />
                  </Col>
                  <Col>
                    <Select
                      value={pageSize}
                      onChange={handlePageSizeChange}
                      style={{ width: 120, marginLeft: 16 }}
                    >
                      {pageSizeOptions.map((size) => (
                        <Select.Option key={size} value={size}>
                          {size} per page
                        </Select.Option>
                      ))}
                    </Select>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default LecturerModuleDetail;
