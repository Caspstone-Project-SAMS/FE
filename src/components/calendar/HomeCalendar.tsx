import React, { useEffect, useState } from 'react';
import styles from './HomeCalendar.module.less';

import ContentHeader from '../header/contentHeader/ContentHeader';
import MyCalendar from './MyCalendar';
import { Content } from 'antd/es/layout/layout';
import Excel from '../excel/Excel';
import { Button, message, Modal } from 'antd';
import { CiImageOn } from 'react-icons/ci';
import { GoHistory } from 'react-icons/go';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { clearScheduleRecordMessages } from '../../redux/slice/ScheduleRecord';
import ImportRecord from './ImportRecord';

const HomeCalendar: React.FC = () => {
  const userRole = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.role.name,
  );

  const failMessage = useSelector(
    (state: RootState) => state.scheduleRecord.scheduleRecordDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.scheduleRecord.message,
  );

  const [isModalVisible, setIsModalVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage.title);
      setIsModalVisible(false);
      dispatch(clearScheduleRecordMessages());
    }
    if (failMessage && failMessage.errors) {
      message.error(`${failMessage.errors}`);
      dispatch(clearScheduleRecordMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Content className={styles.homeCalendarCtn}>
      <div className={styles.header}>
        <ContentHeader
          contentTitle="Calendar"
          previousBreadcrumb={undefined}
          currentBreadcrumb={undefined}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          {/* <Link to={'/calendar/import-schedule-record'}> */}
          <Button
            onClick={showModal}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
            size="large"
            icon={<GoHistory size={18} />}
          >
            Import Record
          </Button>
          {/* </Link> */}
          <ImportRecord isModalVisible={isModalVisible} handleOk={handleOk} handleCancel={handleCancel} setIsModalVisible={setIsModalVisible}/>
          {userRole && userRole === 'Lecturer' ? (
            <Link to={'/calendar/import-schedule'}>
              <Button
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
                size="large"
                icon={<CiImageOn size={18} />}
              >
                Import FAP Image
              </Button>
            </Link>
          ) : (
            userRole &&
            userRole === 'Admin' && (
              <Link to={'/schedule/import-schedule'}>
                <Button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  size="large"
                  icon={<CiImageOn size={18} />}
                >
                  Import FAP Image
                </Button>
              </Link>
            )
          )}
          <Excel fileType="schedule" />
        </div>
      </div>
      <div className={styles.calendarCtn}>
        <MyCalendar LECTURER_ID={undefined} />
      </div>
    </Content>
  );
};

export default HomeCalendar;

// import React from "react";
// import { Content, Header } from "antd/es/layout/layout";
// import { CalendarOutlined } from "@ant-design/icons";
// import { Select, Space, Typography } from "antd";
// import { Calender } from "../../models/Calendar";
// import "./HomeCalendar.css";
// import ShowCalendar from "./ShowCalendar";

// const HomeCalendar: React.FC = () => {
//   const handleChange = (value: string) => {
//     console.log(value);
//   };

//   const defaultOption: Calender = {
//     value: "month",
//     label: "Month",
//   };

//   return (
//     <Content className="content">
//       <Header className="homecalendar-header">
//         <Space>
//           <CalendarOutlined className="calendar-icon" />
//           <Typography.Title className="titleStyle" level={3}>
//             MAY 2024
//           </Typography.Title>
//           <Select
//             labelInValue
//             defaultValue={defaultOption.value}
//             style={{ width: 120 }}
//             onChange={handleChange}
//             options={[
//               { value: "week", label: "Week" },
//               { value: "month", label: "Month" },
//               { value: "year", label: "Year" },
//             ]}
//           />
//         </Space>
//         <Space></Space>
//       </Header>
//       <ShowCalendar />
//     </Content>
//   );
// };

// export default HomeCalendar;
