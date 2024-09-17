import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  List,
  message,
  Modal,
} from 'antd';
import { CalendarService } from '../../hooks/Calendar';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ScheduleRecordResult } from '../../models/calendar/Schedule';
import {
  clearScheduleRecordMessages,
  revertScheduleImport,
} from '../../redux/slice/ScheduleRecord';
import { GoHistory } from 'react-icons/go';

const ImportRecord: React.FC= () => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const userId = useSelector((state: RootState) => state.auth.userID);
  const [scheduleRecord, setScheduleRecord] = React.useState<
    ScheduleRecordResult[]
  >([]);
  const dispatch = useDispatch();

  const failMessage = useSelector(
    (state: RootState) => state.scheduleRecord.scheduleRecordDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.scheduleRecord.message,
  );

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage.title);
      setIsModalVisible(false);
      dispatch(clearScheduleRecordMessages());
    }
    if (failMessage && failMessage.data.data) {
      message.error(`${failMessage.data.data.errors}`);
      dispatch(clearScheduleRecordMessages());
    }
  }, [successMessage, failMessage, dispatch, setIsModalVisible]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const getAllScheduleRecords = useCallback(async () => {
    try {
      const response = await CalendarService.getScheduleRecord(
        userId as string,
      );
      setScheduleRecord(response?.result || []);
      return response;
    } catch (err) {
      console.log(err);
    }
  }, [userId]);

  useEffect(() => {
    getAllScheduleRecords();
  }, [getAllScheduleRecords]);

  const undoImport = async (importSchedulesRecordID: number) => {
    const arg = {
      importSchedulesRecordID: importSchedulesRecordID,
    };
    await dispatch(revertScheduleImport(arg) as any);
  };

  const convertTimestamp = (timestamp: any) => {
    const date = new Date(timestamp);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const reversedScheduleRecord = [...scheduleRecord].reverse();

  return (
    <>
      <Button
        onClick={showModal}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
        size="large"
        icon={<GoHistory size={18} />}
      >
        Import Record
      </Button>
      <Modal
        title="Import Schedule Record"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {/* {scheduleRecord?.map((item, index) => (
          <div key={index}>
            {item.title}
            <Button onClick={() => undoImport(item.importSchedulesRecordID)}>
              Undo
            </Button>
          </div>
        ))} */}
        <List
          className="demo-loadmore-list"
          // loading={initLoading}
          itemLayout="horizontal"
          // loadMore={loadMore}
          dataSource={reversedScheduleRecord}
          style={{ height: '100%', overflowY: 'auto', overflowX: 'hidden' }}
          renderItem={(item) => (
            <List.Item
              actions={[
                item.isReversible && (
                  <a
                    key="list-loadmore-edit"
                    onClick={() => undoImport(item.importSchedulesRecordID)}
                  >
                    undo
                  </a>
                ),
              ]}
            >
              {/* <Skeleton avatar title={false} loading={item.loading} active> */}
              <List.Item.Meta
                // avatar={<Avatar src={item.picture.large} />}
                title={item.title}
                description={convertTimestamp(item.recordTimestamp)}
              />
              {/* <div>content</div> */}
              {/* </Skeleton> */}
            </List.Item>
          )}
        />
      </Modal>
    </>
  );
};

export default ImportRecord;
