import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import styles from './AdminClass.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import Excel from '../../../components/excel/Excel';
import '../../../assets/styles/styles.less'

const AdminClass: React.FC = () => {
  const [title] = useState('class');
  return (
    <Content className={styles.classContent}>
      <div className='align-center-between'>
        <ContentHeader
          contentTitle="Class"
          previousBreadcrumb={'Home / '}
          currentBreadcrumb={'Class'}
          key={''}
        />
        <Excel fileType='class' />
      </div>

      <Row></Row>
    </Content>
  );
};

export default AdminClass;
