import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './AdminAttendance.module.less';

const AdminAttendance: React.FC = () => {
  const [title] = useState('attendance'); 
  return (
    <Content className={styles.attendanceContent}>
      <PageHeaderAdmin title={title} />

      <Row></Row>
    </Content>
  );
};

export default AdminAttendance;
