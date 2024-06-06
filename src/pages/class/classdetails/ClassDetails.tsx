import { Content } from 'antd/es/layout/layout';
import React from 'react';
import '../Class.css';
import { Button, Card, Space, Typography } from 'antd';
import ClassDetail from '../../../components/classdetails/ClassDetail';

const ClassDetails: React.FC = () => {
  return (
    <Content className="content">
      <Space className="class-details-header">
        <Space direction="vertical">
          <Typography.Title level={3}>Class</Typography.Title>
          <Space direction="horizontal">
            <text>Home / </text>
            <text className="text-class">Class / SEP240_Room.302</text>
          </Space>
        </Space>
        <Space>
          <Button className="btn-fap">
            <Space direction='horizontal'>
              <Typography.Text className='btn-text'>Check on FAP</Typography.Text>
              <hr className='hr-line'></hr>
            </Space>
          </Button>
        </Space>
      </Space>
      <ClassDetail />

    </Content>
  );
};

export default ClassDetails;
