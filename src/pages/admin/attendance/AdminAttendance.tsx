import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
// import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './AdminAttendance.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';

const AdminAttendance: React.FC = () => {
  // const [title] = useState('attendance');
  return (
    <Content className={styles.attendanceContent}>
      <ContentHeader
        contentTitle="Attendance"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Attendance'}
        key={''}
      />

      <Row></Row>
    </Content>
  );
};

export default AdminAttendance;
