import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import {
  Button,
  Modal,
  Upload,
  message,
  Select,
  Input,
} from 'antd';
import styles from '../../pages/admin/slot/Slot.module.less';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';
import { useNavigate } from 'react-router-dom';
import { UploadOutlined } from '@ant-design/icons';
import { CalendarService } from '../../hooks/Calendar';
import { Semester } from '../../models/Class';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ScheduleImageService } from '../../hooks/ScheduleImage';
import {
  ScheduleDate,
  ScheduleImage,
  ScheduleSlot,
} from '../../models/calendar/ScheduleImage';

const ScheduleImport: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  const [semester, setSemester] = useState<Semester[]>([]);
  const [SemesterId, setSemesterId] = useState<number | null>(null);
  const [RecommendationRate, setRecommendationRate] = useState(0);
  const [date, setDate] = useState<ScheduleDate[]>([]);
  const [slot, setSlot] = useState<ScheduleSlot[]>([]);
  const [schedule, setSchedule] = useState<ScheduleImage>();

  const UserId = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id,
  );

  const handleUploadChange = (info: any) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  };

  const showUploadModal = () => {
    getAllSmester();
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    resetModalFields();
  };

  const resetModalFields = () => {
    setRecommendationRate(0);
    setSemesterId(null);
    setImageFile(null); 
  };

  const getAllSmester = async () => {
    const response = await CalendarService.getAllSemester();
    setSemester(response || []);
  };

  const handleCreate = async () => {
    if (!imageFile) {
      message.error('Please upload an image file first.');
      return;
    }

    setLoading(true);

    try {
      const response = await ScheduleImageService.importScheduleImage({
        Image: imageFile,
        SemesterId: SemesterId!,
        UserId: UserId!,
        RecommendationRate: RecommendationRate,
      });
      setSchedule(response || undefined);
      setDate(response?.result.dates || []);
      setSlot(response?.result.slots || []);

      console.log('Upload successful:', response);
    } catch (error) {
      // Handle error
      console.error('Upload error:', error.message || error);
      message.error(
        'Upload failed: ' + (error.message || 'An unexpected error occurred'),
      );
    } finally {
      setLoading(false);
      setIsModalVisible(false);
      resetModalFields();
      setReload((prevReload) => prevReload + 1);
    }
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      setImageFile(file); 
      return false; 
    },
    onChange: handleUploadChange,
    maxCount: 1,
  };

  return (
    <Content className={styles.slotContent}>
      <ContentHeader
        contentTitle="Slot"
        previousBreadcrumb={'Home / '}
        currentBreadcrumb={'Slot'}
        key={''}
      />
      <Button onClick={showUploadModal}>import schedule image</Button>
      <Modal
        title="Upload Schedule Image"
        visible={isModalVisible}
        footer={null}
        onCancel={handleCancel}
      >
        <Upload
          {...uploadProps}
          customRequest={async ({ file, onSuccess, onError }: any) => {
            try {
              await new Promise((resolve) => setTimeout(resolve, 1000));
              onSuccess(file);
            } catch (err) {
              onError(err);
            }
          }}
        >
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>

        <p className={styles.createClassTitle}>Semester Code</p>
        <Select
          placeholder="Semester Code"
          value={SemesterId}
          onChange={(value) => setSemesterId(value)}
          style={{ marginBottom: '10px', width: '100%' }}
        >
          {semester.map((sem) => (
            <Select.Option key={sem.semesterID} value={sem.semesterID}>
              {sem.semesterCode}
            </Select.Option>
          ))}
        </Select>
        <p className={styles.createClassTitle}>Rate</p>
        <Input
          type="number" 
          placeholder="Rate"
          value={RecommendationRate}
          onChange={(e) => {
            const value = parseFloat(e.target.value);
            if (!isNaN(value)) {
              setRecommendationRate(value);
            } else {
              setRecommendationRate(0);
            }
          }}
          style={{ marginBottom: '10px' }}
        />
        <Button onClick={handleCreate} style={{ marginTop: 16 }} type="primary">
          Create
        </Button>
      </Modal>
      <table>
        <thead>
          <tr>
            <th>{schedule?.result.year}</th>
            {date.map((date, index) => (
              <th key={index}>{date.dateString}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {slot.map((slot, slotIndex) => (
            <tr key={slotIndex}>
              <td>Slot {slot.slotNumber}</td>
              {slot.adjustedClassSlots.map((classSlot, classSlotIndex) => (
                <td key={classSlotIndex}>
                  {classSlot ? classSlot.classCode : '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Content>
  );
};

export default ScheduleImport;
