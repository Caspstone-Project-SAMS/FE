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
  Tooltip,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useCallback, useEffect, useState } from 'react';
import styles from './AdminClass.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';

import { CiEdit, CiSearch } from 'react-icons/ci';
import { InfoCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import {
  clearClassMessages,
  createClass,
  deleteClass,
  updateClass,
} from '../../../redux/slice/Class';

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
import { ClassDetails, SlotType } from '../../../models/Class';
import { ClassService } from '../../../hooks/Class';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../../redux/Store';
import { IoMdInformation } from 'react-icons/io';
import { MdDeleteForever } from 'react-icons/md';
import { SlotTypeDetail, SlotTypes } from '../../../models/slot/Slot';
import { SlotService } from '../../../hooks/Slot';
import { SemesterService } from '../../../hooks/Semester';

const AdminClass: React.FC = () => {
  const [classes, setClasses] = useState<ClassDetails[]>([]);
  const [classSemester, setClassSemester] = useState<Semester[]>([]);
  const [semester, setSemester] = useState<Semester[]>([]);
  const [room, setRoom] = useState<Room[]>([]);
  const [subject, setSubject] = useState<Subject[]>([]);
  const [lecturer, setLecturer] = useState<EmployeeDetail[]>([]);
  const [slotType, setSlotType] = useState<SlotTypeDetail[]>([]);
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
  const [TypeName, setTypeName] = useState('');
  const [SemesterId, setSemesterId] = useState<number | null>(null);
  const [RoomId, setRoomId] = useState<number | null>(null);
  const [SubjectId, setSubjectId] = useState<number | null>(null);
  const [LecturerID, setLecturerID] = useState<string | null>(null);
  const [SlotTypeId, setSlotTypeId] = useState<number | null>(null);
  const [classID, setClassID] = useState(0);

  const [filteredSemesterIds, setFilteredSemesterIds] = useState<number[]>([]);

  // Error state
  const [errors, setErrors] = useState<{
    className?: string;
    semesterId?: string;
    roomId?: string;
    subjectId?: string;
    lecturerId?: string;
    slotTypeId?: string;
  }>({});

  const failMessage = useSelector(
    (state: RootState) => state.class.classDetail,
  );
  const successMessage = useSelector((state: RootState) => state.class.message);

  const handleRowClick = (classID: number) => {
    navigate(`/admin-class/admin-class-detail`, {
      state: { classID: classID },
    });
  };

  // const handleFilterSemester = useCallback( async (value: number | null | undefined) => {
  //   let classes1 = (await ClassService.getAllClass(value))?.result || [];
  //   if (value !== null && value !== undefined) {
  //     classes1 = classes1.filter((item) => item.semester.semesterID === value);
  //   }
  //   setFilteredClass(classes1);
  //   setIsUpdate(true);
  // },[]);

  const handleSearchClass = useCallback(
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

  // useEffect(() => {
  //   const response = ClassService.getAllClass();

  //   response
  //     .then((data) => {
  //       setClasses(data?.result || []);
  //     })
  //     .catch((error) => {
  //       console.log('get class error: ', error);
  //     });
  // }, [reload]);

  const fetchClasses = useCallback(async () => {
    try {
      const dataSemester = await CalendarService.getAllSemester();
      // dataSemester?.push({ semesterID: null, semesterCode: 'All', semesterStatus: -1, startDate: '', endDate: '' });
      setClassSemester(dataSemester || []);
      const currenSemester = dataSemester?.find(
        (se) => se.semesterStatus === 2,
      );
      const data = await ClassService.getAllClass(null);
      setClasses(data?.result || []);
      setFilteredSemesterIds(
        (dataSemester || [])
          .filter((sem) => sem.semesterStatus === 2)
          .map((sem) => sem.semesterID)
          .filter((id): id is number => id !== null),
      );
    } catch (error) {
      console.log('get class error: ', error);
    }
  }, []);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (searchInput !== '' && classes.length > 0) {
      handleSearchClass(searchInput);
    } else if (searchInput === '') {
      setIsUpdate(false);
    }
  }, [classes, searchInput, handleSearchClass]);

  useEffect(() => {
    if (successMessage) {
      if (successMessage.title) {
        message.success(successMessage.title);
      } else if (successMessage) {
        message.success(successMessage);
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
    getAllSlotType();
    getAllSmesterCreate();
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
    setTypeName('');
    setRoomId(null);
    setSemesterId(null);
    setSubjectId(null);
    setLecturerID(null);
    setSlotTypeId(null);
    setIsCheck(false);
    setErrors({});
  };

  const validateFields = () => {
    const newErrors: any = {};
    if (!ClassName) newErrors.className = 'Class Name is required';
    if (SemesterId === null) newErrors.semesterId = 'Semester is required';
    if (RoomId === null) newErrors.roomId = 'Room is required';
    if (SubjectId === null) newErrors.subjectId = 'Subject is required';
    if (SlotTypeId === null && !isCheck)
      newErrors.slotTypeId = 'Slot Type is required';
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
      SlotTypeId ?? 0,
    );
    setLoading(false);
    // setIsModalVisible(false);
    // resetModalFields();
    handleSemesterFilterChange(filteredSemesterIds);
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
      LecturerID ?? '',
    );
    setLoading(false);
    // setIsModalVisible(false);
    // resetModalFields();
    handleSemesterFilterChange(filteredSemesterIds);
  };

  const createNewClass = async (
    ClassCode: string,
    SemesterId: number,
    RoomId: number,
    SubjectId: number,
    LecturerID: string,
    SlotTypeId: number,
  ) => {
    const arg = {
      ClassCode: ClassCode,
      SemesterId: SemesterId,
      RoomId: RoomId,
      SubjectId: SubjectId,
      LecturerID: LecturerID,
      SlotTypeId: SlotTypeId,
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
    LecturerID: string,
  ) => {
    const arg = {
      ClassID: ClassID,
      ClassCode: ClassCode,
      SemesterId: SemesterId,
      RoomId: RoomId,
      SubjectId: SubjectId,
      LecturerID: LecturerID,
    };
    await dispatch(updateClass(arg) as any);
    // setIsCheck(false);
  };

  const getAllSmester = async () => {
    const response = await CalendarService.getAllSemester();
    setSemester(response || []);
  };

  const getAllSmesterCreate = async () => {
    const response = await CalendarService.getAllSemester();
    setSemester(response || []);
    response?.forEach((item) => {
      if (item.semesterStatus === 2) {
        setSemesterId(item.semesterID);
      }
    });
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

  const getAllSlotType = async () => {
    const response = await SlotService.getAllSlotType();
    setSlotType(response?.result || []);
  };

  const handleSemesterFilterChange = async (
    filteredSemesterIds: number[] | undefined | null,
  ) => {
    const newData =
      filteredSemesterIds?.flat().filter((id) => id !== null) || [];
    const data = await ClassService.getAllClass(null);
    setClasses(data?.result || []);
    setFilteredSemesterIds(newData || []);
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
      filters: classSemester.map((sem) => ({
        text: (
          <span
            style={{
              color:
                sem.semesterStatus === 1
                  ? 'gray'
                  : sem.semesterStatus === 2
                    ? 'blue'
                    : sem.semesterStatus === 3
                      ? 'green'
                      : 'black',
            }}
          >
            {sem.semesterCode}{' '}
            {sem.semesterStatus === 1
              ? '(Not yet)'
              : sem.semesterStatus === 2
                ? '(On-going)'
                : sem.semesterStatus === 3
                  ? '(Finished)'
                  : 'N/A'}
          </span>
        ),
        value: sem.semesterID,
      })),
      onFilter: (value: any, record: any) => {
        // console.log('Filtering with value:', value);
        // console.log('Current filteredSemesterIds:', filteredSemesterIds);
        return record.semester.semesterID === value;
      },
      filteredValue: filteredSemesterIds ? filteredSemesterIds : null,
    },
    // {
    //   key: '2',
    //   title: 'Semester',
    //   dataIndex: 'semestercode',
    //   filters: [
    //     { text: 'Not yet', value: 1 },
    //     { text: 'On going', value: 2 },
    //     { text: 'Finished', value: 3 },
    //   ],
    //   onFilter: (value: any, record: any) => record.semesterStatus === value,
    // },
    {
      key: '3',
      title: 'Room',
      dataIndex: 'room',
    },
    {
      key: '4',
      title: 'Email',
      dataIndex: 'email',
    },
    {
      key: '5',
      title: 'Subject',
      dataIndex: 'subject',
    },
    {
      key: '6',
      title: 'Slot Type',
      dataIndex: 'slotType',
    },
    {
      key: '7',
      title: 'Status',
      dataIndex: 'classStatus',
      render: (classStatus: number) => (
        <div>
          <Tag
            color={classStatus === 1 ? 'green' : classStatus === 2 ? 'red' : 'gray'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {classStatus === 1 ? 'Available' : classStatus === 2 ? 'Unavailable' : 'N/A'}
          </Tag>
        </div>
      ),
    },
    {
      key: '8',
      title: 'Action',
      dataIndex: 'action',
    },
    {
      key: '9',
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
            </Row>
          </AntHeader>
        </Content>
      </Card>
      <Table
        columns={columns}
        dataSource={(!isUpdate ? classes : filteredClass).map(
          (item, index) => ({
            key: index,
            classcode: item.classCode || 'N/A',
            semestercode: item.semester.semesterCode || 'N/A',
            semester: item.semester,
            room: item.room.roomName || 'N/A',
            email: item.lecturer.email || 'N/A',
            subject: item.subject.subjectName || 'N/A',
            slotType: (
              <div>{item.slotType.sessionCount * 45 + ' minutes' || 'N/A'}</div>
            ),
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
        onChange={(pagination, filters) => {
          handleSemesterFilterChange(
            Object.values(filters) as unknown as number[] | undefined | null,
          );
        }}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Class' : 'Add New Class'}
        open={isModalVisible}
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
            setClassName(e.target.value);
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.className && (
          <p className={styles.errorText}>{errors.className}</p>
        )}

        <p className={styles.createClassTitle}>Semester Code</p>
        <Select
          placeholder="Semester Code"
          value={SemesterId}
          onChange={(value) => {
            setErrors((prevErrors) => ({ ...prevErrors, semesterId: '' }));
            setSemesterId(value);
          }}
          showSearch
          style={{ marginBottom: '10px', width: '100%' }}
          filterOption={(input, option) => {
            const children = option?.children as unknown as string;
            return children.toLowerCase().includes(input.toLowerCase());
          }}
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
            setRoomId(value);
          }}
          showSearch
          style={{ marginBottom: '10px', width: '100%' }}
          filterOption={(input, option) => {
            const children = option?.children as unknown as string;
            return children.toLowerCase().includes(input.toLowerCase());
          }}
        >
          {room.map((room) => (
            <Select.Option key={room.roomID} value={room.roomID}>
              {'Room ' + room.roomName}
            </Select.Option>
          ))}
        </Select>
        {errors.roomId && <p className={styles.errorText}>{errors.roomId}</p>}

        <p className={styles.createClassTitle}>Subject Code</p>
        <Select
          placeholder="Subject Code"
          value={SubjectId}
          showSearch
          onChange={(value) => {
            setSubjectId(value);
            setErrors((prevErrors) => ({ ...prevErrors, subjectId: '' }));
            setSubjectCode(
              subject.find((sub) => sub.subjectID === value)?.subjectCode || '',
            );
          }}
          style={{ marginBottom: '10px', width: '100%' }}
          filterOption={(input, option: any) =>
            option.children.toLowerCase().includes(input.toLowerCase()) ||
            String(option.value).toLowerCase().includes(input.toLowerCase())
          }
        >
          {subject.map((sub) => (
            <Select.Option key={sub.subjectID} value={sub.subjectID}>
              {sub.subjectCode}
            </Select.Option>
          ))}
        </Select>
        {errors.subjectId && (
          <p className={styles.errorText}>{errors.subjectId}</p>
        )}
        {!isCheck && (
          <>
            <p className={styles.createClassTitle}>
              Slot Type{' '}
              <Tooltip title="Duration of schedules of class">
                <Button
                  type="link"
                  icon={<InfoCircleOutlined />}
                  size="small"
                  style={{ padding: 0, fontSize: '14px' }}
                />
              </Tooltip>
            </p>
            <Select
              placeholder="Slot Type"
              value={SlotTypeId}
              onChange={(value) => {
                setSlotTypeId(value);
                setErrors((prevErrors) => ({ ...prevErrors, slotTypeId: '' }));
                setTypeName(
                  slotType.find((slot) => slot.slotTypeID === value)
                    ?.typeName || '',
                );
              }}
              style={{ marginBottom: '10px', width: '100%' }}
            >
              {slotType.map((slot) => (
                <Select.Option key={slot.slotTypeID} value={slot.slotTypeID}>
                  <p>
                    {slot.typeName + ' (' + slot.sessionCount * 45 + ' min)'}
                  </p>
                </Select.Option>
              ))}
            </Select>
            {errors.slotTypeId && (
              <p className={styles.errorText}>{errors.slotTypeId}</p>
            )}
          </>
        )}
        <p className={styles.createClassTitle}>Lecturer</p>
        <Select
          placeholder="Lecturer"
          value={LecturerID}
          onChange={(value) => {
            setErrors((prevErrors) => ({ ...prevErrors, lecturerId: '' }));
            setLecturerID(value);
          }}
          showSearch
          style={{ marginBottom: '10px', width: '100%' }}
          filterOption={(input, option) => {
            const children = option?.children as unknown as string;
            const normalizeString = (str: string) => {
              return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            };

            const normalizedChildren = normalizeString(children).toLowerCase();
            const normalizedInput = normalizeString(input).toLowerCase();
            return normalizedChildren.includes(normalizedInput);
          }}
        >
          {lecturer.map((lec) => (
            <Select.Option key={lec.id} value={lec.id}>
              {lec.displayName + ' - ' + lec.email}
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
