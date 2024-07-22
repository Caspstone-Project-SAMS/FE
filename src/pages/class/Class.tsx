import { Content } from "antd/es/layout/layout";
import React from "react";
import styles from './Class.module.less'
import New from "./New";

const Class: React.FC = () => {
  return (
    <Content className={styles.content}>
      {/* <ContentHeader contentTitle="Class" previousBreadcrumb="Home / " currentBreadcrumb="Class" key={'class-header'} /> */}

      <New />
    </Content>
  );
};

export default Class;
