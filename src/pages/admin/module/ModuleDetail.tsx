// import React, { useState, useEffect } from 'react';
// import {
//   Card,
//   Col,
//   Layout,
//   Row,
//   Space,
//   Typography,
//   Tabs,
//   Skeleton,
//   Divider,
//   List,
//   Avatar,
// } from 'antd';
// import { Content } from 'antd/es/layout/layout';
// import { useLocation } from 'react-router-dom';
// import InfiniteScroll from 'react-infinite-scroll-component';
// import { SettingOutlined, HistoryOutlined } from '@ant-design/icons';
// import styles from './Module.module.less';
// import ContentHeader from '../../../components/header/contentHeader/ContentHeader';

// import type {
//   ModuleActivity,
//   ModuleByID,
//   ModuleDetail,
// } from '../../../models/module/Module';
// import { ModuleService } from '../../../hooks/Module';

// const { Header: AntHeader } = Layout;
// const { TabPane } = Tabs;

// const ModuleDetail: React.FC = () => {
//   const location = useLocation();
//   const [module, setModule] = useState<ModuleByID>();
//   const [moduleActivity, setModuleActivity] = useState<ModuleActivity[]>([]);
//   const [moduleID, setModuleID] = useState<number>(0);
//   const [isUpdate, setIsUpdate] = useState(false);
//   const [searchInput, setSearchInput] = useState('');

//   console.log('module', module);

//   const moduleDetails = [
//     { title: 'Module', value: module?.result.moduleID },
//     { title: 'Employee', value: module?.result.employee.displayName },
//     { title: 'Mode', value: module?.result.mode },
//     {
//       title: 'Status',
//       value: module?.result.status ? 'active' : 'inactive',
//       status: true,
//     },
//     { title: 'Auto Prepare', value: module?.result.autoPrepare },
//     {
//       title: 'Reset Min Before Slot',
//       value: module?.result.resetMinBeforeSlot,
//     },
//     { title: 'Auto Reset', value: module?.result.autoReset },
//     {
//       title: 'Reset Min After Slot',
//       value: module?.result.resetMinAfterSlot,
//     },
//     { title: 'Reset Time', value: module?.result.resetTime },
//   ];

//   useEffect(() => {
//     if (location.state && location.state.moduleID) {
//       setModuleID(location.state.moduleID);
//     }
//   }, [location.state]);

//   useEffect(() => {
//     if (moduleID !== 0) {
//       const response = ModuleService.getModuleByID(moduleID);

//       response
//         .then((data) => {
//           setModule(data || undefined);
//           setModuleActivity(data?.result.moduleActivities || []);
//         })
//         .catch((error) => {
//           console.log('get module by id error: ', error);
//         });
//     }
//   }, [moduleID]);

//   const teacherDetails = [
//     { label: 'Name', value: module?.result.employee.displayName },
//     { label: 'Department', value: module?.result.employee.department },
//   ];

//   const loadMoreData = () => {
//     // Your logic to load more data
//   };

//   const data = moduleActivity; // Assuming moduleActivity holds the data to be displayed

//   return (
//     <Content className={styles.moduleContent}>
//       <ContentHeader
//         contentTitle="Module"
//         previousBreadcrumb="Home / Module / "
//         currentBreadcrumb="Module Detail"
//         key=""
//       />
//       <Card className={styles.cardHeaderDetail}>
//         <Row gutter={[16, 16]}>
//           <Col span={14}>
//             <Card style={{ height: '100%' }}>
//               <Row>
//                 <Col span={4}>
//                   <img
//                     alt="Employee"
//                     src={module?.result.employee.avatar}
//                     style={{ width: 100, height: 100 }}
//                   />
//                 </Col>
//                 <Col span={19} style={{ marginLeft: 20 }}>
//                   <Content>
//                     <Space
//                       direction="horizontal"
//                       className={styles.accountInfo}
//                     >
//                       {teacherDetails.map((detail) => (
//                         <Space
//                           direction="vertical"
//                           className={styles.accountDetails}
//                           key={detail.label}
//                         >
//                           <Typography.Text className={styles.textTitle}>
//                             {detail.label}
//                           </Typography.Text>
//                           <Typography.Title level={4}>
//                             {detail.value}
//                           </Typography.Title>
//                         </Space>
//                       ))}
//                     </Space>
//                   </Content>
//                 </Col>
//               </Row>
//             </Card>
//           </Col>
//           <Col span={10}>
//             <Content>
//               <AntHeader className={styles.tableHeader}>
//                 <p className={styles.tableTitle}>Class Details</p>
//               </AntHeader>
//               <Col span={24}>
//                 <Content>
//                   <Content>
//                     <table className={styles.moduleDetailsTable}>
//                       <tbody>
//                         {moduleDetails.map((detail, index) => (
//                           <tr key={index}>
//                             <td className={styles.updateModuleTitle}>
//                               {detail.title}
//                             </td>
//                             <td>
//                               <p
//                                 style={{
//                                   color: detail.status
//                                     ? detail.value === 'true'
//                                       ? 'green'
//                                       : 'red'
//                                     : 'inherit',
//                                 }}
//                               >
//                                 {detail.value}
//                               </p>
//                             </td>
//                           </tr>
//                         ))}
//                       </tbody>
//                     </table>
//                   </Content>
//                 </Content>
//               </Col>
//             </Content>
//           </Col>
//         </Row>
//         <Row>
//           <Col span={24}>
//             <Tabs defaultActiveKey="1">
//               <TabPane
//                 tab={
//                   <span>
//                     <SettingOutlined />
//                     Settings
//                   </span>
//                 }
//                 key="2"
//               ></TabPane>
//               <TabPane
//                 tab={
//                   <span>
//                     <HistoryOutlined />
//                     History
//                   </span>
//                 }
//                 key="3"
//               >
//                 <div
//                   id="scrollableDiv"
//                   style={{
//                     height: 400,
//                     overflow: 'auto',
//                     padding: '0 16px',
//                     border: '1px solid rgba(140, 140, 140, 0.35)',
//                   }}
//                 >
//                   <InfiniteScroll
//                     dataLength={data.length}
//                     next={loadMoreData}
//                     hasMore={data.length < 5}
//                     loader={
//                       <Skeleton
//                         avatar
//                         paragraph={{
//                           rows: 1,
//                         }}
//                         active
//                       />
//                     }
//                     endMessage={
//                       <Divider plain>It is all, nothing more 🤐</Divider>
//                     }
//                     scrollableTarget="scrollableDiv"
//                   >
//                     <List
//                       dataSource={data}
//                       renderItem={(item) => (
//                         <List.Item key={item.moduleActivityId}>
//                           <List.Item.Meta
//                             // avatar={<Avatar src={item.picture.large} />}
//                             title={item.title}
//                             description={item.description}
//                           />
//                           <div>Content</div>
//                         </List.Item>
//                       )}
//                     />
//                   </InfiniteScroll>
//                 </div>
//               </TabPane>
//             </Tabs>
//           </Col>
//         </Row>
//       </Card>
//     </Content>
//   );
// };

// export default ModuleDetail;

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
  Avatar,
  Collapse,
} from 'antd';
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

const { Header: AntHeader } = Layout;
const { TabPane } = Tabs;
const { Panel } = Collapse;

const ModuleDetail: React.FC = () => {
  const location = useLocation();
  const [module, setModule] = useState<ModuleByID>();
  const [moduleActivity, setModuleActivity] = useState<ModuleActivity[]>([]);
  const [moduleID, setModuleID] = useState<number>(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  console.log('module', module);

  const moduleDetails = [
    { title: 'Module', value: module?.result.moduleID },
    { title: 'Employee', value: module?.result.employee.displayName },
    { title: 'Mode', value: module?.result.mode },
    {
      title: 'Status',
      value: module?.result.status ? 'active' : 'inactive',
      status: true,
    },
    { title: 'Auto Prepare', value: module?.result.autoPrepare },
    {
      title: 'Reset Min Before Slot',
      value: module?.result.resetMinBeforeSlot,
    },
    { title: 'Auto Reset', value: module?.result.autoReset },
    {
      title: 'Reset Min After Slot',
      value: module?.result.resetMinAfterSlot,
    },
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
          setModuleActivity(data?.result.moduleActivities || []);
        })
        .catch((error) => {
          console.log('get module by id error: ', error);
        });
    }
  }, [moduleID]);

  const teacherDetails = [
    { label: 'Name', value: module?.result.employee.displayName },
    { label: 'Department', value: module?.result.employee.department },
  ];

  const loadMoreData = () => {
    // Your logic to load more data
  };

  const data = moduleActivity; // Assuming moduleActivity holds the data to be displayed

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
                <p className={styles.tableTitle}>Class Details</p>
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
              ></TabPane>
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
                    height: 400,
                    overflow: 'auto',
                    padding: '0 16px',
                    border: '1px solid rgba(140, 140, 140, 0.35)',
                  }}
                >
                  <InfiniteScroll
                    dataLength={data.length}
                    next={loadMoreData}
                    hasMore={data.length < 5}
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
                  >
                    <List
                      dataSource={data}
                      renderItem={(item) => (
                        
                          <Collapse style={{width: '100%', marginTop: 10}}>
                            <Panel header={item.title} key={item.moduleActivityId}>
                            <List.Item key={item.moduleActivityId}>
                              <List.Item.Meta
                                title={item.title}
                                description={item.description}
                              />
                              <div>Additional Content</div>
                              </List.Item>
                            </Panel>
                          </Collapse>
                        
                      )}
                    />
                  </InfiniteScroll>
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
