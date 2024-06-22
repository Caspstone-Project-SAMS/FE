import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './Subject.module.less';

const Subject: React.FC = () => {
  const [title] = useState('subject'); 
  return (
    <Content className={styles.subjectContent}>
      <PageHeaderAdmin title={title} />

      <Row></Row>
    </Content>
  );
};

export default Subject;
