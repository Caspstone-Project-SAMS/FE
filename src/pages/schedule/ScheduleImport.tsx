import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import {
  Button,
  Upload,
  message,
  Select,
  Input,
  Image,
  Typography,
  Tooltip,
} from 'antd';
import styles from './ScheduleImport.module.less';
import { Link, useNavigate } from 'react-router-dom';
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
import standbyImg from '../../assets/imgs/logo-removebg-preview.png'
import { BiArrowBack } from "react-icons/bi";

const { Text, Title } = Typography

const ScheduleImport: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [reload, setReload] = useState(0);

  const [semester, setSemester] = useState<Semester[]>([]);
  const [SemesterId, setSemesterId] = useState<number | null>(null);
  const [RecommendationRate, setRecommendationRate] = useState(70);
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

  const resetModalFields = () => {
    setRecommendationRate(70);
    setSemesterId(null);
    setImageFile(null);
  };

  const getAllSmester = async () => {
    const response = await CalendarService.getAllSemester();
    setSemester(response || []);
    console.log("Res semester ", response);
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
    } catch (error: any) {
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
      handleReadImg({ file })
      console.log("This is file ", file);
      return false;
    },
    onChange: handleUploadChange,
    maxCount: 1,
  };

  const handleReadImg = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Set the image URL to the loaded image
      setImagePreview(reader.result as string);
      console.log("helo this is red", reader.result);
    };
    reader.readAsDataURL(file);
    console.log("Read asdata url ", reader.readAsDataURL(file));
  }

  useEffect(() => {
    getAllSmester();
  }, [])


  return (
    <Content className={styles.slotContent}>

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
        <Link to={'/calendar'} style={{ display: 'flex', alignItems: 'center' }}>
          <BiArrowBack size={20} style={{ cursor: 'pointer' }} onClick={() => { }} />
        </Link>
        <Title level={3} style={{ margin: '0 0 0 12px' }}>Import FAP Image</Title>
      </div>

      <div className={styles.fapInfoCtn}>
        <div className={styles.fapInfoLeft}>
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
            <Text style={{ fontSize: '1rem' }}>Photo: {' '}</Text>
            <Button
              style={{ margin: '8px' }}
              icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>

          <p className={styles.createClassTitle}>Semester Code</p>
          <Select
            placeholder="Semester Code"
            value={SemesterId}
            onChange={(value) => setSemesterId(value)}
            style={{ marginBottom: '10px', width: '100%' }}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              option?.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            {semester.map((sem) => (
              <Select.Option key={sem.semesterID} value={sem.semesterID}>
                {sem.semesterCode}
              </Select.Option>
            ))}
          </Select>
          <Tooltip placement="right" title={'Precise percent return when process image '}>
            <p className={styles.createClassTitle}>Rate</p>
          </Tooltip>
          <Input
            type="number"
            placeholder={"Rate"}
            value={RecommendationRate}
            onChange={(e) => {
              const value = parseFloat(e.target.value);
              if (!isNaN(value)) {
                setRecommendationRate(value);
              } else {
                setRecommendationRate(70);
              }
            }}
            style={{ marginBottom: '10px' }}
          />
          <Button onClick={handleCreate} style={{ marginTop: 16 }} type="primary">
            Create
          </Button>
        </div>
        <div className={styles.fapInfoRight}>
          <Image
            height={'100%'}
            src={imagePreview ? imagePreview : standbyImg}
          />
        </div>
      </div>
      {
        schedule && schedule.result ? (
          <table className={styles.borderedTable}>
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
                  <td><b>Slot {slot.slotNumber}</b></td>
                  {slot.adjustedClassSlots.map((classSlot, classSlotIndex) => (
                    <td key={classSlotIndex}>
                      {classSlot ? classSlot.classCode : '-'}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className={styles.borderedTable}>
            <thead>
              <tr>
                <th>Preview table</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ textAlign: 'center' }}>
                <td>Import image to view result data</td>
              </tr>
            </tbody>
          </table>
        )
      }
    </Content>
  );
};

export default ScheduleImport;
