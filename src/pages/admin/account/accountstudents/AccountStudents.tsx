import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import { Button, Card, Col, Input, Layout, Row, Table } from 'antd';
import styles from './AccountStudents.module.less';
import { Student } from '../../../../models/student/Student';
import { StudentService } from '../../../../hooks/StudentList';
import { CiSearch } from 'react-icons/ci';
import { FaFingerprint } from 'react-icons/fa';

const { Header: AntHeader } = Layout;

const AccountStudents: React.FC = () => {
  const [title] = useState('student');
  const [student, setStudent] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(student);
  const [isUpdate, setIsUpdate] = useState(false);
  // const studentInfo : Student[] | undefined = useSelector((state: RootState) => state.student.studentDetail);
  console.log('student', filteredStudents);

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
    {
      key: '4',
      title: 'Register',
      dataIndex: 'register',
    },
  ];
  useEffect(() => {
    const response = StudentService.getAllStudent();

    response
      .then((data) => {
        setStudent(data || []);
        // setFilteredStudents(data || []);
      })
      .catch((error) => {
        console.log('get student error: ', error);
      });
  }, []);

  console.log('aaaaa', student);
  const handleSearchStudent = (value: string) => {
    setSearchInput(value);
    const filtered = student.filter(
      (item) =>
        (item.studentName &&
          item.studentName.toLowerCase().includes(value.toLowerCase())) ||
        (item.studentCode &&
          item.studentCode.toLowerCase().includes(value.toLowerCase())),
    );
    setFilteredStudents(filtered);
    setIsUpdate(true);
  };
  return (
    <Content className={styles.accountStudentContent}>
      <PageHeaderAdmin title={title} />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Students</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name or code"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchStudent(e.target.value)}
                ></Input>
              </Col>
            </Row>
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={(!isUpdate ? student : filteredStudents).map(
          (item, index) => ({
            key: index,
            studentname: (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img src={item.image} alt="Student" className={styles.img} />
                <p className={styles.studentName}>{item.studentName}</p>
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
            register: (
              <div>
                {item.isAuthenticated ? (
                  <Button
                    shape="circle"
                    style={{ border: 'none', backgroundColor: 'white' }}
                    disabled
                  >
                    <FaFingerprint size={20} />
                  </Button>
                ) : (
                  <Button shape="circle" style={{ border: 'none' }}>
                    <FaFingerprint size={20} />
                  </Button>
                )}
                {/* <FaFingerprint style={{color: item.isAuthenticated ? 'green' : 'red'}}/> */}
              </div>
            ),
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
      ></Table>
    </Content>
  );
};

export default AccountStudents;
