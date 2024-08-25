import {
  Button,
  Card,
  Col,
  DatePicker,
  Input,
  Layout,
  message,
  Row,
  Table,
} from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';
import { useNavigate } from 'react-router-dom';
import styles from './Script.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { ScriptService } from '../../hooks/Script';
import {
  clearScriptMessages,
  resetTime,
  setTime,
} from '../../redux/slice/Script';
import { Moment } from 'moment';

const { Header: AntHeader } = Layout;

const ScriptTime: React.FC = () => {
  const [Resource, setResource] = useState<string>('');
  const dispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const failMessage = useSelector((state: RootState) => state.script.message);
  const successMessage = useSelector(
    (state: RootState) => state.script.scriptDetail,
  );

  console.log(failMessage);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage.title);

      dispatch(clearScriptMessages());
    }
    if (failMessage) {
      message.error(`${failMessage.data.message}`);
      dispatch(clearScriptMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const handleResetTime = async (token: string) => {
    const arg = {
      token: token,
    };
    await dispatch(resetTime(arg) as any);
  };

  const handleSetTime = async () => {
    const arg = {
      Resource: Resource,
      token: token,
    };
    await dispatch(setTime(arg) as any);
  };

  const handleDateChange = (date: Moment | null) => {
    if (date) {
      setResource(date.format('YYYY-MM-DD HH:mm:ss'));
    }
  };
  return (
    <Content className={styles.accountScriptContent}>
      <ContentHeader
        contentTitle="Setting Time"
        previousBreadcrumb={'Script / '}
        currentBreadcrumb={'Time'}
        key={''}
      />
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col>
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            onChange={handleDateChange}
            style={{ width: '100%' }}
          />
        </Col>
      </Row>
      <Button style={{marginRight:10}} type='primary' onClick={() => handleSetTime()}>Set Time</Button>
      <Button style={{backgroundColor:'red', color:'white'}} onClick={() => handleResetTime(token)}>Reset Time</Button>
    </Content>
  );
};

export default ScriptTime;
