import React, { useCallback, useEffect, useState } from 'react';
import { ClassDetails } from '../../models/Class';
import { Semester } from '../../models/calendar/Semester';
import { Room } from '../../models/room/Room';
import { Subject } from '../../models/subject/Subject';
import { EmployeeDetail } from '../../models/employee/Employee';
import useDispatch from '../../redux/UseDispatch';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ClassService } from '../../hooks/Class';
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
  Tag,
} from 'antd';
import { clearClassMessages, createClass, deleteClass, updateClass } from '../../redux/slice/Class';
import { CalendarService } from '../../hooks/Calendar';
import { RoomService } from '../../hooks/Room';
import { SubjectService } from '../../hooks/Subject';
import { EmployeeService } from '../../hooks/Employee';
import { Content } from 'antd/es/layout/layout';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';
import Excel from '../../components/excel/Excel';
import { CiEdit, CiSearch } from 'react-icons/ci';
import { PlusOutlined } from '@ant-design/icons';
import styles from './Class.module.less';
import { IoMdInformation } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';

const { Header: AntHeader } = Layout;

export default function New() {
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [room, setRoom] = useState<Room[]>([]);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [lecturer, setLecturer] = useState<EmployeeDetail[]>([]);
  const [filteredClass, setFilteredClass] = useState<ClassDetails[]>(classes);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [classID, setClassID] = useState(0);
  // const [CreatedBy, setCreatedBy] = useState('');

  const lectureDetail = useSelector(
    (state: RootState) => state.auth.userDetail?.result,
  );
  const failMessage = useSelector((state: RootState) => state.class.classDetail);
  const successMessage = useSelector(
    (state: RootState) => state.class.message,
  );

  const [errors, setErrors] = useState<{
    className?: string;
    semesterId?: string;
    roomId?: string;
    subjectId?: string;
    lecturerId?: string;
  }>({});
  const handleRowClick = (classID: number) => {
    navigate(`/class/detail`, {
      state: { classID: classID },
    });
  };

  // useEffect(() => {
  //   if (lectureDetail?.id) {
  //     const id = lectureDetail.id;
  //     const response = ClassService.getByClassLecturer(id);

  //     response
  //       .then((data) => {
  //         setClasses(data?.result || []);
  //         // setFilteredRoom(data || []);
  //       })
  //       .catch((error) => {
  //         console.log('get class error: ', error);
  //       });
  //   }
  // }, [reload]);

  const fetchClasses = useCallback(async () => {
    try {
      if (lectureDetail?.id) {
        const id = lectureDetail.id;
        const data = await ClassService.getByClassLecturer(id);
        setClasses(data?.result || []);
      }

    } catch (error) {
      console.log('get class error: ', error);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const handleSearchClass = useCallback(
    (value: string) => {
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
    },
    [classes],
  );

  useEffect(() => {
    if (searchInput !== '' && classes.length > 0) {
      handleSearchClass(searchInput);
    } else if (searchInput === '') {
      setIsUpdate(false);
    }
  }, [classes, searchInput, handleSearchClass]);

  useEffect(() => {
    if (successMessage) {
      if (successMessage === 'Update class successfully' || successMessage === 'Create new class successfully') {
        message.success(successMessage);
      } else {
        message.success(successMessage.title);
      }
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearClassMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.errors}`);
      dispatch(clearClassMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const showModalCreate = () => {
    getAllSmester();
    getAllRoom();
    getAllSubject();
    getAllLecturer();
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const showModalUpdate = (item?: ClassDetails) => {
    setIsCheck(true);
    getAllSmester();
    getAllRoom();
    getAllSubject();
    getAllLecturer();
    if (item) {
      const classCodeParts = item.classCode.split(/[-_]/);
      const classCodePart1 = classCodeParts[0] || '';
      const classCodePart2 = classCodeParts[1] || '';
      setClassID(item.classID);
      setRoomId(item.room.roomID!);
      setSubjectId(item.subject.subjectID!);
      setClassName(classCodePart1);
      // setClassCode(classCodePart2);
      setSubjectCode(classCodePart2);
      setSemesterId(item.semester.semesterID!);
      setLecturerID(item.lecturer.id);
    } else {
      resetModalFields();
    }
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

  const handleUpdate = async () => {
    if (!validateFields()) return;

    setLoading(true);
    await updateExistClass(
      classID ?? 0,
      ClassCode,
      SemesterId ?? 0,
      RoomId ?? 0,
      SubjectId ?? 0,
      // LecturerID ?? '',
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    fetchClasses();
  };
  const handleCreate = async () => {
    console.log('create')
    if (!validateFields()) return;

    setLoading(true);
    await createNewClass(
      ClassCode,
      SemesterId ?? 0,
      RoomId ?? 0,
      SubjectId ?? 0,
      // LecturerID ?? '',
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    fetchClasses();
  };

  const createNewClass = async (
    ClassCode: string,
    SemesterId: number,
    RoomId: number,
    SubjectId: number,
    // LecturerID: string,
    // CreatedBy: string,
  ) => {
    const arg = {
      ClassCode: ClassCode,
      SemesterId: SemesterId,
      RoomId: RoomId,
      SubjectId: SubjectId,
      LecturerID: lectureDetail?.id,
      // CreatedBy: CreatedBy,
    };
    await dispatch(createClass(arg) as any);
    setIsCheck(false);
  };

  const updateExistClass = async (
    ClassID: number,
    ClassCode: string,
    SemesterId: number,
    RoomId: number,
    SubjectId: number,
    // LecturerID: string,
  ) => {
    const arg = {
      ClassID: ClassID,
      ClassCode: ClassCode,
      SemesterId: SemesterId,
      RoomId: RoomId,
      SubjectId: SubjectId,
      LecturerID: lectureDetail?.id,
    };
    await dispatch(updateClass(arg) as any);
    // setIsCheck(false);
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
      title: 'Room',
      dataIndex: 'room',
    },
    {
      key: '4',
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      key: '5',
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
      key: '6',
      title: 'Action',
      dataIndex: 'action',
    },
    {
      key: '7',
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

  const deleteSpecificClass = async (classID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this class?',
      onOk: async () => {
        const arg = { ClassID: classID };
        await dispatch(deleteClass(arg) as any);
        fetchClasses();
      },
    });
  };

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
              {
                lectureDetail?.role.name === 'Admin' && (
                  <Col>
                    <Button
                      onClick={showModalCreate}
                      type="primary"
                      icon={<PlusOutlined />}
                    >
                      Add New
                    </Button>
                  </Col>
                )
              }
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
            room: item.room.roomName,
            subject: item.subject.subjectName,
            classStatus: item.classStatus,
            action: (
              <div>
                <Button
                  shape="circle"
                  style={{ border: 'none', backgroundColor: 'white' }}
                >
                  <CiEdit
                    onClick={() => {
                      setIsCheck(true);
                      showModalUpdate(item);
                    }}
                    size={20}
                    style={{ color: 'blue' }}
                  />
                </Button>

                <Button
                  shape="circle"
                  style={{ border: 'none', backgroundColor: 'white' }}
                  onClick={() => deleteSpecificClass(item.classID!)}
                >
                  <MdDeleteForever size={20} style={{ color: 'red' }} />
                </Button>
              </div>
            ),
            info: item.classID,
            ID: item.classID,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
      // onRow={(record) => ({
      //     onClick: () => handleRowClick(record.ID),
      // })}
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
        <p className={styles.createClassTitle}>Class Code: {ClassCode}</p>
        <p className={styles.createClassTitle}>Class Name</p>
        <Input
          placeholder="Class Name"
          // value={SubjectCode ? `${ClassCode}_${SubjectCode}` : ClassCode}
          value={ClassName}
          onChange={(e) => setClassName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <p className={styles.createClassTitle}>Semester Code</p>
        <Select
          placeholder="Semester Code"
          value={SemesterId}
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
          value={RoomId}
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
          value={SubjectId}
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
        {/* <p className={styles.createClassTitle}>Lecturer</p>
                <Select
                    placeholder="Lecturer"
                    value={LecturerID}
                    onChange={(value) => setLecturerID(value)}
                    style={{ marginBottom: '10px', width: '100%' }}
                >
                    {
                    lecturer.map((lec) => (
                        <Select.Option key={lec.id} value={lec.id}>
                            <p>{lec.displayName}</p>
                        </Select.Option>
                    ))
                    }
                </Select> */}
      </Modal>
    </Content>
  );
}
