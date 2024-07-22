import { Content } from "antd/es/layout/layout";
import React from "react";
import styles from './Class.module.less'
import New from "./New";

const Class: React.FC = () => {
  return (
    <Content className={styles.content}>
      <New />
    </Content>
  );
};

export default Class;
