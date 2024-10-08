import React from 'react';
import styles from './index.module.less';

import { Button, Popconfirm, Progress } from 'antd';
import Title from 'antd/es/typography/Title';

type props = {
  btnTitle: string;
  btnFuncName: string;
  imgDecor: string;
  isActiveModule: boolean;
  moduleID: number;
  sessionID: number;
  setIsActiveModule: any;
  activeModuleCheckAttendance: any;
  preparationProgress: number;
  isCheckAttendance: boolean;
  status: string;
};

const BtnDecoration: React.FC<props> = ({
  btnFuncName,
  btnTitle,
  imgDecor,
  isActiveModule,
  moduleID,
  sessionID,
  setIsActiveModule,
  activeModuleCheckAttendance,
  preparationProgress,
  isCheckAttendance,
  status,
}) => {
  return (
    <Popconfirm
      title="Are you sure you want to activate this module? This will delete all attendances data for this module"
      onConfirm={() => {
        setIsActiveModule(true);
        activeModuleCheckAttendance(moduleID, sessionID);
      }}
      okText="Yes"
      cancelText="No"
    >
      <Button
        className={styles.btnDecorationCtn}
        disabled={
          isActiveModule || !moduleID || !sessionID || status === 'fail'
        }
        // onClick={() => {
        //   setIsActiveModule(true);
        //   activeModuleCheckAttendance(moduleID, sessionID);
        // }}
      >
        <div className={styles.btnInfo}>
          {btnTitle ? <Title level={4}>{btnTitle}</Title> : ''}
          <span className={styles.btnFuncName}>{btnFuncName}</span>
        </div>
        <div>
          {preparationProgress > 0 && (
            <Progress type="circle" percent={preparationProgress} size={60} />
          )}
        </div>
        <hr className={styles.verticalLine} />
        <div className={styles.iconDecorCtn}>
          <img src={imgDecor} className={styles.iconDecor} />
        </div>
      </Button>
    </Popconfirm>
  );
};

export default BtnDecoration;
