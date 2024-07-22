import { Content } from 'antd/es/layout/layout';
import React, { useState } from 'react';
import styles from './PageHeader.module.less';
import { Button, Row, Space, Typography, Modal, message, Input } from 'antd';
import { FaPlus } from 'react-icons/fa6';
import { InboxOutlined } from '@ant-design/icons';
import Dragger from 'antd/es/upload/Dragger';
import type { UploadProps } from 'antd';

const props: UploadProps = {
  name: 'file',
  multiple: true,
  action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
  onChange(info) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};

interface PageHeaderAdminProps {
  title: string;
}

const PageHeaderAdmin: React.FC<PageHeaderAdminProps> = ({ title }) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setOpen(false);
    }, 3000);
  };
  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <Content>
      <div className={styles.header}>
        <div>
          <Row>
            <Typography.Text className={styles.textHeader}>
              {title}
            </Typography.Text>
          </Row>
          <Row>
            <Typography.Text className={styles.text}>
              Home
              {title === 'student'
                ? ' / Account'
                : title === 'teacher'
                ? ' / Account'
                : null}{' '}
              /{' '}
              <Typography.Text className={styles.pageTextPosition}>
                {title}
              </Typography.Text>
            </Typography.Text>
          </Row>
        </div>
        <Space className={styles.headerRight}>
          {title === 'attendance' ? (
            <div></div>
          ) : (
            <Button onClick={showModal} className={styles.centeredButton}>
              <FaPlus style={{ fontSize: 15 }} />
              <p className={styles.btnText}>Import Excel</p>
            </Button>
          )}

          <Modal
            open={open}
            title={
              <div className={styles.firstTitle}>
                {title}
              </div>
            }
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>,
              <Button
                key="submit"
                type="primary"
                loading={loading}
                onClick={handleOk}
                style={{ width: 150 }}
              >
                Save
              </Button>,
            ]}
          >
            <Row style={{ marginBottom: 20, marginTop: 20 }}>
              <p className={styles.modalTitle}>Title</p>
              <br />
              <Input placeholder="Name the file"></Input>
            </Row>
            <p className={styles.modalTitle}>Excel</p>
            <Dragger {...props}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag file to this area to upload
              </p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibited from
                uploading company data or other banned files.
              </p>
            </Dragger>
          </Modal>
        </Space>
      </div>
    </Content>
  );
};

export default PageHeaderAdmin;
