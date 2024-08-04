import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Table,
  Form,
  Tag,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './AdminClass.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';

import { CiSearch } from 'react-icons/ci';
import { PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { clearClassMessages, createClass } from '../../../redux/slice/Class';

const { Header: AntHeader } = Layout;

import Excel from '../../../components/excel/Excel';
import '../../../assets/styles/styles.less';
import { CalendarService } from '../../../hooks/Calendar';
import { Semester } from '../../../models/calendar/Semester';
import { RoomService } from '../../../hooks/Room';
import { Room } from '../../../models/room/Room';
import { SubjectService } from '../../../hooks/Subject';
import { Subject } from '../../../models/subject/Subject';
import { EmployeeService } from '../../../hooks/Employee';
import { EmployeeDetail } from '../../../models/employee/Employee';
import { ClassDetails } from '../../../models/Class';
import { ClassService } from '../../../hooks/Class';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/Store';
import { IoMdInformation } from 'react-icons/io';

const AdminClass: React.FC = () => {
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [room, setRoom] = useState<Room[]>([]);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [lecturer, setLecturer] = useState<EmployeeDetail[]>([]);
  const [filteredClass, setFilteredClass] = useState<ClassDetails[]>(classes);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [ClassName, setClassName] = useState('');
  const [ClassCode, setClassCode] = useState('');
  const [SubjectCode, setSubjectCode] = useState('');
  const [SemesterId, setSemesterId] = useState<number | null>(null);
  const [RoomId, setRoomId] = useState<number | null>(null);
  const [SubjectId, setSubjectId] = useState<number | null>(null);
  const [LecturerID, setLecturerID] = useState<string | null>(null);

  // Error state
  const [errors, setErrors] = useState<{
    className?: string;
    semesterId?: string;
    roomId?: string;
    subjectId?: string;
    lecturerId?: string;
  }>({});

  const failMessage = useSelector((state: RootState) => state.class.message);
  const successMessage = useSelector(
    (state: RootState) => state.class.classDetail?.title,
  );

  const handleRowClick = (classID: number) => {
    navigate(`/admin-class/admin-class-detail`, {
      state: { classID: classID },
    });
  };

  useEffect(() => {
    const response = ClassService.getAllClass();

    response
      .then((data) => {
        setClasses(data?.result || []);
      })
      .catch((error) => {
        console.log('get class error: ', error);
      });
  }, [reload]);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearClassMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.title}`);
      dispatch(clearClassMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const handleSearchClass = (value: string) => {
    setSearchInput(value);

    const normalizeString = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };

    const normalizedValue = normalizeString(value).toLowerCase();

    const filtered = classes.filter((item) => {
      const normalizedClassCode = item.classCode
        ? normalizeString(item.classCode).toLowerCase()
        : '';
      const normalizedLecturerName = item.lecturer.displayName
        ? normalizeString(item.lecturer.displayName).toLowerCase()
        : '';
      const normalizedSemesterCode = item.semester.semesterCode
        ? normalizeString(item.semester.semesterCode).toLowerCase()
        : '';

      return (
        normalizedClassCode.includes(normalizedValue) ||
        normalizedLecturerName.includes(normalizedValue) ||
        normalizedSemesterCode.includes(normalizedValue)
      );
    });

    setFilteredClass(filtered);
    setIsUpdate(true);
  };

  const showModalCreate = () => {
    getAllSmester();
    getAllRoom();
    getAllSubject();
    getAllLecturer();
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setClassName('');
    setClassCode('');
    setSubjectCode('');
    setRoomId(null);
    setSemesterId(null);
    setSubjectId(null);
    setLecturerID(null);
    setIsCheck(false);
    setErrors({});
  };

  const validateFields = () => {
    const newErrors: any = {};
    if (!ClassName) newErrors.className = 'Class Name is required';
    if (SemesterId === null) newErrors.semesterId = 'Semester is required';
    if (RoomId === null) newErrors.roomId = 'Room is required';
    if (SubjectId === null) newErrors.subjectId = 'Subject is required';
    if (!LecturerID) newErrors.lecturerId = 'Lecturer is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreate = async () => {
    if (!validateFields()) return;

    setLoading(true);
    await createNewClass(
      ClassCode,
      SemesterId ?? 0,
      RoomId ?? 0,
      SubjectId ?? 0,
      LecturerID ?? '',
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const createNewClass = async (
    ClassCode: string,
    SemesterId: number,
    RoomId: number,
    SubjectId: number,
    LecturerID: string,
  ) => {
    const arg = {
      ClassCode: ClassCode,
      SemesterId: SemesterId,
      RoomId: RoomId,
      SubjectId: SubjectId,
      LecturerID: LecturerID,
    };
    await dispatch(createClass(arg) as any);
    setIsCheck(false);
  };

  const getAllSmester = async () => {
    const response = await CalendarService.getAllSemester();
    setSemester(response || []);
  };

  const getAllRoom = async () => {
    const response = await RoomService.getAllRoom();
    setRoom(response || []);
  };

  const getAllSubject = async () => {
    const response = await SubjectService.getAllSubject();
    setSubject(response || []);
  };

  const getAllLecturer = async () => {
    const response = await EmployeeService.getAllEmployee();
    setLecturer(response?.result || []);
  };

  const columns = [
    {
      key: '1',
      title: 'Class',
      dataIndex: 'classcode',
    },
    {
      key: '2',
      title: 'Semester',
      dataIndex: 'semestercode',
    },
    {
      key: '3',
      title: 'Lecturer',
      dataIndex: 'lecturer',
    },
    {
      key: '4',
      title: 'status',
      dataIndex: 'classStatus',
      render: (classStatus: boolean) => (
        <div>
        <Tag 
          color={classStatus ? 'green' : 'red'} 
          style={{ fontWeight: 'bold', fontSize: '10px' }}
        >
          {classStatus ? 'active' : 'inactive'}
        </Tag>
      </div>
      ),
    },
    {
      key: '5',
      title: 'Info',
      dataIndex: 'info',
      render: (classID: number) => (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(classID);
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
    if (ClassName) {
      // If ClassName exists, construct ClassCode based on ClassName and SubjectCode
      const newClassCode = SubjectCode
        ? `${ClassName}-${SubjectCode}`
        : ClassName;
      setClassCode(newClassCode);
    } else {
      // If ClassName is empty or null, set ClassCode to an empty string
      setClassCode('');
    }
  }, [ClassName, SubjectCode]);

  return (
    <Content className={styles.accountClassContent}>
      <div className="align-center-between">
        <ContentHeader
          contentTitle="Class"
          previousBreadcrumb={'Home / '}
          currentBreadcrumb={'Class'}
          key={''}
        />
        <Excel fileType="class" />
      </div>
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Class</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchClass(e.target.value)}
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
        dataSource={(!isUpdate ? classes : filteredClass).map(
          (item, index) => ({
            key: index,
            classcode: item.classCode,
            semestercode: item.semester.semesterCode,
            lecturer: item.lecturer.displayName,
            classStatus: item.classStatus,
            info: item.classID,
            ID: item.classID,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Class' : 'Add New Class'}
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
        <p
          className={styles.createClassTitle}
          style={{ fontSize: '1rem', margin: '5px 0px 10px' }}
        >
          Class Code: {ClassCode}
        </p>
        <p className={styles.createClassTitle}>Class Name</p>
        <Input
          placeholder="Class Name"
          value={ClassName}
          onChange={(e) => {
            setErrors((prevErrors) => ({ ...prevErrors, className: '' }));
            setClassName(e.target.value)
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.className && <p className={styles.errorText}>{errors.className}</p>}

        <p className={styles.createClassTitle}>Semester Code</p>
        <Select
          placeholder="Semester Code"
          value={SemesterId}
          onChange={(value) => {
            setErrors((prevErrors) => ({ ...prevErrors, semesterId: '' }));
            setSemesterId(value)}}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {semester.map((sem) => (
            <Select.Option key={sem.semesterID} value={sem.semesterID}>
              {sem.semesterCode}
            </Select.Option>
          ))}
        </Select>
        {errors.semesterId && (
          <p className={styles.errorText}>{errors.semesterId}</p>
        )}

        <p className={styles.createClassTitle}>Room Name</p>
        <Select
          placeholder="Room Name"
          value={RoomId}
          onChange={(value) => {
            setErrors((prevErrors) => ({ ...prevErrors, roomId: '' }));
            setRoomId(value)}}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {room.map((room) => (
            <Select.Option key={room.roomID} value={room.roomID}>
              {room.roomName}
            </Select.Option>
          ))}
        </Select>
        {errors.roomId && <p className={styles.errorText}>{errors.roomId}</p>}

        <p className={styles.createClassTitle}>Subject Code</p>
        <Select
          placeholder="Subject Code"
          value={SubjectId}
          onChange={(value) => {
            setSubjectId(value);
            setErrors((prevErrors) => ({ ...prevErrors, subjectId: '' }));
            setSubjectCode(
              subject.find((sub) => sub.subjectID === value)?.subjectCode || '',
            );
          }}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {subject.map((sub) => (
            <Select.Option key={sub.subjectID} value={sub.subjectID}>
              <p>{sub.subjectCode}</p>
            </Select.Option>
          ))}
        </Select>
        {errors.subjectId && <p className={styles.errorText}>{errors.subjectId}</p>}

        <p className={styles.createClassTitle}>Lecturer</p>
        <Select
          placeholder="Lecturer"
          value={LecturerID}
          onChange={(value) => {
            setErrors((prevErrors) => ({ ...prevErrors, lecturerId: '' }));
            setLecturerID(value)}}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {lecturer.map((lec) => (
            <Select.Option key={lec.id} value={lec.id}>
              <p>{lec.displayName}</p>
            </Select.Option>
          ))}
        </Select>
        {errors.lecturerId && (
          <p className={styles.errorText}>{errors.lecturerId}</p>
        )}
      </Modal>
    </Content>
  );
};

export default AdminClass;
