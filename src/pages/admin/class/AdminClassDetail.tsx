import {
  Button,
  Card,
  Checkbox,
  Col,
  Divider,
  Input,
  Layout,
  message,
  Modal,
  Row,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './AdminClass.module.less';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { CiEdit, CiSearch } from 'react-icons/ci';
import {
  ClassDetail,
  Schedule,
  Student as Students,
} from '../../../models/Class';
import { ClassService } from '../../../hooks/Class';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import { StudentService } from '../../../hooks/StudentList';
import { Student } from '../../../models/student/Student';
import type { Slot } from '../../../models/slot/Slot';
import type { Room } from '../../../models/room/Room';
import {
  addScheduleToClasses,
  addStudentToClasses,
  clearStudentMessages,
  deleteScheduleOfClasses,
  deleteStudentOfClasses,
} from '../../../redux/slice/Student';
import { SlotService } from '../../../hooks/Slot';
import moment from 'moment';
import { RoomService } from '../../../hooks/Room';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { MdDeleteForever } from 'react-icons/md';
import { updateScheduleOfClasses } from '../../../redux/slice/Student';
import { CalendarService } from '../../../hooks/Calendar';
import { FcDeleteDatabase } from 'react-icons/fc';
import { Box } from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import ColorShowcase from '../../../components/color/ColorShowcase';
import { IoMdInformation } from 'react-icons/io';
import dayjs from 'dayjs';
import { IoPersonSharp } from 'react-icons/io5';

const { Header: AntHeader } = Layout;

interface Attendance {
  attended: number;
}

const AdminClassDetail: React.FC = () => {
  const location = useLocation();
  const [semesterId, setSemesterId] = useState(0);
  const [ClassCode, setClassCode] = useState('');
  const [classStudent, setClassStudent] = useState<Students[]>([]);
  const [classSchedule, setClassSchedule] = useState<Schedule[]>([]);
  const [student, setStudent] = useState<Student[]>([]);
  const [Slot, setSlot] = useState<Slot[]>([]);
  const [Room, setRoom] = useState<Room[]>([]);
  const [StudentCode, setStudentCode] = useState<string[]>([]);
  const [classes, setClasses] = useState<ClassDetail>();
  const [ClassId, setClassID] = useState<number>(0);
  const [date, setDate] = useState<Date | null>(null);
  const [SlotId, setSlotId] = useState(0);
  const [RoomId, setRoomId] = useState<number | null>(null);
  const [scheduleID, setScheduleID] = useState<number>(0);

  const [attendance, setAttendance] = useState<Attendance[]>([]);

  const [studentID, setStudentID] = useState<string[]>([]);

  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudentClass, setFilteredStudentClass] =
    useState<Students[]>(classStudent);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheck, setIsCheck] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const countAttendedOne = attendance.filter(
    (item) => item.attended === 1,
  ).length;
  const countAttendedTwo = attendance.filter(
    (item) => item.attended === 2,
  ).length;
  const countAttendedThree = attendance.filter(
    (item) => item.attended === 3,
  ).length;
  const totalAttended =
    countAttendedOne + countAttendedTwo + countAttendedThree;

  //Chart
  const pieParams = { height: 200, margin: { right: 5 } };
  const palette = ['#E83B3B', '#9A9999', '#4EFD4E'];

  const failMessage = useSelector(
    (state: RootState) => state.student.studentDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.student.message,
  );

  const role = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.role.name,
  );

  const [errors, setErrors] = useState<{
    StudentCode?: string;
    SlotId?: string;
    date?: string;
  }>({});

  const handleRowClick = (scheduleID: number) => {
    navigate(`/class/classdetails`, {
      state: { scheduleID: scheduleID },
    });
  };

  const handleSelectStudent = (id: string, checked: boolean) => {
    if (checked) {
      setStudentID((prev) => [...prev, id]);
    } else {
      setStudentID((prev) => prev.filter((student) => student !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allIds = (!isUpdate ? classStudent : filteredStudentClass).map(
        (item) => item.id,
      );
      setStudentID(allIds);
      setSelectAll(true);
    } else {
      setStudentID([]);
      setSelectAll(false);
    }
  };

  console.log(failMessage);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage.title);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearStudentMessages());
    }
    if (failMessage && failMessage.data.data.errors) {
      message.error(`${failMessage.data.data.errors}`);
    } else if (failMessage?.data.data) {
      message.error(`${failMessage.data.data}`);
    }
    dispatch(clearStudentMessages());
  }, [successMessage, failMessage, dispatch]);
  const showModalUpdateSchedule = (item?: Schedule) => {
    getAllSlotByType();
    getAllRoom();
    setIsCheck('updateSchedule');
    if (item) {
      setDate(new Date(item.date!));
      setSlotId(item.slot.slotID!);
      setRoomId(
        item.room === null
          ? Number(classes?.result.room.roomID)
          : Number(item.room.roomID),
      );
    } else {
      resetModalFields();
    }
    setIsModalVisible(true);
  };

  const classDetails = [
    { title: 'Class Code', value: classes?.result.classCode || 'N/A' },
    {
      title: 'Status',
      value:
        classes?.result.classStatus === 1 ? (
          <Tag color="green">Available</Tag>
        ) : classes?.result.classStatus === 2 ? (
          <Tag color="red">Unvailable</Tag>
        ) : (
          <Tag color="gray">N/A</Tag>
        ),
      classStatus: true,
    },
    {
      title: 'Semester',
      value: classes?.result.semester.semesterCode || 'N/A',
    },
    { title: 'Room', value: classes?.result.room.roomName || 'N/A' },
    { title: 'Subject', value: classes?.result.subject.subjectName || 'N/A' },
    // {
    //   title: 'Lecturer',
    //   value: classes?.result.lecturer.displayName,
    // },
  ];

  useEffect(() => {
    if (location.state && location.state.classID) {
      setClassID(location.state.classID);
    }
  }, [location.state]);

  const handleSearchStudent = useCallback(
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
      const filtered = classStudent.filter(
        (item) => {
          const normalizedStudentName = item.displayName
            ? normalizeString(item.displayName).toLowerCase()
            : '';
          const normalizedStudentCode = item.studentCode
            ? normalizeString(item.studentCode).toLowerCase()
            : '';
          const normalizedEmail = item.email
            ? normalizeString(item.email).toLowerCase()
            : '';

          return (
            normalizedStudentName.includes(normalizedValue) ||
            normalizedStudentCode.includes(normalizedValue) ||
            normalizedEmail.includes(normalizedValue)
          );
        },
        // (item.displayName &&
        //   item.displayName.toLowerCase().includes(value.toLowerCase())) ||
        // (item.email &&
        //   item.email.toLowerCase().includes(value.toLowerCase())) ||
        // (item.studentCode &&
        //   item.studentCode.toLowerCase().includes(value.toLowerCase())),
      );
      setFilteredStudentClass(filtered ?? []);
      setIsUpdate(true);
    },
    [classStudent],
  );

  const fetchAll = useCallback(async () => {
    try {
      if (ClassId !== 0) {
        const data = await ClassService.getClassByID(ClassId);
        setClasses(data || undefined);
        setClassStudent(data?.result.students || []);
        setClassSchedule(data?.result.schedules || []);
        console.log('asadcecfes', data?.result.subject);
        setSemesterId(data?.result.semester.semesterID || 0);
        setClassCode(data?.result.classCode || '');
        setFilteredStudentClass(data?.result.students || []);
      }
    } catch (error) {
      console.log('get all error: ', error);
    }
  }, [ClassId]);

  // const filterAttendees = useCallback(async () => {
  //   const filteredList = classSchedule
  //     .filter((schedule) => [1, 2, 3].includes(schedule.attended))
  //     .map((schedule) => ({ attended: schedule.attended }));
  //   setAttendance(filteredList);
  // }, [classSchedule]);

  useEffect(() => {
    const filterAttendees = async () => {
      const filteredList = classSchedule
        .filter((schedule) => [1, 2, 3].includes(schedule.attended))
        .map((schedule) => ({ attended: schedule.attended }));
      setAttendance(filteredList);
    };

    filterAttendees();
  }, [classSchedule]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (searchInput !== '' && classStudent.length > 0) {
      handleSearchStudent(searchInput);
    } else if (searchInput === '') {
      setIsUpdate(false);
    }
  }, [classStudent, searchInput, handleSearchStudent]);

  // useEffect(() => {
  //   if (ClassId !== 0) {
  //     const response = ClassService.getClassByID(ClassId);

  //     response
  //       .then((data) => {
  //         setClasses(data || undefined);
  //         setClassStudent(data?.result.students || []);
  //         setClassSchedule(data?.result.schedules || []);
  //         setSemesterId(data?.result.semester.semesterID || 0);
  //         setClassCode(data?.result.classCode || '');
  //         setFilteredStudentClass(data?.result.students || []);
  //       })
  //       .catch((error) => {
  //         console.log('get class by id error: ', error);
  //       });
  //   }
  // }, [ClassId, reload]);

  const columnsStudent = [
    {
      key: '1',
      title: 'Student Name',
      dataIndex: 'studentName',
    },
    {
      key: '2',
      title: 'Email',
      dataIndex: 'studentEmail',
    },
    {
      key: '3',
      title: 'Student Code',
      dataIndex: 'studentCode',
    },
    {
      key: '4',
      title: 'Absence',
      dataIndex: 'absencePercentage',
      render: (absencePercentage: number) => (
        <div>
          <p style={{ color: absencePercentage >= 20 ? 'red' : 'green' }}>
            {absencePercentage}%
          </p>
        </div>
      ),
    },
    // {
    //   key: '5',
    //   title: 'Action',
    //   dataIndex: 'action',
    // },
    {
      title: (
        <Checkbox
          disabled={disabled}
          checked={selectAll}
          onChange={(e) => handleSelectAll(e.target.checked)}
        />
      ),
      dataIndex: 'select',
      render: (_: any, item: any) => (
        <Checkbox
          disabled={disabled}
          checked={studentID.includes(item.id)}
          onChange={(e) => handleSelectStudent(item.id, e.target.checked)}
        />
      ),
    },
  ];

  const columnsSchedule = [
    {
      key: '1',
      title: 'Date',
      dataIndex: 'date',
      filters: [
        {
          text: 'Today',
          value: moment().format('DD/MM/YYYY'),
        },
        {
          text: 'Yesterday',
          value: moment().subtract(1, 'days').format('DD/MM/YYYY'),
        },
      ],
      onFilter: (value: any, record: any) => record.date === value,
      sorter: (a: any, b: any) =>
        moment(a.date, 'DD/MM/YYYY').unix() -
        moment(b.date, 'DD/MM/YYYY').unix(),
      sortDirections: ['descend', 'ascend'],
    },
    {
      key: '2',
      title: 'Time',
      dataIndex: 'time',
    },
    {
      key: '3',
      title: 'Slot',
      dataIndex: 'slot',
    },
    {
      key: '4',
      title: 'Room',
      dataIndex: 'room',
    },
    {
      key: '5',
      title: 'Date Of Week',
      dataIndex: 'dateOfWeek',
    },
    {
      key: '6',
      title: 'Status',
      dataIndex: 'scheduleStatus',
      render: (scheduleStatus: number) => {
        // let notYet = 0;
        // let ongoing = 0;
        // let ended = 0;
        return (
          <div>
            <Tag
              color={
                scheduleStatus === 1 || scheduleStatus === 0
                  ? 'gray'
                  : scheduleStatus === 2
                    ? 'blue'
                    : scheduleStatus === 3
                      ? 'green'
                      : 'white'
              }
              style={{ fontWeight: 'bold', fontSize: '10px' }}
            >
              {scheduleStatus === 1 || scheduleStatus === 0
                ? 'Not Yet'
                : scheduleStatus === 2
                  ? 'On-going'
                  : scheduleStatus === 3
                    ? 'Ended'
                    : 'undefined'}
            </Tag>
          </div>
        );
      },
    },
    {
      key: '7',
      title: 'Attendance Status',
      dataIndex: 'attendanceStatus',
      render: (attendanceStatus: number) => (
        <div>
          <Tag
            color={
              attendanceStatus === 1 || attendanceStatus === 0
                ? 'gray'
                : attendanceStatus === 2
                  ? 'green'
                  : attendanceStatus === 3
                    ? 'red'
                    : 'white'
            }
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {attendanceStatus === 1 || attendanceStatus === 0
              ? 'Not Yet'
              : attendanceStatus === 2
                ? 'Attended'
                : attendanceStatus === 3
                  ? 'Absence'
                  : 'undefined'}
          </Tag>
        </div>
      ),
    },
    {
      key: '8',
      title: 'Students Attendance',
      dataIndex: 'studentattendancestatus',
    },
    {
      key: '9',
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  // if (role === 'Lecturer') {
  //   columnsSchedule.push({
  //     key: '9',
  //     title: 'Info',
  //     dataIndex: 'info',
  //     render: (scheduleID: number) => (
  //       <div>
  //         <Button
  //           onClick={(e) => {
  //             e.stopPropagation();
  //             handleRowClick(scheduleID);
  //           }}
  //           shape="circle"
  //           style={{ border: 'none' }}
  //         >
  //           <span>
  //             <IoMdInformation size={25} />
  //           </span>
  //         </Button>
  //       </div>
  //     ),
  //   });
  // }

  const teacherDetails = [
    { label: 'Name', value: classes?.result.lecturer.displayName },
    { label: 'Email', value: classes?.result.lecturer.email },
    // { label: 'Department', value: classes?.result.lecturer.department },
  ];

  const getAllStudent = async () => {
    const response = await StudentService.getAllStudent();
    const students = response || [];
    const filteredStudents = students.filter(
      (stu) =>
        !classStudent.some(
          (classStu) => classStu.studentCode === stu.studentCode,
        ),
    );

    setStudent(filteredStudents);
  };
  const getAllSlot = async () => {
    const response = await SlotService.getAllSlot();
    setSlot(response || []);
  };

  const getAllSlotByType = async () => {
    const response = await SlotService.getSlotByType(
      classes?.result.slotType.slotTypeID,
    );
    setSlot(response || []);
  };
  const getAllRoom = async () => {
    const response = await RoomService.getAllRoom();
    setRoom(response || []);
  };
  const showModalAddStudent = () => {
    getAllStudent();
    setIsCheck('addStudent');
    setIsModalVisible(true);
  };

  const showModalAddShedule = () => {
    getAllSlotByType();
    getAllRoom();
    setRoomId(classes?.result.room.roomID || 0);
    setIsCheck('addSchedule');
    setIsModalVisible(true);
  };

  const handleUpdateSchedule = async () => {
    if (!validateFieldsAddSchedule()) return;
    setLoading(true);
    await updateSchedule(
      scheduleID,
      date ? moment(date).format('YYYY-MM-DD') : '',
      SlotId,
      RoomId,
    );
    setLoading(false);
    // setIsModalVisible(false);
    // resetModalFields();
    fetchAll();
  };
  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
    setErrors({
      StudentCode: '',
      SlotId: '',
    });
  };

  const resetModalFields = () => {
    setStudentCode([]);
    setSlotId(0);
    setRoomId(null);
    setDate(null);
    setScheduleID(0);
    // setRoomId(null);
    // setSemesterId(null);
    // setSubjectId(null);
    // setLecturerID(null);
    setIsCheck('');
    // setErrors({});
  };

  const validateFieldsAddStudent = () => {
    const newErrors: any = {};
    if (!StudentCode) newErrors.StudentCode = 'StudentCode is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateFieldsAddSchedule = () => {
    const newErrors: any = {};
    if (!date) newErrors.date = 'Date is required';
    if (SlotId === 0) newErrors.SlotId = 'Slot is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddStudent = async () => {
    if (!validateFieldsAddStudent()) return;
    setLoading(true);
    await addStudent(semesterId, StudentCode, ClassCode);
    setLoading(false);
    // setIsModalVisible(false);
    // resetModalFields();
    fetchAll();
  };

  const handleAddSchedule = async () => {
    if (!validateFieldsAddSchedule()) return;
    setLoading(true);
    await addSchedule(
      date ? moment(date).format('YYYY-MM-DD') : '',
      SlotId,
      ClassId,
      RoomId,
    );
    setLoading(false);
    // setIsModalVisible(false);
    // resetModalFields();
    fetchAll();
  };

  const addStudent = async (
    semesterId: number,
    StudentCode: string[],
    ClassCode: string,
  ) => {
    const students = StudentCode.map((code) => ({
      StudentCode: code,
      ClassCode,
    }));

    const arg = {
      semesterId: semesterId,
      students,
    };
    await dispatch(addStudentToClasses(arg) as any);
    setIsCheck('');
  };

  const addSchedule = async (
    Date: string,
    SlotId: number,
    ClassId: number,
    RoomId: number | null,
  ) => {
    const arg = {
      Date: Date,
      SlotId: SlotId,
      ClassId: ClassId,
      RoomId: RoomId,
    };
    await dispatch(addScheduleToClasses(arg) as any);
  };

  const updateSchedule = async (
    scheduleID: number,
    Date: string,
    SlotId: number,
    RoomId: number | null,
  ) => {
    const arg = {
      scheduleID: scheduleID,
      Date: Date,
      SlotId: SlotId,
      RoomId: RoomId,
    };
    // setDate(null);
    // setSlotId(0);
    // setRoomId(0 || null);
    await dispatch(updateScheduleOfClasses(arg) as any);
  };

  const deleteSchedule = async (scheduleID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this schedule?',
      onOk: async () => {
        const arg = { scheduleID: scheduleID };
        await dispatch(deleteScheduleOfClasses(arg) as any);
        fetchAll();
      },
    });
  };

  const deleteSpecificStudent = async (studnetId: string) => {
    const studentID = [studnetId];
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this student?',
      onOk: async () => {
        const arg = { classID: ClassId, students: studentID };
        await dispatch(deleteStudentOfClasses(arg) as any);
        fetchAll();
        // setStudentID([]);
      },
    });
  };

  const deleteSelectedStudent = async () => {
    const students = studentID.map((id) => ({
      studentID: id,
    }));
    //  console.log('students', students)
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete selected students?',
      onOk: async () => {
        const arg = { classID: ClassId, students: students };
        await dispatch(deleteStudentOfClasses(arg) as any);
        fetchAll();
        setStudentID([]);
      },
    });
  };

  const accessDeleteStudents = async () => {
    setDisabled((prevDisabled) => !prevDisabled);
  };

  return (
    <Content className={styles.accountClassContent}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <ContentHeader
          contentTitle="Class"
          previousBreadcrumb={'Home / Class / '}
          currentBreadcrumb={'Class Detail'}
          key={''}
        />
        <Link
          to={'/class/detail/class-report'}
          state={{ classID: ClassId, classCode: classes?.result.classCode }}
        >
          <Button size="large">View class report</Button>
        </Link>
      </div>
      <Card className={styles.cardHeaderDetail}>
        <Row gutter={[16, 16]}>
          <Col span={9}>
            <Card style={{ height: '100%' }}>
              <Row>
                {/* <Col span={1}> */}
                <Row style={{ display: 'flex', width: '100%', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <img
                    alt="Lecturer"
                    src={classes?.result.lecturer.avatar}
                    style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover' }}
                  />
                  <p
                    style={{
                      fontWeight: 'bold',
                      fontSize: 20,
                      marginLeft: 10,
                    }}
                  >
                    <IoPersonSharp size={20} /> About
                  </p>
                </Row>
                {/* </Col> */}
                <Col span={23} style={{ marginLeft: 20, marginTop: 25 }}>
                  {/* <Row gutter={[16, 16]}>
                    <Col span={12}>
                      <Row style={{ marginBottom: 40 }}>
                        <p style={{ fontWeight: 'bold', fontSize: 20 }}>
                          <IoPersonSharp size={20} /> About
                        </p>
                      </Row>
                      <Row style={{ marginBottom: 40 }}>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>Name: </p>
                      </Row>
                      <Row style={{ marginBottom: 10 }}>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>Name: </p>
                      </Row>
                    </Col>
                    <Col span={12}>
                      <br />
                      <Row style={{ marginTop: 40 }}>
                        <p style={{ fontSize: 18, fontWeight: 500 }}>Name: </p>
                      </Row>
                    </Col>
                  </Row> */}
                  <Content>
                    <Space
                      direction="horizontal"
                      className={styles.accountInfo}
                    >
                      {teacherDetails.map((detail) => (
                        <Space
                          direction="vertical"
                          className={styles.accountDetails}
                          key={detail.label}
                        >
                          <Typography.Text className={styles.textTitle}>
                            {detail.label}
                          </Typography.Text>
                          <Typography.Title level={4}>
                            {detail.value}
                          </Typography.Title>
                        </Space>
                      ))}
                    </Space>
                  </Content>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col span={9}>
            <Content>
              <AntHeader className={styles.tableHeader}>
                <p className={styles.tableTitle}>Class Details</p>
              </AntHeader>
              {/* <Col span={24}>
                <Content>
                  <Content>
                    <table className={styles.classDetailsTable}>
                      <tbody>
                        {classDetails.map((detail, index) => (
                          <tr key={index}>
                            <td className={styles.updateClassTitle}>
                              {detail.title}
                            </td>
                            <td>
                              <p>{detail.value}</p>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </Content>
                </Content>
              </Col> */}
              <Col span={24}>
                <Card className={styles.card1}>
                  {classDetails.map((detail, i) => (
                    <div key={`info_${i}`}>
                      <Row className={styles.rowDetails}>
                        <Col span={14}>
                          <div style={{ fontWeight: 500 }}>{detail.title}:</div>
                        </Col>
                        <Col span={10}>
                          <div style={{ fontWeight: 500, color: '#667085' }}>
                            {detail.value}
                          </div>
                        </Col>
                      </Row>
                      <hr
                        style={{
                          borderColor: '#e6e7e9',
                          borderWidth: 0.5,
                        }}
                      />
                    </div>
                  ))}
                </Card>
              </Col>
            </Content>
          </Col>
          <Col span={6}>
            <Box
              flexGrow={1}
              display="flex"
              flexDirection="column"
              alignItems="center"
            >
              <Typography className={styles.tableTitle}>Attendance</Typography>
              <PieChart
                colors={palette}
                series={[
                  {
                    data: [
                      { value: countAttendedThree },
                      { value: countAttendedOne },
                      { value: countAttendedTwo },
                    ],
                  },
                ]}
                {...pieParams}
              />
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginTop: 20,
                }}
              >
                <ColorShowcase color="primary" explain={'lecturerAttendance'} />
              </div>
            </Box>
          </Col>
        </Row>
        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        >
          Schedule
        </Divider>
        <Row style={{ marginTop: 20 }} gutter={[16, 16]}>
          <Col span={24}>
            <Card className={styles.cardHeader}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Schedule</p>
                  <Col>
                    <Button
                      onClick={showModalAddShedule}
                      type="primary"
                      icon={<PlusOutlined />}
                    >
                      Add New
                    </Button>
                  </Col>
                </AntHeader>
              </Content>
            </Card>
            <Table
              columns={columnsSchedule}
              dataSource={classSchedule.map((item, index) => ({
                key: index,
                date: !item.date
                  ? 'N/A'
                  : moment(item.date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                time: (
                  <div>
                    {!item.slot
                      ? 'N/A'
                      : `${(typeof item.slot.startTime === 'string'
                        ? item.slot.startTime
                        : String(item.slot.startTime ?? '')
                      ).slice(0, 5)} - ${(typeof item.slot.endtime ===
                        'string'
                        ? item.slot.endtime
                        : String(item.slot.endtime ?? '')
                      ).slice(0, 5)}`}
                  </div>
                ),
                slot: item.slot.slotNumber || 'N/A',
                room:
                  item.room === null
                    ? classes?.result.room.roomName
                    : item.room.roomName,
                dateOfWeek: item.dateOfWeek || 'N/A',
                scheduleStatus: item.scheduleStatus,
                attendanceStatus: item.attended,
                studentattendancestatus: (
                  <>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                      }}
                    >
                      {item.attendedStudent}
                    </div>
                  </>
                ),
                action: (
                  <div>
                    <Button
                      shape="circle"
                      style={{ border: 'none', backgroundColor: 'white' }}
                    >
                      <CiEdit
                        onClick={() => {
                          setIsCheck('updateSchedule');
                          setScheduleID(item.scheduleID);
                          showModalUpdateSchedule(item);
                        }}
                        size={20}
                        style={{ color: 'blue' }}
                      />
                    </Button>

                    <Button
                      shape="circle"
                      style={{ border: 'none', backgroundColor: 'white' }}
                      onClick={() => deleteSchedule(item.scheduleID!)}
                    >
                      <MdDeleteForever size={20} style={{ color: 'red' }} />
                    </Button>
                  </div>
                ),
                info: item.scheduleID,
              }))}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
          </Col>
        </Row>
        <Divider
          style={{
            borderColor: '#7cb305',
          }}
        >
          Student
        </Divider>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card className={styles.cardHeader}>
              <Content>
                <AntHeader className={styles.tableHeader}>
                  <p className={styles.tableTitle}>Student</p>
                  <Row gutter={[16, 16]}>
                    <Col>
                      <Input
                        placeholder="Search "
                        suffix={<CiSearch />}
                        variant="filled"
                        value={searchInput}
                        onChange={(e) => handleSearchStudent(e.target.value)}
                      ></Input>
                    </Col>
                    <Col>
                      <Button
                        onClick={showModalAddStudent}
                        type="primary"
                        icon={<PlusOutlined />}
                      >
                        Add New
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        disabled={disabled}
                        onClick={deleteSelectedStudent}
                        type="primary"
                        icon={<MinusOutlined />}
                        style={{ backgroundColor: 'red' }}
                      >
                        Remove Students
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        onClick={accessDeleteStudents}
                        type="dashed"
                        icon={<FcDeleteDatabase />}
                        style={{ backgroundColor: 'white', borderRadius: 2 }}
                      ></Button>
                    </Col>
                  </Row>
                </AntHeader>
              </Content>
            </Card>
            <Table
              columns={columnsStudent}
              dataSource={(!isUpdate ? classStudent : filteredStudentClass).map(
                (item, index) => ({
                  key: index,
                  studentName: item.displayName || 'N/A',
                  studentEmail: item.email || 'N/A',
                  studentCode: item.studentCode || 'N/A',
                  absencePercentage: item.absencePercentage,
                  // action: (
                  //   <div>
                  //     <Button
                  //       shape="circle"
                  //       style={{ border: 'none', backgroundColor: 'white' }}
                  //       onClick={() => (deleteSpecificStudent(item.id))}
                  //       >
                  //       <MdDeleteForever size={20} style={{ color: 'red' }} />
                  //     </Button>
                  //   </div>
                  // ),
                  id: item.id,
                }),
              )}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
            <Modal
              title={
                isCheck === 'addSchedule'
                  ? 'Add Schedule To Class'
                  : isCheck === 'updateSchedule'
                    ? 'Update Schedule'
                    : isCheck === 'addStudent'
                      ? 'Add Student To Class'
                      : ''
              }
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
                  onClick={
                    isCheck === 'addSchedule'
                      ? handleAddSchedule
                      : isCheck === 'updateSchedule'
                        ? handleUpdateSchedule
                        : isCheck === 'addStudent'
                          ? handleAddStudent
                          : undefined
                  }
                >
                  Submit
                </Button>,
              ]}
            >
              {isCheck === 'addStudent' && (
                <>
                  <p className={styles.createClassTitle}>Students</p>
                  <Select
                    mode="multiple"
                    placeholder="Students"
                    value={StudentCode}
                    onChange={(value) => {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        StudentCode: '',
                      }));
                      setStudentCode(value as string[]);
                    }}
                    showSearch
                    style={{ marginBottom: '10px', width: '100%' }}
                    filterOption={(input, option) => {
                      const children = option?.children as unknown as string;
                      const normalizeString = (str: string) => {
                        return str
                          .normalize('NFD')
                          .replace(/[\u0300-\u036f]/g, '');
                      };

                      const normalizedChildren =
                        normalizeString(children).toLowerCase();
                      const normalizedInput =
                        normalizeString(input).toLowerCase();
                      return normalizedChildren.includes(normalizedInput);
                    }}
                  >
                    {student.map((stu) => (
                      <Select.Option
                        key={stu.studentID}
                        value={stu.studentCode}
                      >
                        {/* <img
                          alt="student"
                          src={stu.avatar}
                          style={{ height: 20, width: 20, marginRight: 8 }}
                        /> */}
                        {stu.studentCode + '-' + stu.studentName}
                      </Select.Option>
                    ))}
                  </Select>

                  {errors.StudentCode && (
                    <p className={styles.errorText}>{errors.StudentCode}</p>
                  )}
                </>
              )}
              {(isCheck === 'addSchedule' || isCheck === 'updateSchedule') && (
                <>
                  <p className={styles.createClassTitle}>
                    Date{' '}
                    {`(from ${dayjs(classes?.result.semester.startDate).format(
                      'DD-MM-YYYY',
                    )} to ${dayjs(classes?.result.semester.endDate).format(
                      'DD-MM-YYYY',
                    )})`}
                  </p>{' '}
                  <DatePicker
                    placeholderText="Date"
                    selected={date}
                    onChange={(date) => {
                      setDate(date);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        date: '',
                      }));
                    }}
                    dateFormat="dd-MM-yyyy"
                    className={styles.datePicker}
                  // style={{ marginBottom: '10px', width: '100%' }}
                  />
                  {errors.date && (
                    <p className={styles.errorText}>{errors.date}</p>
                  )}
                  <p className={styles.createClassTitle}>Slots</p>
                  <Select
                    placeholder="Slots"
                    value={SlotId}
                    onChange={(value) => {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        SlotId: '',
                      }));
                      setSlotId(value);
                    }}
                    // showSearch
                    style={{ marginBottom: '10px', width: '100%' }}
                    filterOption={(input, option) => {
                      const children = option?.children as unknown as string;
                      return children
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                  >
                    {Slot.map((slot) => (
                      <Select.Option key={slot.slotID} value={slot.slotID}>
                        Slot {slot.slotNumber} ({slot.startTime} -{' '}
                        {slot.endtime})
                      </Select.Option>
                    ))}
                  </Select>
                  {errors.SlotId && (
                    <p className={styles.errorText}>{errors.SlotId}</p>
                  )}
                  <p className={styles.createClassTitle}>Rooms</p>
                  <Select
                    placeholder="Rooms"
                    value={RoomId}
                    onChange={(value) => {
                      setRoomId(value);
                    }}
                    showSearch
                    style={{ marginBottom: '10px', width: '100%' }}
                    filterOption={(input, option) => {
                      const children = option?.children as unknown as string;
                      return children
                        .toLowerCase()
                        .includes(input.toLowerCase());
                    }}
                  >
                    {Room.map((room) => (
                      <Select.Option key={room.roomID} value={room.roomID}>
                        {'Room ' + room.roomName}
                      </Select.Option>
                    ))}
                  </Select>
                </>
              )}
            </Modal>
          </Col>
        </Row>
      </Card>
    </Content>
  );
};

export default AdminClassDetail;
