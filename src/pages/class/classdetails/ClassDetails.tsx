import { Content } from 'antd/es/layout/layout';
import React from 'react';
import styles from '../Class.module.css';
import { Button, Space, Typography } from 'antd';
import ClassDetail from '../../../components/classdetails/ClassDetail';

const ClassDetails: React.FC = () => {
  return (
    <Content className={styles.content}>
      <Space className={styles.classDetailsHeader}>
        <Space direction="vertical">
          <Typography.Title level={3}>Class</Typography.Title>
          <Space direction="horizontal">
            <text>Home / </text>
            <text className={styles.textClass}>Class / SEP240_Room.302</text>
          </Space>
        </Space>
        <Space>
          <Button className={styles.btnFap}>
            <Space direction='horizontal'>
              <Typography.Text className={styles.btnText}>Check on FAP</Typography.Text>
              <hr className={styles.hrLine}></hr>
            </Space>
          </Button>
        </Space>
      </Space>
      <ClassDetail />

    </Content>
  );
};

export default ClassDetails;
