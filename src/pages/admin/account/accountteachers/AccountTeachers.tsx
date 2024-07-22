import { Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React from 'react';
// import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import styles from './AccountTeachers.module.less';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';

const AccountTeachers: React.FC = () => {
  // const [title] = useState('teacher');
  return (
    <Content className={styles.accountTeacherContent}>
      <ContentHeader
        contentTitle="Teacher"
        previousBreadcrumb={'Home / Account / '}
        currentBreadcrumb={'Teacher'}
        key={''}
      />

      <Row></Row>
    </Content>
  );
};

export default AccountTeachers;
