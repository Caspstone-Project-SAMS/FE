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
  const [SemesterId, setSemesterId] = useState(0);
  const [RoomId, setRoomId] = useState(0);
  const [SubjectId, setSubjectId] = useState(0);
  const [LecturerID, setLecturerID] = useState('');
  // const [CreatedBy, setCreatedBy] = useState('');

  const failMessage = useSelector((state: RootState) => state.class.message);
  const successMessage = useSelector(
    (state: RootState) => state.class.classDetail?.title,
  );

  console.log('ssdsdc', successMessage)

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
        // setFilteredRoom(data || []);
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
    setRoomId(0);
    setSemesterId(0);
    setSubjectId(0);
    setLecturerID('');
    setIsCheck(false);
  };

  const handleUpdate = async () => {};

  const handleCreate = async () => {
    setLoading(true);
    await createNewClass(
      ClassCode,
      SemesterId,
      RoomId,
      SubjectId,
      LecturerID,
      // CreatedBy,
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
    // CreatedBy: string,
  ) => {
    const arg = {
      ClassCode: ClassCode,
      SemesterId: SemesterId,
      RoomId: RoomId,
      SubjectId: SubjectId,
      LecturerID: LecturerID,
      // CreatedBy: CreatedBy,
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
          <p style={{ color: classStatus ? 'green' : 'red' }}>
            {classStatus ? 'true' : 'false'}
          </p>
        </div>
      ),
    },
  ];

  useEffect(() => {
    setClassCode(ClassName + '_' + SubjectCode);
  }, [ClassName, SubjectCode])

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
            ID: item.classID,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
        onRow={(record) => ({
          onClick: () => handleRowClick(record.ID),
        })}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Class' : 'Add New Class'}
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
        <p className={styles.createClassTitle}>Class Code</p>
        <Input
          placeholder="Class Code"
          // value={SubjectCode ? `${ClassCode}_${SubjectCode}` : ClassCode}
          value={ClassCode}
          onChange={(e) => setClassName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <p className={styles.createClassTitle}>Semester Code</p>
        <Select
          placeholder="Semester Code"
          // value={SemesterId}
          onChange={(value) => setSemesterId(value)}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {semester.map((sem) => (
            <Select.Option key={sem.semesterID} value={sem.semesterID}>
              {sem.semesterCode}
            </Select.Option>
          ))}
        </Select>
        <p className={styles.createClassTitle}>Room Name</p>
        <Select
          placeholder="Room Name"
          // value={RoomId}
          onChange={(value) => setRoomId(value)}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {room.map((room) => (
            <Select.Option key={room.roomID} value={room.roomID}>
              {room.roomName}
            </Select.Option>
          ))}
        </Select>
        <p className={styles.createClassTitle}>Subject Code</p>
        <Select
          placeholder="Subject Code"
          // value={SubjectId}
          onChange={(value) => {
            setSubjectId(value);
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
        <p className={styles.createClassTitle}>Lecturer</p>
        <Select
          placeholder="Lecturer"
          // value={LecturerID}
          onChange={(value) => setLecturerID(value)}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {lecturer.map((lec) => (
            <Select.Option key={lec.id} value={lec.id}>
              {/* <img alt='lecturer' src={lec.avatar}/> */}
              <p>{lec.displayName}</p>
            </Select.Option>
          ))}
        </Select>
        {/* {!isCheck && (
          <>
            <p className={styles.createClassTitle}>Create By</p>
            <Input
              placeholder="Create By"
              value={CreateBy}
              onChange={(e) => setCreateBy(e.target.value)}
            />
          </>
        )} */}
      </Modal>
      {/* {lecturer.map((lec, index) => (
        <p key={index}>{lec.id}</p>
      ))} */}
    </Content>
  );
};

export default AdminClass;
