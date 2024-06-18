import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import { Row } from 'antd';
import styles from './AccountStudents.module.less';
import AdminTableHeader from '../../../../components/tableheader/admin/AdminTableHeader';
import { Student } from '../../../../models/student/Student';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';

const AccountStudents: React.FC = () => {
  const [title] = useState('student');
  const studentInfo : Student[] | undefined = useSelector((state: RootState) => state.student.studentDetail);
  console.log("student", studentInfo);

  return (
    <Content className={styles.accountStudentContent}>
      <PageHeaderAdmin title={title} />
      <AdminTableHeader />
      <Row></Row>
    </Content>
  );
};

export default AccountStudents;
