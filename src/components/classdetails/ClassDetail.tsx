import { Card, Space } from 'antd';
import React from 'react';
import './ClassDetail.css';

const ClassDetail: React.FC = () => {
  return (
    <Space direction="horizontal" className='class-details-header'>
      <Space className="card-parent">
        <Card className="card-1"></Card>
      </Space>
      <Space>
        <Card className="card-2"></Card>
      </Space>
    </Space>
  );
};

export default ClassDetail;
