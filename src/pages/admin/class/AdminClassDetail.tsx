import {
  Button,
  Card,
  Col,
  DatePicker,
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
import React, { useState, useEffect } from 'react';
import styles from './AdminClass.module.less';
import { Link, useLocation } from 'react-router-dom';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { CiSearch } from 'react-icons/ci';
import {
  ClassDetail,
  Schedule,
  Student as Students,
} from '../../../models/Class';
import { ClassService } from '../../../hooks/Class';
import { PlusOutlined } from '@ant-design/icons';
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
} from '../../../redux/slice/Student';
import { SlotService } from '../../../hooks/Slot';
import moment from 'moment';
import { RoomService } from '../../../hooks/Room';

const { Header: AntHeader } = Layout;

const AdminClassDetail: React.FC = () => {
  const location = useLocation();
  const [semesterId, setSemesterId] = useState(0);
  const [ClassCode, setClassCode] = useState('');
  const [classStudent, setClassStudent] = useState<Students[]>([]);
  const [classSchedule, setClassSchedule] = useState<Schedule[]>([]);
  const [student, setStudent] = useState<Student[]>([]);
  const [Slot, setSlot] = useState<Slot[]>([]);
  const [Room, setRoom] = useState<Room[]>([]);
  const [StudentCode, setStudentCode] = useState('');
  const [classes, setClasses] = useState<ClassDetail>();
  const [ClassId, setClassID] = useState<number>(0);
  const [date, setDate] = useState('');
  const [SlotId, setSlotId] = useState(0);
  const [RoomId, setRoomId] = useState(0 || null);

  const [isUpdate, setIsUpdate] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [filteredStudentClass, setFilteredStudentClass] =
    useState<Students[]>(classStudent);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const dispatch = useDispatch();

  console.log('schedule', classSchedule)

  const failMessage = useSelector(
    (state: RootState) => state.student.message?.data.data.data.errors,
  );
  const successMessage = useSelector(
    (state: RootState) => state.student.studentDetail?.title,
  );

  const [errors, setErrors] = useState<{
    StudentCode?: string;
    SlotId?: string;
    date?: string;
  }>({});

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearStudentMessages());
    }
    if (failMessage) {
      message.error(`${failMessage}`);
      dispatch(clearStudentMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  console.log('class', classes)

  const classDetails = [
    { title: 'Class Code', value: classes?.result.classCode },
    {
      title: 'Status',
      value: classes?.result.classStatus ? (
        <Tag color="green">Active</Tag>
      ) : (
        <Tag color="red">Inactive</Tag>
      ),
      classStatus: true,
    },
    { title: 'Semester', value: classes?.result.semester.semesterCode },
    { title: 'Room', value: classes?.result.room.roomName },
    { title: 'Subject', value: classes?.result.subject.subjectName },
    {
      title: 'Lecturer',
      value: classes?.result.lecturer.displayName,
    },
  ];

  useEffect(() => {
    if (location.state && location.state.classID) {
      setClassID(location.state.classID);
    }
  }, [location.state]);

  useEffect(() => {
    if (ClassId !== 0) {
      const response = ClassService.getClassByID(ClassId);

      response
        .then((data) => {
          setClasses(data || undefined);
          setClassStudent(data?.result.students || []);
          setClassSchedule(data?.result.schedules || []);
          setSemesterId(data?.result.semester.semesterID || 0);
          setClassCode(data?.result.classCode || '');
          setFilteredStudentClass(data?.result.students || []);
        })
        .catch((error) => {
          console.log('get class by id error: ', error);
        });
    }
  }, [ClassId, reload]);

  const handleSearchStudent = (value: string) => {
    setSearchInput(value);
    const normalizeString = (str: string) => {
      return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    };
    const normalizedValue = normalizeString(value).toLowerCase();
    const filtered = classes?.result.students.filter(
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
      }
        // (item.displayName &&
        //   item.displayName.toLowerCase().includes(value.toLowerCase())) ||
        // (item.email &&
        //   item.email.toLowerCase().includes(value.toLowerCase())) ||
        // (item.studentCode &&
        //   item.studentCode.toLowerCase().includes(value.toLowerCase())),
    );
    setFilteredStudentClass(filtered ?? []);
    setIsUpdate(true);
  };

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
  ];

  const columnsSchedule = [
    {
      key: '1',
      title: 'Date',
      dataIndex: 'date',
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
      title: 'Date Of Week',
      dataIndex: 'dateOfWeek',
    },
    {
      key: '5',
      title: 'Status',
      dataIndex: 'scheduleStatus',
      render: (scheduleStatus: number) => (
        <div>
          <Tag
            color={scheduleStatus === 1 || scheduleStatus === 0 ? 'gray' : scheduleStatus === 2 ? 'blue' : scheduleStatus === 3 ? 'green' : 'white'}
            style={{ fontWeight: 'bold', fontSize: '10px' }}
          >
            {scheduleStatus === 1 || scheduleStatus === 0 ? 'Not Yet' : scheduleStatus === 2 ? 'Ongoing' : scheduleStatus === 3 ? 'Finished' : 'undefined'}
          </Tag>
        </div>
      ),
    },
  ];

  const teacherDetails = [
    { label: 'Name', value: classes?.result.lecturer.displayName },
    { label: 'Email', value: classes?.result.lecturer.email },
    { label: 'Department', value: classes?.result.lecturer.department },
  ];

  const getAllStudent = async () => {
    const response = await StudentService.getAllStudent();
    setStudent(response || []);
  };
  const getAllSlot = async () => {
    const response = await SlotService.getAllSlot();
    setSlot(response || []);
  };
  const getAllRoom = async () => {
    const response = await RoomService.getAllRoom();
    setRoom(response || []);
  };
  const showModalAddStudent = () => {
    getAllStudent();
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const showModalAddShedule = () => {
    getAllSlot();
    getAllRoom();
    setIsCheck(true);
    setIsModalVisible(true);
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
    setStudentCode('');
    setSlotId(0);
    setRoomId(null);
    setDate('');
    // setRoomId(null);
    // setSemesterId(null);
    // setSubjectId(null);
    // setLecturerID(null);
    setIsCheck(false);
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
    await addStudent(semesterId, StudentCode ?? '', ClassCode);
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const handleAddSchedule = async () => {
    if (!validateFieldsAddSchedule()) return;
    setLoading(true);
    await addSchedule(date, SlotId, ClassId, RoomId);
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const addStudent = async (
    semesterId: number,
    StudentCode: string,
    ClassCode: string,
  ) => {
    const arg = {
      semesterId: semesterId,
      StudentCode: StudentCode,
      ClassCode: ClassCode,
    };
    await dispatch(addStudentToClasses(arg) as any);
    setIsCheck(false);
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
          <Col span={14}>
            <Card style={{ height: '100%' }}>
              <Row>
                <Col span={4}>
                  <img
                    alt="Lecturer"
                    src={classes?.result.lecturer.avatar}
                    style={{ width: 100, height: 100 }}
                  />
                </Col>
                <Col span={19} style={{ marginLeft: 20 }}>
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
          <Col span={10}>
            <Content>
              <AntHeader className={styles.tableHeader}>
                <p className={styles.tableTitle}>Class Details</p>
              </AntHeader>
              <Col span={24}>
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
              </Col>
            </Content>
          </Col>
        </Row>
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
                date: moment(item.date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                time: (
                  <div>
                  {(typeof item.slot.startTime === 'string'
                    ? item.slot.startTime
                    : String(item.slot.startTime ?? ''))
                    .slice(0, 5)} 
                  - 
                  {(typeof item.slot.endtime === 'string'
                    ? item.slot.endtime
                    : String(item.slot.endtime ?? ''))
                    .slice(0, 5)}
                </div>
                ),
                slot: item.slot.slotNumber,
                dateOfWeek: item.dateOfWeek,
                scheduleStatus: item.scheduleStatus,
              }))}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
          </Col>
        </Row>
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
                  </Row>
                </AntHeader>
              </Content>
            </Card>
            <Table
              columns={columnsStudent}
              dataSource={(!isUpdate ? classStudent : filteredStudentClass).map(
                (item, index) => ({
                  key: index,
                  studentName: item.displayName,
                  studentEmail: item.email,
                  studentCode: item.studentCode,
                  absencePercentage: item.absencePercentage,
                }),
              )}
              pagination={{
                showSizeChanger: true,
              }}
            ></Table>
            <Modal
              title={isCheck ? 'Add Schedule To Class' : 'Add Student To Class'}
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
                  onClick={isCheck ? handleAddSchedule : handleAddStudent}
                >
                  Submit
                </Button>,
              ]}
            >
              {!isCheck && (
                <>
                  <p className={styles.createClassTitle}>Students</p>
                  <Select
                    placeholder="Students"
                    value={StudentCode}
                    onChange={(value) => {
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        StudentCode: '',
                      }));
                      setStudentCode(value);
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
                    {student.map((stu) => (
                      <Select.Option
                        key={stu.studentID}
                        value={stu.studentCode}
                      >
                        {stu.studentCode + '-' + stu.studentName}
                      </Select.Option>
                    ))}
                  </Select>

                  {errors.StudentCode && (
                    <p className={styles.errorText}>{errors.StudentCode}</p>
                  )}
                </>
              )}
              {isCheck && (
                <>
                  <p className={styles.createClassTitle}>Date</p>
                  <DatePicker
                    placeholder="Date"
                    value={date ? moment(date, 'YYYY-MM-DD') : null}
                    onChange={(date, dateString) => {
                      setDate(`${dateString}`);
                      setErrors((prevErrors) => ({
                        ...prevErrors,
                        date: '',
                      }));
                    }}
                    format="YYYY-MM-DD"
                    style={{ marginBottom: '10px', width: '100%' }}
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
                    showSearch
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
                        {slot.slotNumber}
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
                        {room.roomName}
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
