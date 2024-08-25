import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect } from 'react';
import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Table,
  Form,
  Tag,
} from 'antd';
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
import { DashboardService } from '../../../../hooks/Dashboard';

const { Header: AntHeader } = Layout;

const AccountStudents: React.FC = () => {
  const [form] = Form.useForm();

  const response = useSelector(
    (state: RootState) => state.student.studentDetail,
  );
  const [student, setStudent] = useState<Student[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<Student[]>(student);
  const [isUpdate, setIsUpdate] = useState(false);
  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(35);
  const [totalRecords, setTotalRecord] = useState(0);

  const [reload, setReload] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [StudentCode, setStudentCode] = useState('');
  const [DisplayName, setDisplayName] = useState('');
  const [Email, setEmail] = useState('');

  const [errors, setErrors] = useState({
    studentCode: '',
    displayName: '',
    email: '',
  });

  const failMessage = useSelector((state: RootState) => state.student.studentDetail);
  const successMessage = useSelector(
    (state: RootState) => state.student.message,
  );

  const handleRowClick = (studentID: string) => {
    navigate(`/account-admin/student/student-detail`, {
      state: { studentID: studentID },
    });
  };

  console.log('suces', successMessage)

  const handlePagination = async (page: number, pageSize: number) => {
    setCurrentPage(page);
    setPageSize(pageSize);

    const studentList = await StudentService.getStudentByPage(page, pageSize);
    setStudent(studentList || []);
    setFilteredStudents(studentList || []);
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
          <Tag
            color={isAuthenticated ? 'green' : 'red'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </Tag>
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
    const totalStudent = DashboardService.getTotalStudent();
    totalStudent
      .then((data) => setTotalRecord(data.data))
      .catch((err) => console.log('Err when get data'));

    response
      .then((data) => {
        setStudent(data || []);
        setFilteredStudents(data || []);
      })
      .catch((error) => {
        console.log('get student error: ', error);
      });
  }, [reload]);
console.log('sucesss', successMessage)
console.log('fail', failMessage)
  useEffect(() => {
    if (successMessage) {
      if (successMessage === 'Update student successfully' || successMessage === 'Create new student successfully') {
        message.success(successMessage);
      } else {
        message.success(successMessage.title);
      }
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearStudentMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.errors}`);
      dispatch(clearStudentMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const handleSearchStudent = (value: string) => {
    setSearchInput(value);
    const normalizeString = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    const normalizedValue = normalizeString(value).toLowerCase();
    const filtered = student.filter(
      (item) => {
        const normalizedStudentName = item.studentName
        ? normalizeString(item.studentName).toLowerCase()
        : '';
        const normalizedStudentCode = item.studentCode
        ? normalizeString(item.studentCode).toLowerCase()
        : '';
        const normalizedEmail = item.email
        ? normalizeString(item.email).toLowerCase()
        : '';
        const normalizedPhone = item.phoneNumber
        ? normalizeString(item.phoneNumber).toLowerCase()
        : '';

        return (
          normalizedStudentName.includes(normalizedValue) ||
          normalizedStudentCode.includes(normalizedValue) ||
          normalizedEmail.includes(normalizedValue) ||
          normalizedPhone.includes(normalizedValue)
        );
      }
        // (item.studentName &&
        //   item.studentName.toLowerCase().includes(value.toLowerCase())) ||
        // (item.studentCode &&
        //   item.studentCode.toLowerCase().includes(value.toLowerCase())) ||
        // (item.email &&
        //   item.email.toLowerCase().includes(value.toLowerCase())) ||
        // (item.phoneNumber &&
        //   item.phoneNumber.toLowerCase().includes(value.toLowerCase())),
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
    setStudentCode('');
    setDisplayName('');
    setEmail('');
    setErrors({
      studentCode: '',
      displayName: '',
      email: '',
    });
  };

  const validateStudentCode = (code: string) => {
    if (!code) {
      return 'Student Code is required';
    } else if (!/^[A-Za-z]+\d{6}$/.test(code)) {
      return 'Student Code must be in the format: AA123456';
    }
    return '';
  };

  const handleStudentCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value;
    setStudentCode(code);
    const error = validateStudentCode(code);
    setErrors((prevErrors) => ({
      ...prevErrors,
      studentCode: error,
    }));
  };

  const handleCreate = async () => {
    const validationErrors: any = {};

    if (!StudentCode) {
      validationErrors.studentCode = 'Student Code is required';
    } else if (!/^[A-Za-z]+\d{6}$/.test(StudentCode)) {
      validationErrors.studentCode =
        'Student Code must be in the format: AA123456';
    }

    if (!DisplayName) {
      validationErrors.displayName = 'Student Name is required';
    }

    if (!Email) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(Email)) {
      validationErrors.email = 'Email is invalid';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

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
          // current: currentPage,
          // pageSize: pageSize,
          // total: totalRecords,
          // onChange: handlePagination,
        }}
      ></Table>
      <Modal
        title={'Add new student'}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleCreate}
          >
            Submit
          </Button>,
        ]}
      >
        <p className={styles.createStudentTitle}>Student Code</p>
        <Input
          placeholder="Student Code"
          value={StudentCode}
          onChange={handleStudentCodeChange}
          style={{ marginBottom: '10px' }}
        />
        {errors.studentCode && (
          <p className={styles.errorText}>{errors.studentCode}</p>
        )}

        <p className={styles.createStudentTitle}>Student Name</p>
        <Input
          placeholder="Student Name"
          value={DisplayName}
          onChange={(e) => {
            setErrors((prevErrors) => ({ ...prevErrors, displayName: '' }));
            setDisplayName(e.target.value);
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.displayName && (
          <p className={styles.errorText}>{errors.displayName}</p>
        )}

        <p className={styles.createStudentTitle}>Email</p>
        <Input
          placeholder="Email"
          value={Email}
          onChange={(e) => {
            setErrors((prevErrors) => ({ ...prevErrors, email: '' }));
            setEmail(e.target.value);
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.email && <p className={styles.errorText}>{errors.email}</p>}
      </Modal>
    </Content>
  );
};

export default AccountStudents;
