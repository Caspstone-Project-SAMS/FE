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
import React, { useCallback, useEffect, useState } from 'react';
import styles from './Subject.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import type { Subject } from '../../../models/subject/Subject';
import { SubjectService } from '../../../hooks/Subject';
import { CiSearch, CiEdit } from 'react-icons/ci';
import { MdDeleteForever } from 'react-icons/md';
import {
  clearSubjectMessages,
  createSubject,
  deleteSubject,
  updateSubject,
} from '../../../redux/slice/Subject';
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
  const [SubjectStatus, setSubjectStatus] = useState(0);
  // const [CreateBy, setCreateBy] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const dispatch = useDispatch();

  // const [fetchSuccess, setFetchSuccess] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const failMessage = useSelector(
    (state: RootState) => state.subject.subjectDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.subject.message,
  );


  const handleSearchSubject = useCallback(
    (value: string) => {
      setSearchInput(value);
      const filtered = subject.filter(
        (item) =>
          (item.subjectName &&
            item.subjectName.toLowerCase().includes(value.toLowerCase())) ||
          (item.subjectCode &&
            item.subjectCode.toLowerCase().includes(value.toLowerCase())),
      );
      console.log(11111111);
      setFilteredSubject(filtered);
      setIsUpdate(true);
    },
    [subject],
  );

  const fetchSubjects = useCallback(async () => {
    try {
      const data = await SubjectService.getAllSubject();
      setSubject(data || []);
    } catch (error) {
      console.log('get subject error: ', error);
    }
  }, []);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (searchInput !== '' && subject.length > 0) {
      handleSearchSubject(searchInput);
    } else if (searchInput === '') {
      setIsUpdate(false);
    }
  }, [subject, searchInput, handleSearchSubject]);

  useEffect(() => {
    if (successMessage) {
      if (successMessage === 'Update subject successfully' || successMessage === 'Create new subject successfully') {
        message.success(successMessage);
      } else {
        message.success(successMessage.title);
      }

      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearSubjectMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.errors}`);
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
    if (!validateForm()) return;
    setLoading(true);
    await createNewSubject(SubjectCode, SubjectName, SubjectStatus);
    setLoading(false);
    // setIsModalVisible(false);
    // resetModalFields();
    fetchSubjects();
  };

  const handleUpdate = async () => {
    if (!validateForm()) return;
    setLoading(true);
    await updateExistingSubject(subjectID, SubjectCode, SubjectName);
    setLoading(false);
    // setIsModalVisible(false);
    fetchSubjects();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setSubjectID(0);
    setSubjectCode('');
    setSubjectName('');
    setSubjectStatus(0);
    // setCreateBy('');
    setIsCheck(false);
    setErrors({});
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

  const createNewSubject = async (
    SubjectCode: string,
    SubjectName: string,
    SubjectStatus: number,
    // CreateBy: string,
  ) => {
    const arg = {
      SubjectCode: SubjectCode,
      SubjectName: SubjectName,
      SubjectStatus: SubjectStatus,
      // CreateBy: CreateBy,
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
    // setSubjectID(0);
    // setSubjectCode('');
    // setSubjectName('');
    await dispatch(updateSubject(arg) as any);
  };

  const deleteSpecificSubject = async (subjectID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this subject?',
      onOk: async () => {
        const arg = { subjectID: subjectID };
        await dispatch(deleteSubject(arg) as any);
        fetchSubjects();
      },
    });
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    if (!SubjectCode.trim()) {
      newErrors.SubjectCode = 'Subject Code is required';
    }
    if (!SubjectName.trim()) {
      newErrors.SubjectName = 'Subject Name is required';
    }
    // if (!isCheck && !CreateBy.trim()) {
    //   newErrors.CreateBy = 'Created By is required';
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
                  onClick={() => deleteSpecificSubject(item.subjectID!)}
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
          onChange={(e) => {
            setSubjectCode(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, SubjectCode: '' }));
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.SubjectCode && (
          <p className={styles.errorText}>{errors.SubjectCode}</p>
        )}
        <p className={styles.createSubjectTitle}>Subject Name</p>
        <Input
          placeholder="Subject Name"
          value={SubjectName}
          onChange={(e) => {
            setSubjectName(e.target.value);
            setErrors((prevErrors) => ({ ...prevErrors, SubjectName: '' }));
          }}
          style={{ marginBottom: '10px' }}
        />
        {errors.SubjectName && (
          <p className={styles.errorText}>{errors.SubjectName}</p>
        )}
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
            {/* <p className={styles.createSubjectTitle}>Create By</p>
            <Input
              placeholder="Create By"
              value={CreateBy}
              onChange={(e) => setCreateBy(e.target.value)}
            /> */}
          </>
        )}
      </Modal>
    </Content>
  );
};

export default Subject;
