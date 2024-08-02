import React, { useState, useEffect } from 'react';
import {
  Card,
  Col,
  Layout,
  Row,
  Space,
  Typography,
  Tabs,
  Skeleton,
  Divider,
  List,
  Collapse,
  Progress,
  message,
  Radio,
  DatePicker,
  Button,
  TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import { Content } from 'antd/es/layout/layout';
import { useLocation } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SettingOutlined, HistoryOutlined } from '@ant-design/icons';
import styles from './Module.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';

import type {
  ModuleActivity,
  ModuleByID,
  ModuleDetail,
} from '../../../models/module/Module';
import { ModuleService } from '../../../hooks/Module';
import { CalendarService } from '../../../hooks/Calendar';
import { Schedules } from '../../../models/calendar/Schedule';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import {
  clearModuleMessages,
  settingModules,
} from '../../../redux/slice/Module';
import moment from 'moment';

const { Header: AntHeader } = Layout;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const ModuleDetail: React.FC = () => {
  const location = useLocation();
  const [module, setModule] = useState<ModuleByID>();
  const [moduleActivity, setModuleActivity] = useState<ModuleActivity[]>([]);
  const [moduleID, setModuleID] = useState<number>(0);
  const [schedule, setSchedule] = useState<Schedules>();
  const [activeKey, setActiveKey] = useState<string | string[]>();
  const [AutoPrepare, setAutoPrepare] = useState(false);
  const [PreparedTime, setPreparedTime] = useState('');
  const [reload, setReload] = useState(0);

  const dispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const failMessage = useSelector((state: RootState) => state.module.message);
  const successMessage = useSelector(
    (state: RootState) => state.module.moduleDetail,
  );
  console.log('succccc', successMessage);
  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      dispatch(clearModuleMessages());
    }
    if (failMessage && failMessage.data.error.title) {
      message.error(`${failMessage.data.error.title}`);
      dispatch(clearModuleMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  // const [isUpdate, setIsUpdate] = useState(false);
  // const [searchInput, setSearchInput] = useState('');

  console.log('schedule', schedule);

  const autoPrepareStatus = module?.result.autoPrepare;

  const moduleDetails = [
    { title: 'Module', value: module?.result.moduleID },
    { title: 'Employee', value: module?.result.employee.displayName },
    { title: 'Mode', value: module?.result.mode },
    {
      title: 'Status',
      value: module?.result.status ? 'active' : 'inactive',
      status: true,
    },
    {
      title: 'Auto Prepare',
      value: (
        <span style={{ color: autoPrepareStatus ? 'green' : 'red' }}>
          {autoPrepareStatus ? 'true' : 'false'}
        </span>
      ),
    },
    {
      title: 'Prepare Time',
      value: module?.result.preparedTime,
    },
    { title: 'Auto Reset', value: module?.result.autoReset },
    { title: 'Reset Time', value: module?.result.resetTime },
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
          setModuleActivity(data?.result.moduleActivities || []);
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
    token: string,
  ) => {
    const arg = {
      moduleID: moduleID,
      AutoPrepare: AutoPrepare,
      PreparedTime: PreparedTime,
      token: token,
    };
    await dispatch(settingModules(arg) as any);
  };

  const handleSubmit = async () => {
    await settingModule(moduleID, AutoPrepare, PreparedTime, token);
    setReload((prev) => (prev) + 1);
  };

  const handlePanelChange = (key: string | string[]) => {
    setActiveKey(key); // Update the active key
  };

  const teacherDetails = [
    { label: 'Name', value: module?.result.employee.displayName },
    { label: 'Department', value: module?.result.employee.department },
  ];

  const data = moduleActivity;

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
              <Col span={24}>
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
                              <p
                                style={{
                                  color: detail.status
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
        <Row>
          <Col span={24}>
            <Tabs defaultActiveKey="1">
              <TabPane
                tab={
                  <span>
                    <SettingOutlined />
                    Settings
                  </span>
                }
                key="2"
              >
                <div className={styles.moduleSettingsContainer}>
                  <b className={styles.moduleSettingsTitle}>Module Setting</b>
                  <div className={styles.settingItem}>
                    <p className={styles.settingLabel}>Auto Prepare:</p>
                    <Radio.Group
                      onChange={(e) => setAutoPrepare(e.target.value)}
                      value={AutoPrepare}
                      className={styles.radioGroup}
                      optionType="button"
                    >
                      <Radio value={true}>true</Radio>
                      <Radio value={false}>false</Radio>
                    </Radio.Group>
                  </div>
                  <div className={styles.settingItem}>
                    <p className={styles.settingLabel}>Prepare Time</p>
                    <TimePicker
                      placeholder="Prepare Time"
                      value={PreparedTime ? dayjs(PreparedTime, 'HH:mm') : null}
                      onChange={(time, timeString) => {
                        if (typeof timeString === 'string') {
                          setPreparedTime(timeString);
                        }
                      }}
                      format="HH:mm"
                      className={styles.timePicker}
                    />
                  </div>
                  <div className={styles.submitButtonContainer}>
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
                    <HistoryOutlined />
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
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
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
                    dataSource={data}
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
                                <b>{item.title}</b>
                              </div>
                              <div style={{ width: '60%' }}>
                                {item.description}
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
                          onClick={() =>
                            getScheduleByID(
                              item.preparationTask.preparedScheduleId,
                            )
                          }
                        >
                          <List.Item key={item.moduleActivityId}>
                            {/* <List.Item.Meta
                                title={item.title}
                                description={item.description}
                              />
                              <div>Additional Content</div> */}
                            <div style={{ width: '60%' }}>
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
                            <div style={{ width: '20%' }}>
                              <p>
                                <b>Date:</b> {schedule?.result.date}
                              </p>
                              <p>
                                <b>Class:</b> {schedule?.result.class.classCode}
                              </p>
                            </div>
                            <div style={{ width: '20%' }}>
                              <p>
                                <b>Slot:</b> {schedule?.result.slot.slotNumber}
                              </p>
                              <p>
                                <b>Time:</b>{' '}
                                {schedule?.result.slot.startTime +
                                  '-' +
                                  schedule?.result.slot.endtime}
                              </p>
                            </div>
                          </List.Item>
                        </Panel>
                      </Collapse>
                    )}
                  />
                  {/* </InfiniteScroll> */}
                </div>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default ModuleDetail;
