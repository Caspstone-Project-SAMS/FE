import React from "react";
import styles from "./HomeCalendar.module.less";

import ContentHeader from "../header/contentHeader/ContentHeader";
import MyCalendar from "./MyCalendar";
import { Content } from "antd/es/layout/layout";
import Excel from "../excel/Excel";
import { Button } from "antd";
import { CiImageOn } from "react-icons/ci";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/Store";

const HomeCalendar: React.FC = () => {
  const userRole = useSelector((state: RootState) => state.auth.userDetail?.result?.role.name)

  return (
    <Content className={styles.homeCalendarCtn}>
      <div className={styles.header}>
        <ContentHeader
          contentTitle='Calendar'
          previousBreadcrumb={undefined}
          currentBreadcrumb={undefined}
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          {
            userRole && userRole === 'Lecturer' ? (
              <Link to={'/calendar/import-schedule'}>
                <Button
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  size="large" icon={<CiImageOn size={18} />}>
                  Import FAP Image
                </Button>
              </Link>
            ) : (
              userRole && userRole === 'Admin' && (
                <Link to={'/schedule/import-schedule'}>
                  <Button
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    size="large" icon={<CiImageOn size={18} />}>
                    Import FAP Image
                  </Button>
                </Link>
              )
            )
          }
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
