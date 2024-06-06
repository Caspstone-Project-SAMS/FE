import { Content, Header } from 'antd/es/layout/layout';
import React from 'react';
import './Account.css';
import { Button, Card, Layout, Space, Typography } from 'antd';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { RxAvatar } from 'react-icons/rx';

const teacherDetails = [
  { label: 'First Name', value: 'John' },
  { label: 'Last Name', value: 'Doe' },
  { label: 'Father Name', value: 'Robert Anderson' },
  { label: 'Mother Name', value: 'Sarah Anderson' },
  { label: 'Father Occupation', value: 'Engineer' },
  { label: 'Mother Occupation', value: 'Burse' },
  { label: 'Date of Birth', value: '14-02-1986' },
  { label: 'Religion', value: 'Christian' },
  { label: 'Class', value: 'Five' },
  { label: 'Subject', value: 'English' },
  { label: 'Id Number', value: 'TCH12345' },
  { label: 'Joining Date', value: '03-05-2012' },
];

// const Account: React.FC = () => {
//   return (
//     <Content className="content">
//       <Typography.Title level={3}>Teacher Details</Typography.Title>
//       <Space direction="horizontal">
//         <text>Teachers / </text>
//         <text className="text-account">Teachers details</text>
//       </Space>
//       <Layout
//         style={{ backgroundColor: 'white', height: '90%', marginRight: '20px' }}
//       >
//         <Header className="account-header">
//           <Space direction="horizontal">
//             <Typography.Title level={3}>About Me</Typography.Title>
//           </Space>
//           <Button shape="circle">
//             <BsThreeDotsVertical />
//           </Button>
//         </Header>
//         <Content>
//           <Space direction="vertical" className="space-card">
//             <Space direction="horizontal" className="card">
//               <Card className="parent-card">
//                 <Space style={{ backgroundColor: 'white' }}>
//                   <RxAvatar size={40}/>
//                   <Typography.Title>abc</Typography.Title>
//                 </Space>
//                 <Content>
//                   <Space direction="horizontal" className="account-info">
//                     {teacherDetails.map((detail) => (
//                       <Space
//                         direction="vertical"
//                         className="account-details"
//                         key={detail.label}
//                       >
//                         <Typography.Text>{detail.label}</Typography.Text>
//                         <Typography.Title level={4}>
//                           {detail.value}
//                         </Typography.Title>
//                       </Space>
//                     ))}
//                   </Space>
//                 </Content>
//               </Card>
//               <Card className="parent-card">
//                 <Header style={{ backgroundColor: 'white' }}></Header>
//                 <Content>
//                   <Space direction="horizontal" className="account-info">
//                     {teacherDetails.map((detail) => (
//                       <Space
//                         direction="vertical"
//                         className="account-details"
//                         key={detail.label}
//                       >
//                         <Typography.Text>{detail.label}</Typography.Text>
//                         <Typography.Title level={4}>
//                           {detail.value}
//                         </Typography.Title>
//                       </Space>
//                     ))}
//                   </Space>
//                 </Content>
//               </Card>
//             </Space>
//             <Button>Edit</Button>
//           </Space>
//         </Content>
//       </Layout>
//     </Content>
//   );
// };

// export default Account;

const Account: React.FC = () => {
  return (
    <Content className="content">
      <Typography.Title level={3}>Teacher Details</Typography.Title>
      <Space direction="horizontal">
        <text>Teachers / </text>
        <text className="text-account">Teachers details</text>
      </Space>
      <Layout
        style={{ backgroundColor: 'white', marginRight: '20px' }}
      >
        <Header className="account-header">
          <Space direction="horizontal">
            <Typography.Title level={3}>About Me</Typography.Title>
          </Space>
          <Button shape="circle">
            <BsThreeDotsVertical />
          </Button>
        </Header>
        <Content>
          <Space direction="vertical" className="space-card">
            <Space direction="horizontal" className="card">
              <Card className="parent-card">
                <Space style={{ backgroundColor: 'white' }}>
                  <RxAvatar size={40}/>
                  <Typography.Title>abc</Typography.Title>
                </Space>
                <Content>
                  <Space direction="horizontal" className="account-info">
                    {teacherDetails.map((detail) => (
                      <Space
                        direction="vertical"
                        className="account-details"
                        key={detail.label}
                      >
                        <Typography.Text>{detail.label}</Typography.Text>
                        <Typography.Title level={4}>
                          {detail.value}
                        </Typography.Title>
                      </Space>
                    ))}
                  </Space>
                </Content>
              </Card>
              <Card className="parent-card">
                <Header style={{ backgroundColor: 'white' }}></Header>
                <Content>
                  <Space direction="horizontal" className="account-info">
                    {teacherDetails.map((detail) => (
                      <Space
                        direction="vertical"
                        className="account-details"
                        key={detail.label}
                      >
                        <Typography.Text>{detail.label}</Typography.Text>
                        <Typography.Title level={4}>
                          {detail.value}
                        </Typography.Title>
                      </Space>
                    ))}
                  </Space>
                </Content>
              </Card>
            </Space>
            <Space style={{ width: '100%', justifyContent: 'end' }}>
              <Button>Edit</Button>
            </Space>
          </Space>
        </Content>
      </Layout>
    </Content>
  );
};

export default Account;