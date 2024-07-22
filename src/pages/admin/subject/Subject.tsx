import {
  Button,
  Card,
  Col,
  Input,
  Layout,
  Modal,
  Radio,
  Row,
  Table,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './Subject.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import type { Subject } from '../../../models/subject/Subject';
import { SubjectService } from '../../../hooks/Subject';
import { CiSearch, CiEdit } from 'react-icons/ci';
import { MdDeleteForever } from 'react-icons/md';
import { clearSubjectMessages, createSubject, updateSubject } from '../../../redux/slice/Subject';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import { message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Subject: React.FC = () => {
  const [subject, setSubject] = useState<Subject[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredSubject, setFilteredSubject] = useState<Subject[]>(subject);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [subjectID, setSubjectID] = useState(0);
  const [SubjectCode, setSubjectCode] = useState('');
  const [SubjectName, setSubjectName] = useState('');
  const [SubjectStatus, setSubjectStatus] = useState(false);
  const [CreateBy, setCreateBy] = useState('');

  const [reload, setReload] = useState(0);
  const [isCheck, setIsCheck] = useState(false);
  const dispatch = useDispatch();

  console.log('status', isModalVisible)
  console.log('code', SubjectCode)
  console.log('name', SubjectName)
  console.log('isCheck', isCheck)

  const failMessage = useSelector(
    (state: RootState) => state.subject.subjectDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.subject.message,
  );

  useEffect(() => {
    const response = SubjectService.getAllSubject();
    response
      .then((data) => {
        setSubject(data || []);
      })
      .catch((error) => {
        console.log('get subject error: ', error);
      });
  }, [reload]);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearSubjectMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.errors}`);
      dispatch(clearSubjectMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const showModalUpdate = (item?: Subject) => {
    setIsCheck(true);
    if (item) {
      setSubjectID(item.subjectID!);
      setSubjectCode(item.subjectCode!);
      setSubjectName(item.subjectName!);
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
    setLoading(true);
    await createNewSubject(SubjectCode, SubjectName, SubjectStatus, CreateBy);
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const handleUpdate = async () => {
    setLoading(true);
    await updateExistingSubject(subjectID, SubjectCode, SubjectName);
    setLoading(false);
    setIsModalVisible(false);
    setReload((prevReload) => prevReload + 1);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setSubjectID(0);
    setSubjectCode('');
    setSubjectName('');
    setSubjectStatus(false);
    setCreateBy('');
    setIsCheck(false);
    // setSubjectByID(undefined);
  };

  const columns = [
    {
      key: '1',
      title: 'Subject Code',
      dataIndex: 'subjectcode',
    },
    {
      key: '2',
      title: 'Subject',
      dataIndex: 'subjectname',
    },
    {
      key: '3',
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  const handleSearchSubject = (value: string) => {
    setSearchInput(value);
    const filtered = subject.filter(
      (item) =>
        (item.subjectName &&
          item.subjectName.toLowerCase().includes(value.toLowerCase())) ||
        (item.subjectCode &&
          item.subjectCode.toLowerCase().includes(value.toLowerCase())),
    );
    setFilteredSubject(filtered);
    setIsUpdate(true);
  };

  const createNewSubject = async (
    SubjectCode: string,
    SubjectName: string,
    SubjectStatus: boolean,
    CreateBy: string,
  ) => {
    const arg = {
      SubjectCode: SubjectCode,
      SubjectName: SubjectName,
      SubjectStatus: SubjectStatus,
      CreateBy: CreateBy,
    };

    await dispatch(createSubject(arg) as any);
    setIsCheck(false);
  };

  const updateExistingSubject = async (
    subjectID: number,
    SubjectCode: string,
    SubjectName: string,
  ) => {
    const arg = {
      subjectID: subjectID,
      SubjectCode: SubjectCode,
      SubjectName: SubjectName,
      // SubjectStatus: true,
    };
    setSubjectID(0);
    setSubjectCode('');
    setSubjectName('');
    await dispatch(updateSubject(arg) as any);
  };

  const deleteSubject = async (subjectID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this subject?',
      onOk: async () => {
        await SubjectService.deleteSubject(subjectID);
        message.success('Subject deleted successfully');
        setReload((prevReload) => prevReload + 1);
      },
    });
  };

  return (
    <Content className={styles.subjectContent}>
      <ContentHeader
        contentTitle="Subject"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Subject'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Subject</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name"
                  suffix={<CiSearch />}
                  variant="filled"
                  value={searchInput}
                  onChange={(e) => handleSearchSubject(e.target.value)}
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
        dataSource={(!isUpdate ? subject : filteredSubject).map(
          (item, index) => ({
            key: index,
            subjectcode: item.subjectCode,
            subjectname: item.subjectName,
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
                  onClick={() => deleteSubject(item.subjectID!)}
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
        title={isCheck ? 'Edit Subject' : 'Add New Subject'}
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
        <p className={styles.createSubjectTitle}>Subject Code</p>
        <Input
          placeholder="Subject Code"
          value={SubjectCode}
          onChange={(e) => setSubjectCode(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <p className={styles.createSubjectTitle}>Subject Name</p>
        <Input
          placeholder="Subject Name"
          value={SubjectName}
          onChange={(e) => setSubjectName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        {!isCheck && (
          <>
            <p className={styles.createSubjectTitle}>Subject Status</p>
            <Radio.Group
              onChange={(e) => setSubjectStatus(e.target.value)}
              value={SubjectStatus}
              style={{ marginBottom: '10px' }}
            >
              <Radio value={1}>Active</Radio>
              <Radio value={0}>Inactive</Radio>
            </Radio.Group>
            <p className={styles.createSubjectTitle}>Create By</p>
            <Input
              placeholder="Create By"
              value={CreateBy}
              onChange={(e) => setCreateBy(e.target.value)}
            />
          </>
        )}
      </Modal>
    </Content>
  );
};

export default Subject;
