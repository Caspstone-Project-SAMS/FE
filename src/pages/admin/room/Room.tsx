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
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import styles from './Room.module.less';
import ContentHeader from '../../../components/header/contentHeader/ContentHeader';
import type { Room } from '../../../models/room/Room';
import { RoomService } from '../../../hooks/Room';
import { CiSearch, CiEdit } from 'react-icons/ci';
import { MdDeleteForever } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../redux/Store';
import { clearRoomMessages, createRoom, updateRoom } from '../../../redux/slice/Room';
import { PlusOutlined } from '@ant-design/icons';

const { Header: AntHeader } = Layout;

const Room: React.FC = () => {

  const [room, setRoom] = useState<Room[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [filteredRoom, setFilteredRoom] = useState<Room[]>(room);
  const [isUpdate, setIsUpdate] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const [roomID, setRoomID] = useState(0);
  const [RoomName, setRoomName] = useState('');
  const [RoomDescription, setRoomDescription] = useState('');
  const [RoomStatus, setRoomStatus] = useState(false);
  const [CreateBy, setCreateBy] = useState('');

  const [reload, setReload] = useState(0);
  const [isCheck, setIsCheck] = useState(false);
  const dispatch = useDispatch();

  const failMessage = useSelector(
    (state: RootState) => state.room.roomDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.room.message,
  );

  useEffect(() => {
    const response = RoomService.getAllRoom();

    response
      .then((data) => {
        setRoom(data || []);
        setFilteredRoom(data || []);
      })
      .catch((error) => {
        console.log('get room error: ', error);
      });
  }, [reload]);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      setReload((prevReload) => prevReload + 1);
      setIsModalVisible(false);
      resetModalFields();
      dispatch(clearRoomMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.errors}`);
      dispatch(clearRoomMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const showModalUpdate = (item?: Room) => {
    setIsCheck(true);
    if (item) {
      setRoomID(item.roomID!);
      setRoomName(item.roomName!);
      setRoomDescription(item.roomDescription!);
      setRoomStatus(item.roomStatus!);
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
    await createNewRoom(RoomName, RoomDescription, RoomStatus, CreateBy);
    setLoading(false);
    setIsModalVisible(false);
    resetModalFields();
    setReload((prevReload) => prevReload + 1);
  };

  const handleUpdate = async () => {
    setLoading(true);
    await updateExistingRoom(RoomName, RoomDescription, RoomStatus, roomID);
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
    setRoomID(0);
    setRoomName('');
    setRoomDescription('');
    setRoomStatus(false);
    setCreateBy('');
    setIsCheck(false);
  };
  const columns = [
    {
      key: '1',
      title: 'Room',
      dataIndex: 'roomname',
    },
    {
      key: '2',
      title: 'Description',
      dataIndex: 'roomdescription',
    },
    {
      key: '3',
      title: 'Status',
      dataIndex: 'roomstatus',
    },
    {
      key: '4',
      title: 'Action',
      dataIndex: 'action',
    },
  ];

  const handleSearchRoom = (value: string) => {
    setSearchInput(value);
    const filtered = room.filter(
      (item) =>
        item.roomName &&
        item.roomName.toLowerCase().includes(value.toLowerCase()),
    );
    setFilteredRoom(filtered);
    setIsUpdate(true);
  };

  const createNewRoom = async (
    RoomName: string,
    RoomDescription: string,
    RoomStatus: boolean,
    CreateBy: string,
  ) => {
    const arg = {
      RoomName: RoomName,
      RoomDescription: RoomDescription,
      RoomStatus: RoomStatus,
      CreateBy: CreateBy,
    };
    await dispatch(createRoom(arg) as any);
    setIsCheck(false);
  };

  const updateExistingRoom = async (
    RoomName: string,
    RoomDescription: string,
    RoomStatus: boolean,
    roomID: number,
  ) => {
    const arg = {
      RoomName: RoomName,
      RoomDescription: RoomDescription,
      RoomStatus: RoomStatus,
      roomID: roomID,
    };
    setRoomID(0);
    setRoomName('');
    setRoomDescription('');
    setRoomStatus(false);
    await dispatch(updateRoom(arg) as any);
  };

  const deleteRoom = async (roomID: number) => {
    Modal.confirm({
      title: 'Confirm Deletion',
      content: 'Are you sure you want to delete this room?',
      onOk: async () => {
        await RoomService.deleteRoom(roomID);
        message.success('Room deleted successfully');
        setReload((prevReload) => prevReload + 1);
      },
    });
  };
  return (
    <Content className={styles.roomContent}>
      <ContentHeader
        contentTitle="Room"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Room'}
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
                  value={searchInput}
                  onChange={(e) => handleSearchRoom(e.target.value)}
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
        dataSource={(!isUpdate ? room : filteredRoom).map((item, index) => ({
          key: index,
          roomname: item.roomName,
          roomdescription: item.roomDescription,
          roomstatus: (
            <div>
              <p style={{ color: item.roomStatus ? 'green' : 'red' }}>
                {item.roomStatus ? 'active' : 'inactive'}
              </p>
            </div>
          ),
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
                onClick={() => deleteRoom(item.roomID!)}
              >
                <MdDeleteForever size={20} style={{ color: 'red' }} />
              </Button>
            </div>
          ),
        }))}
        pagination={{
          showSizeChanger: true,
        }}
      ></Table>
      <Modal
        title={isCheck ? 'Edit Room' : 'Add New Room'}
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
      </Modal>
    </Content>
  );
};

export default Room;

