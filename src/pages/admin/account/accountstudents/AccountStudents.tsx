import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Input, Layout, message, Row, Table } from 'antd';
import styles from './AccountStudents.module.less';
import { Student } from '../../../../models/student/Student';
import { StudentService } from '../../../../hooks/StudentList';
import { CiSearch } from 'react-icons/ci';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';
import Excel from '../../../../components/excel/Excel';
import userIcon from '../../../../assets/imgs/users.png';
import '../../../../assets/styles/styles.less';
import { useNavigate } from 'react-router-dom';
import { IoMdInformation } from 'react-icons/io';
import {
  clearStudentMessages,
  createStudent,
} from '../../../../redux/slice/Student';
import { PlusOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const AccountStudents: React.FC = () => {
  const response = useSelector(
    (state: RootState) => state.student.studentDetail,
  );
  const [student, setStudent] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(student);
  const [isUpdate, setIsUpdate] = useState(false);
  const [reload, setReload] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [StudentCode, setStudentCode] = useState('');
  const [DisplayName, setDisplayName] = useState('');
  const [Email, setEmail] = useState('');

  const failMessage = useSelector((state: RootState) => state.student.message);
  const successMessage = useSelector(
    (state: RootState) => state.student.studentDetail?.title,
  );

  const handleRowClick = (studentID: string) => {
    navigate(`/account-admin/student/student-detail`, {
      state: { studentID: studentID },
    });
  };

  const columns = [
    {
      key: '1',
      title: 'Student Name',
      dataIndex: 'studentname',
    },
    {
      key: '2',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: '3',
      title: 'Student Code',
      dataIndex: 'studentcode',
    },
    {
      key: '4',
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      key: '5',
      title: 'Authenticated',
      dataIndex: 'isAuthenticated',
      render: (isAuthenticated: boolean) => (
        <div>
          <p style={{ color: isAuthenticated ? 'green' : 'red' }}>
            {isAuthenticated ? 'true' : 'false'}
          </p>
        </div>
      ),
    },
    {
      key: '6',
      title: 'Info',
      dataIndex: 'info',
      render: (studentID: string) => (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(studentID);
            }}
            shape="circle"
            style={{ border: 'none' }}
          >
            <span>
              <IoMdInformation size={25} />
            </span>
          </Button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const response = StudentService.getAllStudent();

    response
      .then((data) => {
        setStudent(data || []);
        setFilteredStudents(data || []);
      })
      .catch((error) => {
        console.log('get student error: ', error);
      });
  }, []);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearStudentMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.title}`);
      dispatch(clearStudentMessages());
    }
  }, [successMessage, failMessage, dispatch]);

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

  const showModalCreate = () => {
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setIsCheck(false);
  };

  const handleCreate = async () => {
    setLoading(true);
    await createNewStudent(StudentCode, DisplayName, Email);
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const createNewStudent = async (
    StudentCode: string,
    DisplayName: string,
    Email: string,
  ) => {
    const arg = {
      StudentCode: StudentCode,
      DisplayName: DisplayName,
      Email: Email,
    };
    await dispatch(createStudent(arg) as any);
    setIsCheck(false);
  };

  return (
    <Content className={styles.accountStudentContent}>
      <div className="align-center-between">
        <ContentHeader
          contentTitle="Student"
          previousBreadcrumb={'Home / Account / '}
          currentBreadcrumb={'Student'}
          key={''}
        />
        {/* <Button size='large' style={{ marginRight: "10px" }}
            icon={<DownloadOutlined />}
            onClick={() => {
            }}
          >Download Template</Button> */}
        <Excel fileType="student" />
      </div>
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
              <Col>
                <Button
                  onClick={showModalCreate}
                  type="primary"
                  icon={<PlusOutlined />}
                >
                  Add New
                </Button>
              </Col>
            </Row>
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={(!isUpdate ? student : filteredStudents)
          .sort((a, b) => {
            const aAuth = a.isAuthenticated ? 1 : 0;
            const bAuth = b.isAuthenticated ? 1 : 0;
            return aAuth - bAuth;
          })
          .map((item, index) => ({
            key: index,
            studentname: (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img
                  src={item.avatar || userIcon}
                  alt="Student"
                  className={styles.img}
                />
                <p className={styles.studentName}>{item.studentName}</p>
              </div>
            ),
            email: item.email,
            studentcode: item.studentCode,
            phone: item.phoneNumber,
            isAuthenticated: item.isAuthenticated,
            info: item.studentID,
            ID: item.studentID,
          }))}
        pagination={{
          showSizeChanger: true,
        }}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record.ID, record.isAuthenticated),
        // })}
      ></Table>
    </Content>
  );
};

export default AccountStudents;
