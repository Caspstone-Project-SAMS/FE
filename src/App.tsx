// import { Button, Layout, Space, Typography, Avatar, Badge } from "antd";

// import { Content, Header } from "antd/es/layout/layout";
// import { CiBellOn } from "react-icons/ci";

// // import { AntDesignOutlined, BellFilled } from "@ant-design/icons";

// import "./App.css";
// import Sidebar from "./components/sidebar/Sidebar";

// function App() {
//   return (
//     <Layout className="container">
//       <Sidebar />
//       <Layout>
//         <Header color="white" style={{ backgroundColor: "white" }}>
//           <div className="header">
//             {/* <div className="brand">Student Attendance Management System</div> */}
//             <Typography.Title level={3}>
//               Student Attendance Management System
//             </Typography.Title>
//             <Space wrap size="middle">
//               <Badge count={10}>
//                 <Button shape="circle">
//                   <CiBellOn />
//                 </Button>
//               </Badge>
//               <Avatar
//                 size={{
//                   xs: 24,
//                   sm: 32,
//                   md: 10,
//                   lg: 14,
//                   xl: 32,
//                   xxl: 10,
//                 }}
//                 icon={<CiBellOn />}
//               />
//             </Space>
//           </div>
//         </Header>
//         <Content>content</Content>
//       </Layout>
//     </Layout>
//   );
// }

// export default App;

import { Layout } from "antd";


// import { AntDesignOutlined, BellFilled } from "@ant-design/icons";

import "./App.css";
import Sidebar from "./components/sidebar/Sidebar";
import Headers from "./components/header/Header";
import PageContent from "./components/pagecontents/PageContents";


function App() {
  
  return (
    <Layout className="container">
      <Sidebar />
      <Layout>
        <Headers />
        <PageContent />
      </Layout>
    </Layout>
  );
}

export default App;
