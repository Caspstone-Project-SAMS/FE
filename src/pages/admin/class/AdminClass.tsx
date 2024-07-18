import { Button, Card, Col, Input, Layout, Modal, Row } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
// import PageHeaderAdmin from '../../../components/header/headeradmin/PageHeader';
import styles from './AdminClass.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import { CiSearch } from 'react-icons/ci';
import { PlusOutlined } from '@ant-design/icons';
import { ClassDetail } from '../../../models/ClassDetail';
import { useDispatch } from 'react-redux';
import { createClass } from '../../../redux/slice/Class';

const { Header: AntHeader } = Layout;

const AdminClass: React.FC = () => {
  const [classes, setClasses] = useState<ClassDetail[]>([]);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);
  const dispatch = useDispatch();

  const [ClassCode, setClassCode] = useState('');
  const [SemesterCode, setSemesterCode] = useState('');
  const [RoomName, setRoomName] = useState('');
  const [SubjectCode, setSubjectCode] = useState('');
  const [LecturerID, setLecturerID] = useState('');
  const [CreatedBy, setCreatedBy] = useState('');

  const showModalCreate = () => {
    setIsCheck(false);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setClassCode('');
    setRoomName('');
    setSemesterCode('');
    setSubjectCode('');
    setLecturerID('');
    setCreatedBy('');
    setIsCheck(false);
  };

  const handleUpdate = async () => {

  };

  const handleCreate = async () => {
    setLoading(true);
    await createNewClass(
      ClassCode,
      SemesterCode,
      RoomName,
      SubjectCode,
      LecturerID,
      CreatedBy,
    );
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const createNewClass = async (
    ClassCode: string,
    SemesterCode: string,
    RoomName: string,
    SubjectCode: string,
    LecturerID: string,
    CreatedBy: string,
  ) => {
    const arg = {
      ClassCode: ClassCode,
      SemesterCode: SemesterCode,
      RoomName: RoomName,
      SubjectCode: SubjectCode,
      LecturerID: LecturerID,
      CreatedBy: CreatedBy,
    };
    await dispatch(createClass(arg) as any);
    setIsCheck(false);
  };

  return (
    <Content className={styles.classContent}>
      <ContentHeader
        contentTitle="Class"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Class'}
        key={''}
      />
      <Card className={styles.cardHeader}>
        <Content>
          <AntHeader className={styles.tableHeader}>
            <p className={styles.tableTitle}>Room</p>
            <Row gutter={[16, 16]}>
              <Col>
                <Input
                  placeholder="Search by name"
                  suffix={<CiSearch />}
                  variant="filled"
                  // value={searchInput}
                  // onChange={(e) => handleSearchRoom(e.target.value)}
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
      <Row></Row>
      {/* <Modal
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
        <p className={styles.createRoomTitle}>Room Name</p>
        <Input
          placeholder="Room Name"
          value={RoomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <p className={styles.createRoomTitle}>Room Description</p>
        <Input
          placeholder="Room Description"
          value={RoomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          style={{ marginBottom: '10px' }}
        />
        <p className={styles.createRoomTitle}>Room Status</p>
        <Radio.Group
          onChange={(e) => setRoomStatus(e.target.value)}
          value={RoomStatus}
          style={{ marginBottom: '10px' }}
        >
          <Radio value={1}>Active</Radio>
          <Radio value={0}>Inactive</Radio>
        </Radio.Group>
        {!isCheck && (
          <>
            <p className={styles.createSubjectTitle}>Create By</p>
            <Input
              placeholder="Create By"
              value={CreateBy}
              onChange={(e) => setCreateBy(e.target.value)}
            />
          </>
        )}
      </Modal> */}
    </Content>
  );
};

export default AdminClass;
