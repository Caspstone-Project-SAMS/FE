import { Content, Header } from "antd/es/layout/layout";
import React from "react";
import "./Account.css";
import { Button, Card, Layout, Space, Typography } from "antd";
import { BsThreeDotsVertical } from "react-icons/bs";

const teacherDetails = [
  { label: "First Name", value: "John" },
  { label: "Last Name", value: "Doe" },
  { label: "Email", value: "john.doe@example.com" },
];

const Account: React.FC = () => {
  return (
    <Content className="content">
      <Typography.Title level={3}>Teacher Details</Typography.Title>
      <Space direction="horizontal">
        <text>Teachers / </text>
        <text className="text-account">Teachers details</text>
      </Space>
      <Layout
        style={{ backgroundColor: "white", height: "90%", marginRight: "20px" }}
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
            <Space>
              <Card className="parent-card">
                <Header style={{ backgroundColor: "white" }}></Header>
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
              <Card className="parent-card"></Card>
            </Space>
            <Button>Edit</Button>
          </Space>
        </Content>
      </Layout>
    </Content>
  );
};

export default Account;
