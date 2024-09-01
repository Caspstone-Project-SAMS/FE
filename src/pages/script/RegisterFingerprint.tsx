import { Button, Card, Col, Input, Layout, message, Row, Table } from 'antd';
import { Content } from 'antd/es/layout/layout';
import React, { useEffect, useState } from 'react';
import ContentHeader from '../../components/header/contentHeader/ContentHeader';
import { useNavigate } from 'react-router-dom';
import styles from './Script.module.less';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { clearScriptMessages, resgisterAllFingerprint } from '../../redux/slice/Script';

const { Header: AntHeader } = Layout;

const RegisterFingerprint: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector(
    (state: RootState) => state.auth.userDetail?.token ?? '',
  );

  const failMessage = useSelector(
    (state: RootState) => state.script.message,
  );
  const successMessage = useSelector(
    (state: RootState) => state.script.scriptDetail,
  );

  console.log('fsedf', successMessage);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage.title);

      dispatch(clearScriptMessages());
    }
    if (failMessage) {
      message.error(`${failMessage.title}`);
      dispatch(clearScriptMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const handleRegisterAllFingerprints = async (token: string) => {
    const arg = {
      token: token,
    }
    await dispatch(resgisterAllFingerprint(arg) as any);
  }
  return (
    <Content className={styles.accountScriptContent}>
      <ContentHeader
        contentTitle="Register Fingerprint"
        previousBreadcrumb={'Script / '}
        currentBreadcrumb={'Register Fingerprint'}
        key={''}
      />
    <Button type='primary' onClick={() => handleRegisterAllFingerprints(token)}>Register All Fingerprint</Button>
    </Content>
  );
};

export default RegisterFingerprint;