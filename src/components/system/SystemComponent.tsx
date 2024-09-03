import React, { useCallback, useEffect, useState } from 'react';
import { Content, Header } from 'antd/es/layout/layout';
import {
  Button,
  Card,
  Col,
  InputNumber,
  message,
  Row,
  Select,
  Space,
  Typography,
} from 'antd';
import styles from './System.module.less';
import { System } from '../../models/system/System';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import { clearSystemMessages, updateSystem } from '../../redux/slice/System';
import { SystemService } from '../../hooks/System';

// interface SystemComponentProps {
//   systemConfig: System | undefined;
// }
const SystemComponent: React.FC = () => {
  const [systemConfig, setSystemConfig] = useState<System>();

  const failMessage = useSelector(
    (state: RootState) => state.system.systemDetail,
  );
  const successMessage = useSelector(
    (state: RootState) => state.system.message,
  );

  const dispatch = useDispatch();

  const [RevertableDurationInHours, setRevertableDurationInHours] = useState<
    number | undefined
  >(0);
  const [ClassCodeMatchRate, setClassCodeMatchRate] = useState<
    number | undefined
  >(0);
  const [SemesterDurationInDays, setSemesterDurationInDays] = useState<
    number | undefined
  >(0);

  const fectSystemConfig = useCallback(async () => {
    try {
      const result = await SystemService.getAllSystem();
      setSystemConfig(result || undefined);
      setRevertableDurationInHours(result?.result.revertableDurationInHours);
      setClassCodeMatchRate(result?.result.classCodeMatchRate);
      setSemesterDurationInDays(result?.result.semesterDurationInDays);
    } catch (error) {
      console.error('Failed to fetch system configuration:', error);
    }
  }, [setSystemConfig]);

  useEffect(() => {
    fectSystemConfig();
  }, [fectSystemConfig]);

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage.title);
      setRevertableDurationInHours(
        successMessage.result.revertableDurationInHours,
      );
      setClassCodeMatchRate(successMessage.result.classCodeMatchRate);
      setSemesterDurationInDays(successMessage.result.semesterDurationInDays);
      dispatch(clearSystemMessages());
    }
    if (failMessage && failMessage.errors) {
      message.error(`${failMessage.errors}`);
      dispatch(clearSystemMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const systemDetails = [
    // { label: 'System Configuration', value: systemConfig?.result.systemConfigurationId },
    {
      label: 'Revertable Duration In Hours',
      value: systemConfig?.result.revertableDurationInHours,
    },
    {
      label: 'Class Code Match Rate',
      value: systemConfig?.result.classCodeMatchRate,
    },
    {
      label: 'Semester Duration In Days',
      value: systemConfig?.result.semesterDurationInDays,
    },
    // { label: 'Slot Duration In Mins', value: systemConfig?.result.semesterDurationInDays },
  ];

  const updateSystemConfig = async (
    RevertableDurationInHours: number,
    ClassCodeMatchRate: number,
    SemesterDurationInDays: number,
  ) => {
    const arg = {
      RevertableDurationInHours: RevertableDurationInHours,
      ClassCodeMatchRate: ClassCodeMatchRate,
      SemesterDurationInDays: SemesterDurationInDays,
    };
    await dispatch(updateSystem(arg) as any);
  };

  const handleSubmit = async () => {
    await updateSystemConfig(
      RevertableDurationInHours!,
      ClassCodeMatchRate!,
      SemesterDurationInDays!,
    );
    fectSystemConfig();
  };

  return (
    <Content className={styles.homeSystemCtn}>
      <Row>
        <Col span={12}>
          <Card className={styles.card1}>
            <div style={{ marginBottom: 30 }}>
              <div className={styles.detailsHeader}>System Details</div>
            </div>
            {systemDetails.map((system, i) => (
              <div key={`info_${i}`}>
                <hr
                  style={{
                    borderColor: '#e6e7e9',
                    borderWidth: 0.5,
                  }}
                />

                <Row className={styles.rowDetails}>
                  <Col span={14}>
                    <div style={{ fontWeight: 500 }}>{system.label}</div>
                  </Col>
                  <Col span={10}>
                    {system.label === 'Class status' ? (
                      <div
                        // className={checkingStatus(detail.value)}
                        style={{ fontWeight: 500 }}
                      >
                        {system.value}
                      </div>
                    ) : (
                      <div style={{ fontWeight: 500, color: '#667085' }}>
                        {system.value}
                      </div>
                    )}
                  </Col>
                </Row>
              </div>
            ))}
          </Card>
        </Col>
      </Row>
      <Row style={{ width: '100%' }}>
        <Col span={24} style={{ marginTop: 20 }}>
          <b className={styles.systemSettingTitle}>System Configuration</b>
          <hr className={styles.lines} />
          <div className={styles.settingItem}>
            <div>
              <span className={styles.settingLabel}>
                Revert Able Duration (hours)
              </span>
              <br />
              <InputNumber
                placeholder="hours"
                value={RevertableDurationInHours}
                onChange={(value) => {
                  if (value !== null) {
                    setRevertableDurationInHours(value);
                  }
                }}
                min={0}
                step={1}
                className={styles.inputNumber}
              />{' '}
              {' hours'}
              <p className={styles.suggestText}>abc</p>
            </div>
          </div>
          <div className={styles.settingItem}>
            <div>
              <span className={styles.settingLabel}>
                Class Code Match Rate (%)
              </span>
              <br />
              <InputNumber
                placeholder="rates"
                value={ClassCodeMatchRate}
                onChange={(value) => {
                  if (value !== null) {
                    setClassCodeMatchRate(value);
                  }
                }}
                min={0}
                step={1}
                className={styles.inputNumber}
              />{' '}
              {' %'}
              <p className={styles.suggestText}>abc</p>
            </div>
          </div>
          <div className={styles.settingItem}>
            <div>
              <span className={styles.settingLabel}>
                Semester Duration (days)
              </span>
              <br />
              <InputNumber
                placeholder="days"
                value={SemesterDurationInDays}
                onChange={(value) => {
                  if (value !== null) {
                    setSemesterDurationInDays(value);
                  }
                }}
                min={0}
                step={1}
                className={styles.inputNumber}
              />{' '}
              {' days'}
              <p className={styles.suggestText}>abc</p>
            </div>
          </div>
        </Col>
        <Col span={24} style={{ marginTop: 40, textAlign: 'right' }}>
          <Button
            onClick={handleSubmit}
            type="primary"
            className={styles.submitButton}
          >
            Submit
          </Button>
        </Col>
      </Row>
    </Content>
  );
};

export default SystemComponent;
