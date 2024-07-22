import React from 'react';
import styles from './index.module.less';

import { Button } from 'antd';
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
}) => {
  return (
    <Button
      className={styles.btnDecorationCtn}
      disabled={isActiveModule || !moduleID}
      onClick={() => {
        setIsActiveModule(true);
        activeModuleCheckAttendance(moduleID, sessionID);
      }}
    >
      <div className={styles.btnInfo}>
        {btnTitle ? <Title level={4}>{btnTitle}</Title> : ''}
        <span className={styles.btnFuncName}>{btnFuncName}</span>
      </div>
      <hr className={styles.verticalLine} />
      <div className={styles.iconDecorCtn}>
        <img src={imgDecor} className={styles.iconDecor} />
      </div>
    </Button>
  );
};

export default BtnDecoration;
