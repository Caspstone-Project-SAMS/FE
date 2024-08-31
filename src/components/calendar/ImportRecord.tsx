import React, { useCallback, useEffect } from 'react';
import { Content, Header } from 'antd/es/layout/layout';
import { Modal, Select, Space, Typography } from 'antd';
import { CalendarService } from '../../hooks/Calendar';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ScheduleRecordResult } from '../../models/calendar/Schedule';

interface HomeCalendarProps {
  isModalVisible: boolean;
  handleOk: () => void;
  handleCancel: () => void;
}

const ImportRecord: React.FC<HomeCalendarProps> = ({
  isModalVisible,
  handleOk,
  handleCancel,
}) => {
  const userId = useSelector((state: RootState) => state.auth.userID);
  const [scheduleRecord, setScheduleRecord] = React.useState<ScheduleRecordResult[]>([]);


  const getAllScheduleRecords = useCallback(async () => {
    try {
      const response = await CalendarService.getScheduleRecord(userId as string);
      setScheduleRecord(response?.result || []);
      return response;
    } catch (err) {
      console.log(err);
    }
  }, [userId]);

  useEffect(() => {
    getAllScheduleRecords();
  }, [getAllScheduleRecords]);

  return (
    <>
      <Modal
        title="Import Schedule Record"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {scheduleRecord?.map((item, index) => (
          <div key={index}>
            {item.title}
          </div>
        ))}
      </Modal>
    </>
  );
};

export default ImportRecord;
