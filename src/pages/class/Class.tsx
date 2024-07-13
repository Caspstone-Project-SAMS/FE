import { Content } from "antd/es/layout/layout";
import React from "react";
import styles from './Class.module.less'
import ClassTable from "../../components/classtable/ClassTable";
import ContentHeader from "../../components/header/contentHeader/ContentHeader";

const Class: React.FC = () => {
  return (
    <Content className={styles.content}>
      <ContentHeader contentTitle="Class" previousBreadcrumb="Home / " currentBreadcrumb="Class" key={'class-header'} />

      <ClassTable />
    </Content>
  );
};

export default Class;
