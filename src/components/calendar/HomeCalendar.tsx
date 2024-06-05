import React from "react";
import "./HomeCalendar.less";

import ContentHeader from "../header/contentHeader/ContentHeader";
import MyCalendar from "./MyCalendar";

const HomeCalendar: React.FC = () => {

  return (
    <div className="home-calendar-ctn">
      <ContentHeader contentTitle='Calendar' previousBreadcrumb={undefined} currentBreadcrumb={undefined} />
      <div className="calendar-ctn">
        <MyCalendar />
      </div>
    </div>
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
