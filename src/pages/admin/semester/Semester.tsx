import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  message,
  Modal,
  Radio,
  Row,
  Table,
  Tag,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import moment from 'moment';
import React, { useState, useEffect, useCallback } from 'react';
import styles from './Semester.module.less';
import type { Semester } from '../../../models/calendar/Semester';
import { CalendarService } from '../../../hooks/Calendar';
import { CiSearch, CiEdit } from 'react-icons/ci';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import {
  clearSemesterMessages,
  createSemester,
  updateSemester,
} from '../../../redux/slice/Semester';
import { SemesterService } from '../../../hooks/Semester';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { IoMdInformation } from 'react-icons/io';
import DatePicker from 'react-datepicker'; 
import 'react-datepicker/dist/react-datepicker.css'; 

const { Header: AntHeader } = Layout;

const Semester: React.FC = () => {
  const [semester, setSemester] = useState<Semester[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemester, setFilteredSemester] =
    useState<Semester[]>(semester);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [semesterID, setSemesterID] = useState(0);
  const [SemesterCode, setSemesterCode] = useState('');
  // const [SemesterStatus, setSemesterStatus] = useState(1);
  const [StartDate, setStartDate] = useState<Date | null>(null); 
  const [EndDate, setEndDate] = useState<Date | null>(null); 

  const [reload, setReload] = useState(0);
  const [isCheck, setIsCheck] = useState(false);
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({
    semesterCode: '',
    semesterStatus: '',
    startDate: '',
    endDate: '',
    createdBy: '',
  });

  const handleRowClick = (semesterID: number) => {
    navigate(`/semester/semester-detail`, {
      state: { semesterID: semesterID },
    });
  };

  const failMessage = useSelector(
    (state: RootState) => state.semester.semesterDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.semester.message,
  );

  const handleSearchSemester = useCallback(
    (value: string) => {
      setSearchInput(value);
      const filtered = semester.filter(
        (item) =>
          item.semesterCode &&
          item.semesterCode.toLowerCase().includes(value.toLowerCase()),
      );
      setFilteredSemester(filtered);
      setIsUpdate(true);
    },
    [semester],
  );

  const fetchSemesters = useCallback(async () => {
    try {
      const data = await CalendarService.getAllSemester();
      setSemester(data || []);
    } catch (error) {
      console.log('get semester error: ', error);
    }
  }, []);
  useEffect(() => {
    fetchSemesters();
  }, [fetchSemesters]);

  useEffect(() => {
    if (searchInput !== '' && semester.length > 0) {
      handleSearchSemester(searchInput);
    } else if(searchInput === '') {
      setIsUpdate(false);
    }
  }, [semester, searchInput, handleSearchSemester]);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearSemesterMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.errors}`);
      dispatch(clearSemesterMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const showModalUpdate = (item?: Semester) => {
    setIsCheck(true);
    if (item) {
      setSemesterID(item.semesterID!);
      setSemesterCode(item.semesterCode!);
      // setSemesterStatus(item.semesterStatus!);
      setStartDate(item.startDate ? new Date(item.startDate) : null); 
      setEndDate(item.endDate ? new Date(item.endDate) : null); 
    } else {
      resetModalFields();
    }
    setIsModalVisible(true);
  };

  const showModalCreate = () => {
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const handleCreate = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    await CreatedNewSemester(
      SemesterCode,
      // SemesterStatus,
      StartDate ? moment(StartDate).format('YYYY-MM-DD') : '',
      EndDate ? moment(EndDate).format('YYYY-MM-DD') : '',
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    fetchSemesters();
  };

  const handleUpdate = async () => {
    const validationErrors = validateInputs();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setLoading(true);
    await updateExistingSemester(
      SemesterCode,
      // SemesterStatus,
      StartDate ? moment(StartDate).format('YYYY-MM-DD') : '',
      EndDate ? moment(EndDate).format('YYYY-MM-DD') : '',
      semesterID,
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    fetchSemesters();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setSemesterID(0);
    setSemesterCode('');
    // setSemesterStatus(1);
    setStartDate(null); 
    setEndDate(null); 
    setIsCheck(false);
    setErrors({
      semesterCode: '',
      semesterStatus: '',
      startDate: '',
      endDate: '',
      createdBy: '',
    });
  };
  const columns = [
    {
      key: '1',
      title: 'Semester',
      dataIndex: 'semester',
    },
    {
      key: '2',
      title: 'Semester status',
      dataIndex: 'semesterstatus',
    },
    {
      key: '3',
      title: 'Start date',
      dataIndex: 'startdate',
    },
    {
      key: '4',
      title: 'End date',
      dataIndex: 'enddate',
    },
    {
      key: '5',
      title: 'Action',
      dataIndex: 'action',
    },
    {
      key: '6',
      title: 'Info',
      dataIndex: 'info',
      render: (semesterID: number) => (
        <div>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(semesterID);
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

  const CreatedNewSemester = async (
    SemesterCode: string,
    // SemesterStatus: number,
    StartDate: string,
    EndDate: string,
  ) => {
    const arg = {
      SemesterCode: SemesterCode,
      // SemesterStatus: SemesterStatus,
      StartDate: StartDate,
      EndDate: EndDate,
    };
    await dispatch(createSemester(arg) as any);
    setIsCheck(false);
  };

  const updateExistingSemester = async (
    SemesterCode: string,
    // SemesterStatus: number,
    StartDate: string,
    EndDate: string,
    semesterID: number,
  ) => {
    const arg = {
      SemesterCode: SemesterCode,
      // SemesterStatus: SemesterStatus,
      StartDate: StartDate,
      EndDate: EndDate,
      semesterID: semesterID,
    };
    await dispatch(updateSemester(arg) as any);
  };

  const deleteSemester = async (semesterID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this semester?',
      onOk: async () => {
        await SemesterService.deleteSemester(semesterID);
        message.success('Semester deleted successfully');
        fetchSemesters();
      },
    });
  };

  const validateInputs = () => {
    const errors: any = {};
    if (!SemesterCode) errors.semesterCode = 'Semester Code is required';
    // if (SemesterStatus === null)
    //   errors.semesterStatus = 'Semester Status is required';
    if (!StartDate) errors.startDate = 'Start Date is required';
    if (!EndDate) errors.endDate = 'End Date is required';
    return errors;
  };

  return (
    <Content className={styles.accountSemesterContent}>
      <ContentHeader
        contentTitle="Semester"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Semester'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Semester</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchSemester(e.target.value)}
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
        dataSource={(!isUpdate ? semester : filteredSemester).map(
          (item, index) => ({
            key: index,
            semester: item.semesterCode,
            semesterstatus: (
              <div>
                <Tag
                  color={
                    item.semesterStatus === 1
                      ? 'gray'
                      : item.semesterStatus === 2
                      ? 'blue'
                      : 'green'
                  }
                  style={{ fontWeight: 'bold', fontSize: '10px' }}
                >
                  {item.semesterStatus === 1
                    ? 'Not Yet'
                    : item.semesterStatus === 2
                    ? 'Ongoing'
                    : item.semesterStatus === 3
                    ? 'Finished'
                    : 'Unknown'}
                </Tag>
              </div>
            ),
            startdate: moment(item.startDate, 'YYYY-MM-DD').format(
              'DD/MM/YYYY',
            ),
            enddate: moment(item.endDate, 'YYYY-MM-DD').format('DD/MM/YYYY'),
            action: (
              <div>
                <Button
                  shape="circle"
                  style={{ border: 'none', backgroundColor: 'white' }}
                >
                  <CiEdit
                    onClick={(e) => {
                      e.stopPropagation();
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
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteSemester(item.semesterID!);
                  }}
                >
                  <MdDeleteForever size={20} style={{ color: 'red' }} />
                </Button>
              </div>
            ),
            info: item.semesterID,
            register: item,
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Semester' : 'Add New Semester'}
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
            onClick={isCheck ? handleUpdate : handleCreate}
          >
            Submit
          </Button>,
        ]}
      >
        <p className={styles.createSemesterTitle}>Semester Code</p>
        <Input
          placeholder="Semester Code"
          value={SemesterCode}
          onChange={(e) => {
            setSemesterCode(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, semesterCode: '' }));
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.semesterCode && (
          <p className={styles.errorText}>{errors.semesterCode}</p>
        )}
        {/* <p className={styles.createSemesterTitle}>Semester Status</p>
        <Radio.Group
          onChange={(e) => {
            setSemesterStatus(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, semesterStatus: '' }));
          }}
          value={SemesterStatus}
          style={{ marginBottom: '10px' }}
        >
          <Radio value={1}>Not Yet</Radio>
          <Radio value={2}>On going</Radio>
          <Radio value={3}>Finished</Radio>
        </Radio.Group>
        {errors.semesterStatus && (
          <p className={styles.errorText}>{errors.semesterStatus}</p>
        )} */}
        <p className={styles.createSemesterTitle}>Start Date</p>
        <DatePicker
          placeholderText="Start Date"
          selected={StartDate}
          onChange={(date) => {
            setStartDate(date);
            if (date) {
              const endDate = new Date(date);
              endDate.setDate(endDate.getDate() + 90); 
              setEndDate(endDate);
            }
            setErrors((prevErrors) => ({ ...prevErrors, startDate: '' }));
          }}
          dateFormat="dd-MM-yyyy"
          onKeyDown={(e) => e.preventDefault()}
          className={styles.datePicker}
        />
        {errors.startDate && (
          <p className={styles.errorText}>{errors.startDate}</p>
        )}
        <p className={styles.createSemesterTitle}>End Date</p>
        <DatePicker
          placeholderText="End Date"
          selected={EndDate}
          onChange={(date) => {
            setEndDate(date);
            if (date) {
              const startDate = new Date(date);
              startDate.setDate(startDate.getDate() - 90); 
              setStartDate(startDate);
            }
            setErrors((prevErrors) => ({ ...prevErrors, endDate: '' }));
          }}
          dateFormat="dd-MM-yyyy"
          onKeyDown={(e) => e.preventDefault()}
          className={styles.datePicker}
        />
        {errors.endDate && <p className={styles.errorText}>{errors.endDate}</p>}
      </Modal>
    </Content>
  );
};

export default Semester;
