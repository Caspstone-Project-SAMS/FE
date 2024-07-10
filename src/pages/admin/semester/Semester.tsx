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
  DatePicker,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
// import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './Semester.module.less';
import type {
  Semester,
  SemesterMessage,
} from '../../../models/calendar/Semester';
import { CalendarService } from '../../../hooks/Calendar';
import { CiSearch, CiEdit } from 'react-icons/ci';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import { createSemester, updateSemester } from '../../../redux/slice/Semester';
import { SemesterService } from '../../../hooks/Semester';
import { PlusOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Semester: React.FC = () => {
  const semesterMessage: SemesterMessage | undefined = useSelector(
    (state: RootState) => state.semester.semesterDetail,
  );
  const [semester, setSemester] = useState<Semester[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSemester, setFilteredSemester] = useState<Semester[]>(semester);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [semesterID, setSemesterID] = useState(0);
  const [SemesterCode, setSemesterCode] = useState('');
  const [SemesterStatus, setSemesterStatus] = useState(false);
  const [StartDate, setStartDate] = useState('');
  const [EndDate, setEndDate] = useState('');
  const [CreatedBy, setCreatedBy] = useState('');

  const [reload, setReload] = useState(0);
  const [isCheck, setIsCheck] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    const response = CalendarService.getAllSemester();

    response
      .then((data) => {
        setSemester(data || []);
        // setFilteredSemester(data || []);
      })
      .catch((error) => {
        console.log('get semester error: ', error);
      });
  }, [reload]);

  const showModalUpdate = (item?: Semester) => {
    if (item) {
      setSemesterID(item.semesterID!);
      setSemesterCode(item.semesterCode!);
      setSemesterStatus(item.semesterStatus!);
      setStartDate(item.startDate!);
      setEndDate(item.endDate!);
    } else {
      resetModalFields();
    }
    setIsCheck(true);
    setIsModalVisible(true);
  };

  const showModalCreate = () => {
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const handleCreate = async () => {
    setLoading(true);
    await CreatedNewSemester(
      SemesterCode,
      SemesterStatus,
      StartDate,
      EndDate,
      CreatedBy,
    );
    console.log(SemesterCode)
    console.log(SemesterStatus)
    console.log(StartDate)
    console.log(EndDate)
    console.log(CreatedBy)
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
    console.log('load2', reload);
  };

  const handleUpdate = async () => {
    setLoading(true);
    await updateExistingSemester(
      SemesterCode,
      SemesterStatus,
      StartDate,
      EndDate,
      semesterID,
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();

    setReload((prevReload) => prevReload + 1);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setSemesterID(0);
    setSemesterCode('');
    setSemesterStatus(false);
    setStartDate('');
    setEndDate('');
    setCreatedBy('');
    setIsCheck(false);
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
  ];

  console.log('aaaaa', semester);
  const handleSearchSemester = (value: string) => {
    setSearchInput(value);
    const filtered = semester.filter(
      (item) =>
        item.semesterCode &&
        item.semesterCode.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredSemester(filtered);
    setIsUpdate(true);
  };

  // const CreatedNewSemester = async (
  //   SemesterCode: string,
  //   SemesterStatus: boolean,
  //   StartDate: string,
  //   EndDate: string,
  //   CreatedBy: string,
  // ) => {
  //   const arg = {
  //     SemesterCode: SemesterCode,
  //     SemesterStatus: SemesterStatus,
  //     StartDate: StartDate,
  //     EndDate: EndDate,
  //     CreatedBy: CreatedBy,
  //   };
  //   await dispatch(createSemester(arg) as any);
  //   message.success('Semester Created successfully');
  //   setIsCheck(false);
  //   console.log('message', semesterMessage);
  // };

  const CreatedNewSemester = async (
    SemesterCode: string,
    SemesterStatus: boolean,
    StartDate: string,
    EndDate: string,
    CreatedBy: string,
  ) => {
    const arg = {
      SemesterCode: SemesterCode,
      SemesterStatus: SemesterStatus,
      StartDate: StartDate,
      EndDate: EndDate,
      CreatedBy: CreatedBy,
    };
    const resultAction = await dispatch(createSemester(arg) as any);
    const response = resultAction.payload;
  
    if (response.status === 200) {
      message.success('Semester Created successfully');
    } else if (response.status === 400) {
      message.error('Semester Creation failed');
    }
    
    setIsCheck(false);
    console.log('message', semesterMessage);
  };
  

  const updateExistingSemester = async (
    SemesterCode: string,
    SemesterStatus: boolean,
    StartDate: string,
    EndDate: string,
    semesterID: number,
  ) => {
    const arg = {
      SemesterCode: SemesterCode,
      SemesterStatus: SemesterStatus,
      StartDate: StartDate,
      EndDate: EndDate,
      semesterID: semesterID,
    };
    await dispatch(updateSemester(arg) as any);
    message.success('Semester updated successfully');
    console.log('message', semesterMessage);
  };

  const deleteSemester = async (semesterID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this semester?',
      onOk: async () => {
        await SemesterService.deleteSemester(semesterID);
        message.success('Semester deleted successfully');
        setReload((prevReload) => prevReload + 1);
      },
    });
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
                <p style={{ color: item.semesterStatus ? 'green' : 'red' }}>
                  {item.semesterStatus ? 'true' : 'false'}
                </p>
              </div>
            ),
            startdate: item.startDate,
            enddate: item.endDate,
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
                  onClick={() => deleteSemester(item.semesterID!)}
                >
                  <MdDeleteForever size={20} style={{ color: 'red' }} />
                </Button>
              </div>
            ),
          }),
        )}
        pagination={{
          showSizeChanger: true,
        }}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Semester' : 'Add New Semester'}
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
        <p className={styles.createSemesterTitle}>Semester Code</p>
        <Input
          placeholder="Semester Code"
          value={SemesterCode}
          onChange={(e) => setSemesterCode(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <p className={styles.createSemesterTitle}>Semester Status</p>
        <Radio.Group
          onChange={(e) => setSemesterStatus(e.target.value)}
          value={SemesterStatus}
          style={{ marginBottom: '10px' }}
        >
          <Radio value={1}>Active</Radio>
          <Radio value={0}>Inactive</Radio>
        </Radio.Group>
        <p className={styles.createSemesterTitle}>Start Date</p>
        <DatePicker
          placeholder="Start Date"
          value={StartDate ? moment(StartDate, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setStartDate(`${dateString}`)}
          format="YYYY-MM-DD"
          style={{ marginBottom: '10px', width: '100%' }}
        />
        <p className={styles.createSemesterTitle}>End Date</p>
        <DatePicker
          placeholder="End Date"
          value={EndDate ? moment(EndDate, 'YYYY-MM-DD') : null}
          onChange={(date, dateString) => setEndDate(`${dateString}`)}
          format="YYYY-MM-DD"
          style={{ marginBottom: '10px', width: '100%' }}
        />

        {!isCheck && (
          <>
            <p className={styles.createSemesterTitle}>Create By</p>
            <Input
              placeholder="Create By"
              value={CreatedBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            />
          </>
        )}
      </Modal>
    </Content>
  );
};

export default Semester;
