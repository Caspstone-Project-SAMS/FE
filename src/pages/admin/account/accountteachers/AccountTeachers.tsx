import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import styles from './AccountTeachers.module.less';

const AccountTeachers: React.FC = () => {
  const [title] = useState('teacher'); 
  return (
    <Content className={styles.accountTeacherContent}>
      <PageHeaderAdmin title={title} />

      <Row></Row>
    </Content>
  );
};

export default AccountTeachers;
