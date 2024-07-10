import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
// import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './AdminClass.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';

const AdminClass: React.FC = () => {
  const [title] = useState('class');
  return (
    <Content className={styles.classContent}>
      <ContentHeader
        contentTitle="Class"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Class'}
        key={''}
      />

      <Row></Row>
    </Content>
  );
};

export default AdminClass;
