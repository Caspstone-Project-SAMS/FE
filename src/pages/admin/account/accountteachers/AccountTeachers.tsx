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
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useCallback, useEffect, useState } from 'react';
// import PageHeaderAdmin from '../../../../components/header/headeradmin/PageHeader';
import styles from './AccountTeachers.module.less';
import ContentHeader from '../../../../components/header/contentHeader/ContentHeader';
import { Employee, EmployeeDetail } from '../../../../models/employee/Employee';
import { useNavigate } from 'react-router-dom';
import { EmployeeService } from '../../../../hooks/Employee';
import { IoMdInformation } from 'react-icons/io';
import userIcon from '../../../../assets/imgs/users.png';
import { CiEdit, CiSearch } from 'react-icons/ci';
import { MdDeleteForever } from 'react-icons/md';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../../redux/Store';
import {
  clearLecturerMessages,
  createLecturer,
} from '../../../../redux/slice/Lecturer';

const { Header: AntHeader } = Layout;

const AccountTeachers: React.FC = () => {
  const [lecturer, setLecturer] = useState<EmployeeDetail[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredLecturers, setFilteredLecturers] =
    useState<EmployeeDetail[]>(lecturer);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [UserName, setUserName] = useState('');
  const [Email, setEmail] = useState('');
  const [DisplayName, setDisplayName] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const failMessage = useSelector((state: RootState) => state.Lecturer.lecturerDetail);
  const successMessage = useSelector(
    (state: RootState) => state.Lecturer.message,
  );
console.log('fail', failMessage)
  useEffect(() => {
    if (successMessage) {
      if (successMessage.title) {
        message.success(successMessage.title);
      } else {
        message.success(successMessage);
      }

      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearLecturerMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.errors}`);
      dispatch(clearLecturerMessages());
    }
  }, [successMessage, failMessage, dispatch]);
  const handleRowClick = (lecturerID: string) => {
    navigate(`/teacher/teacher-detail`, {
      state: { lecturerID: lecturerID },
    });
  };

  const columns = [
    {
      key: '1',
      title: 'Lecturer Name',
      dataIndex: 'lecturername',
    },
    {
      key: '2',
      title: 'Email',
      dataIndex: 'email',
    },
    // {
    //   key: '3',
    //   title: 'Department',
    //   dataIndex: 'department',
    // },
    // {
    //   key: '4',
    //   title: 'Birthday',
    //   dataIndex: 'birthday',
    // },
    {
      key: '3',
      title: 'Phone',
      dataIndex: 'phone',
    },
    // {
    //   key: '4',
    //   title: 'Action',
    //   dataIndex: 'action',
    // },
    {
      key: '4',
      title: 'Info',
      dataIndex: 'info',
      render: (lecturerID: string) => (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(lecturerID);
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

  const handleSearchLecturer = useCallback(
    (value: string) => {
      setSearchInput(value);
      const normalizeString = (str: string) => {
        return str
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/\s+/g, ' ')
          .trim();
      };
      const normalizedValue = normalizeString(value).toLowerCase();
      const filtered = lecturer.filter(
        (item) => {
          const normalizedTeacherName = item.displayName
            ? normalizeString(item.displayName).toLowerCase()
            : '';
          const normalizedDepartment = item.department
            ? normalizeString(item.department).toLowerCase()
            : '';
          const normalizedEmail = item.email
            ? normalizeString(item.email).toLowerCase()
            : '';
          const normalizedPhone = item.phoneNumber
            ? normalizeString(item.phoneNumber).toLowerCase()
            : '';

          return (
            normalizedTeacherName.includes(normalizedValue) ||
            normalizedDepartment.includes(normalizedValue) ||
            normalizedEmail.includes(normalizedValue) ||
            normalizedPhone.includes(normalizedValue)
          );
        },
        // (item.displayName &&
        //   item.displayName.toLowerCase().includes(value.toLowerCase())) ||
        // (item.email &&
        //   item.email.toLowerCase().includes(value.toLowerCase())) ||
        // (item.department &&
        //   item.department.toLowerCase().includes(value.toLowerCase())) ||
        // (item.phoneNumber &&
        //   item.phoneNumber.toLowerCase().includes(value.toLowerCase())),
      );
      setFilteredLecturers(filtered);
      setIsUpdate(true);
    },
    [lecturer],
  );

  const fetchLecturers = useCallback(async () => {
    try {
      const data = await EmployeeService.getAllEmployee();
      setLecturer(data?.result || []);
    } catch (error) {
      console.log('get lecturer error: ', error);
    }
  }, []);

  useEffect(() => {
    fetchLecturers();
  }, [fetchLecturers]);

  useEffect(() => {
    if (searchInput !== '' && lecturer.length > 0) {
      handleSearchLecturer(searchInput);
    } else if (searchInput === '') {
      setIsUpdate(false);
    }
  }, [lecturer, searchInput, handleSearchLecturer]);

  const showModalCreate = () => {
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const showModalUpdate = (item?: EmployeeDetail) => {

  }

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setUserName('');
    setEmail('');
    setDisplayName('');
    setIsCheck(false);
    setErrors({});
  };

  const handleCreate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    await createNewLecturer(UserName, Email, DisplayName);
    setLoading(false);
    // setIsModalVisible(false);
    // resetModalFields();
    fetchLecturers();
  };

  const handleUpdate = async () => {
    
  }

  const createNewLecturer = async (
    UserName: string,
    Email: string,
    DisplayName: string,
  ) => {
    const arg = {
      UserName: UserName,
      Email: Email,
      DisplayName: DisplayName,
    };

    await dispatch(createLecturer(arg) as any);
    setIsCheck(false);
  };

  const deleteSpecificLecturer = async (lecturerID: string) => {

  }

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!UserName.trim()) {
      newErrors.UserName = 'User Name is required';
    }
    if (!Email.trim()) {
      newErrors.Email = 'Email is required';
    }
    if (!DisplayName.trim()) {
      newErrors.DisplayName = 'Display Name is required';
    }
    // if (!isCheck && !CreateBy.trim()) {
    //   newErrors.CreateBy = 'Created By is required';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <Content className={styles.accountTeacherContent}>
      <ContentHeader
        contentTitle="Teacher"
        previousBreadcrumb={'Home / Account / '}
        currentBreadcrumb={'Teacher'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Teachers</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name or code"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchLecturer(e.target.value)}
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
        dataSource={(!isUpdate ? lecturer : filteredLecturers).map(
          (item, index) => ({
            key: index,
            lecturername: (
              <div style={{ display: 'flex', flexDirection: 'row' }}>
                <img
                  src={item.avatar || userIcon}
                  alt="Teacher"
                  className={styles.img}
                />
                <p className={styles.lecturerName}>
                  {item.displayName || 'N/A'}
                </p>
              </div>
            ),
            email: item.email || 'N/A',
            // department: item.department || 'N/A',
            phone: item.phoneNumber || 'N/A',
            // action: (
            //   <div>
            //     <Button
            //       shape="circle"
            //       style={{ border: 'none', backgroundColor: 'white' }}
            //     >
            //       <CiEdit
            //         onClick={() => {
            //           setIsCheck(true);
            //           showModalUpdate(item);
            //         }}
            //         size={20}
            //         style={{ color: 'blue' }}
            //       />
            //     </Button>

            //     <Button
            //       shape="circle"
            //       style={{ border: 'none', backgroundColor: 'white' }}
            //       onClick={() => deleteSpecificLecturer(item.employeeID!)}
            //     >
            //       <MdDeleteForever size={20} style={{ color: 'red' }} />
            //     </Button>
            //   </div>
            // ),
            info: item.employeeID,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
        // onRow={(record) => ({
        //   onClick: () => handleRowClick(record.slotID),
        // })}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Lecturer' : 'Add New Lecturer'}
        visible={isModalVisible}
        // onOk={isCheck ? handleUpdate : handleCreate}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={isCheck ? handleUpdate : handleCreate}
            // disabled={!isFormValid()}
          >
            Submit
          </Button>,
        ]}
      >
        <p className={styles.createLecturerTitle}>Lecturer Name </p>
        <Input
          placeholder="Lecturer Name"
          value={UserName}
          onChange={(e) => {
            setUserName(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, UserName: '' }));
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.UserName && (
          <p className={styles.errorText}>{errors.UserName}</p>
        )}
        <p className={styles.createLecturerTitle}>Email</p>
        <Input
          placeholder="Email"
          value={Email}
          onChange={(e) => {
            setEmail(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, Email: '' }));
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.Email && <p className={styles.errorText}>{errors.Email}</p>}
        <p className={styles.createLecturerTitle}>Display Name</p>
        <Input
          placeholder="Display Name"
          value={DisplayName}
          onChange={(e) => {
            setDisplayName(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, DisplayName: '' }));
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.DisplayName && <p className={styles.errorText}>{errors.DisplayName}</p>}
      </Modal>
    </Content>
  );
};

export default AccountTeachers;
