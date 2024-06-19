import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import { Card, Col, Input, Layout, Row, Table } from 'antd';
import styles from './AccountStudents.module.less';
import AdminTableHeader from '../../../../components/tableheader/admin/AdminTableHeader';
import { Student } from '../../../../models/student/Student';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';
import { StudentService } from '../../../../hooks/StudentList';
import { CiSearch } from 'react-icons/ci';


const { Header: AntHeader } = Layout;


const AccountStudents: React.FC = () => {
  const [title] = useState('student');
  const [student, setStudent] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(student);  
  // const studentInfo : Student[] | undefined = useSelector((state: RootState) => state.student.studentDetail);
  // console.log("student", studentInfo);

  const columns = [
    {
      key: '1',
      title: 'Student Name',
      dataIndex: 'studentname',
    },
    {
      key: '2',
      title: 'Student Code',
      dataIndex: 'studentcode',
    },
    {
      key: '3',
      title: 'Authenticated',
      dataIndex: 'isAuthenticated',
    },
  ];
  useEffect(() => {
    const response = StudentService.getAllStudent();

    response.then((data) => setStudent(data || []));
  }, []);

  console.log('aaaaa', student);
  const handleSearchStudent = (value: string) => {
    setSearchInput(value);
    const filtered = student.filter(
      (item) =>
        (item.studentName && item.studentName.toLowerCase().includes(value.toLowerCase())) ||
        (item.studentCode && item.studentCode.toLowerCase().includes(value.toLowerCase()))
    );
    setFilteredStudents(filtered);
  };
  return (
    <Content className={styles.accountStudentContent}>
      <PageHeaderAdmin title={title} />
      <Card>
      <Content>
        <AntHeader className={styles.tableHeader}>
          <p className={styles.tableTitle}>Students</p>
          <Row gutter={[16, 16]}>
            <Col>
              <Input
                placeholder="Search by name or role"
                suffix={<CiSearch />}
                variant="filled"
              ></Input>
            </Col>
            {/* <Col>
              <Input
                prefix={<CiCalendar />}
                suffix={<IoMdArrowDropdown />}
                variant="filled"
              ></Input>
            </Col> */}
          </Row>
        </AntHeader>
      </Content>
    </Card>      <Table
        columns={columns}
        dataSource={student.map((item, index) => ({
          key: index,
          studentname: (
            <div>
              <img src={item.image} alt="Student" className={styles.img} />
              <span className={styles.studentName}>{item.studentName}</span>
            </div>
          ),
          studentcode: item.studentCode,
          isAuthenticated: (
            <div>
              <p style={{ color: item.isAuthenticated ? 'green' : 'red' }}>
                {item.isAuthenticated ? 'true' : 'false'}
              </p>
            </div>
          ),
        }))}
        pagination={{
          showSizeChanger: true,
        }}
      ></Table>
    </Content>
  );
};

export default AccountStudents;
