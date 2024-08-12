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
  Spin,
  Checkbox,
} from 'antd';
import styles from './ScheduleImport.module.less';
import { Link } from 'react-router-dom';
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
import { ScheduleImageResponse } from '../../models/schedule/ScheduleImageResponse';
import MessageCard from '../../components/excel/messageCard/MessageCard';

const { Text, Title } = Typography

type Message = {
  message: string
  type: 'warning' | 'error' | 'success',
}

const ScheduleImport: React.FC = () => {

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const [semester, setSemester] = useState<Semester[]>([]);
  const [semesterId, setSemesterId] = useState<number | null>(null);
  const [RecommendationRate, setRecommendationRate] = useState(70);
  const [date, setDate] = useState<ScheduleDate[]>([]);
  const [slot, setSlot] = useState<ScheduleSlot[]>([]);
  const [schedule, setSchedule] = useState<ScheduleImage | undefined>(undefined);

  const [isSubmitAble, setIsSubmitAble] = useState<boolean>(false);
  const [onShowResult, setOnShowResult] = useState<boolean>(false);
  const [isImportEntireSemester, setIsImportEntireSemester] = useState<boolean>(false)
  const [resultImport, setResultImport] = useState<{ title: string, isSuccess: boolean }>({ title: '', isSuccess: false });
  const [errLogs, setErrLogs] = useState<Message[]>([]);
  const [warningLogs, setWarningLogs] = useState<Message[]>([]);
  const [successLogs, setSuccessLogs] = useState<Message[]>([]);

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

  const resetFields = () => {
    setRecommendationRate(70);
    setIsSubmitAble(false);
    setSchedule(undefined)
    setDate([]);
    setSlot([]);

    setImageFile(null)
    setImagePreview('')
    //after submit to system
    setOnShowResult(false);
    setSuccessLogs([]);
    setWarningLogs([]);
    setErrLogs([]);
  };

  const formatString = (type: 'warning' | 'error' | 'success', message: string): Message => {
    return {
      type: type,
      message: message,
    }
  }

  const handleResponseImportByImage = (response: ScheduleImageResponse) => {
    try {
      console.log('This is response ', response);
      const { isSuccess, title, errors, importedEntities, errorEntities } = response;

      const importedList = importedEntities.map(item => formatString('success', `${item.classCode}-slot ${item.slotNumber}-date: ${item.date}`))
      const errorList = errorEntities.map(item => {
        let errItem = item.errorEntity.classCode + ' ';
        item.errors.map(about => errItem = errItem + `${about}\n`)

        return formatString('error', errItem)
      })
      // console.log('This is importedList ', importedList);
      // console.log('This is errorList ', errorList);

      setOnShowResult(true);
      setResultImport({ title: title ? title : '', isSuccess: isSuccess ? isSuccess : false });
      setSuccessLogs(importedList ? importedList : []);
      setErrLogs(errorList ? errorList : []);
    } catch (error) {
      message.info('Error occure when formatting image, please try again later.')
    }
  }

  const getAllSmester = async () => {
    const response = await CalendarService.getAllSemester();
    setSemester(response || []);
  };

  const handleCreatePreview = async () => {
    if (!imageFile) {
      message.error('Please upload an image file first.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const response = ScheduleImageService.previewScheduleImage({
        Image: imageFile,
        UserId: UserId!,
        RecommendationRate: 70
      });

      response.then(
        data => {
          setSchedule(data || undefined);
          setDate(data?.result.dates || []);
          setSlot(data?.result.slots || []);
          console.log('Upload successful:', data);
          setIsSubmitAble(true);
        }
      ).catch(err => {
        message.error(
          err.message || 'An unexpected error occurred',
        );
      }).finally(() => {
        setLoading(false);
      })
    }, 420)
  };

  const handleSubmit = async () => {
    if (schedule && schedule.result) {
      const result = {
        UserID: UserId,
        ApplyToSemester: isImportEntireSemester,
        ...schedule.result
      }
      const promise = await CalendarService.importSchedulesByImg(result);
      handleResponseImportByImage(promise);
    }
  }

  const uploadProps = {
    beforeUpload: (file: any) => {
      setImageFile(file);
      handleReadImg({ file })
      return false;
    },
    onChange: handleUploadChange,
    maxCount: 1,
  };

  const handleReadImg = ({ file }) => {
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  useEffect(() => {
    getAllSmester();
    setIsSubmitAble(false);
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
        {/* Showing log after submit */}
        {
          onShowResult ? (
            <div className={styles.fapInfoLeft}>
              <Title level={3}>Result: {String(resultImport.isSuccess)}</Title>
              <div>
                {
                  successLogs.length > 0 && <MessageCard props={successLogs} key={'success_logs'} />
                }
                {
                  errLogs.length > 0 && <MessageCard props={errLogs} key={'err_logs'} />
                }
              </div>
              <div style={{ width: '100%' }}>
                <Button
                  onClick={() => resetFields()}
                  style={{ width: '100%' }} type='primary'>
                  Import Again
                </Button>
              </div>
            </div>
          ) : (
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
              {
                isSubmitAble && (
                  <Checkbox
                    checked={isImportEntireSemester}
                    onChange={() => { setIsImportEntireSemester(!isImportEntireSemester) }}
                    style={{ margin: '20px 0 10px' }}
                  >
                    <b>Import for ENTIRE Semester</b>
                  </Checkbox>
                )
              }

              {/* <p className={styles.createClassTitle} style={{ marginTop: '10px' }}>Semester Code</p> */}
              {/* <Select
                placeholder="Semester Code"
                value={semesterId}
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
                style={{ marginBottom: '26px' }}
              /> */}
              {
                isSubmitAble ? (
                  <>
                    <Button
                      className={styles.btn}
                      onClick={handleSubmit} style={{ margin: '0px 0px 10px' }} type="primary">
                      Import into system
                    </Button>

                    <Button
                      danger
                      type='dashed'
                      onClick={() => { resetFields() }}
                      className={styles.btn}
                    >
                      Clear Data
                    </Button>
                  </>
                ) : (
                  <Spin
                    spinning={loading}
                  >
                    <Button
                      className={styles.btn}
                      onClick={handleCreatePreview} style={{ marginTop: 20 }} type="primary">
                      Preview data
                    </Button>
                  </Spin>
                )
              }
            </div>
          )
        }

        <div className={styles.fapInfoRight}>
          <Image
            height={'100%'}
            src={imagePreview ? imagePreview : standbyImg}
          />
        </div>
      </div>
      {
        schedule && schedule.result ? (
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <table className={styles.borderedTable}
              style={onShowResult ? { width: '70%', transition: 'width 0.8s ease-in-out' } : {}}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: 'left', width: 'fit-content' }}>
                    <div>
                      {schedule?.result.year}
                    </div>
                    <div>
                      {schedule.result.semesterFound === true ? (`Semester: ${schedule.result.semesterCode}`) : (
                        `Semester: Not found`
                      )}
                    </div>
                  </th>
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
          </div>
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
