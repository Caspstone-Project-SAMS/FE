import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './AdminClass.module.less';

const AdminClass: React.FC = () => {
  const [title] = useState('class'); 
  return (
    <Content className={styles.classContent}>
      <PageHeaderAdmin title={title} />

      <Row></Row>
    </Content>
  );
};

export default AdminClass;
