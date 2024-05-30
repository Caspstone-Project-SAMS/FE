import { Content } from "antd/es/layout/layout";
import React from "react";
import './Class.css'
import { Space, Typography } from "antd";
import ClassTable from "../../components/classtable/ClassTable";

const Class: React.FC = () => {
  return (
    <Content className="content">
      <Typography.Title level={3}>Class</Typography.Title>
      <Space direction="horizontal">
        <text>Home / </text>
        <text className="text-class">Class</text>
      </Space>
      <ClassTable />
    </Content>
  );
};

export default Class;
