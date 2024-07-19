import styles from './index.module.less'
import '../../../assets/styles/styles.less'

import React, { useState } from 'react'
import ContentHeader from '../../../components/header/contentHeader/ContentHeader'
import Excel from '../../../components/excel/Excel'
import { Button, Input, Modal } from 'antd'
import { HiMagnifyingGlass } from "react-icons/hi2";
import { UserOutlined } from '@ant-design/icons'

const AdminSchedule = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className={styles.adminScheduleCtn}>
            <div className='align-center-between'>
                <ContentHeader
                    contentTitle="Schedule"
                    previousBreadcrumb={'Home / '}
                    currentBreadcrumb={'Schedule'}
                    key={''}
                />
                <Excel fileType='schedule' />
            </div>
            <div className={styles.modalCtn}>
                <Button type="primary" onClick={showModal}>
                    Open Modal
                </Button>
                <Modal
                    title="Basic Modal" open={true} onOk={handleOk} onCancel={handleCancel}>
                    <div className={styles.searchBox}>
                        <Input
                            className={styles.searchInput}
                            placeholder="Email, phone, department"
                            prefix={
                                <HiMagnifyingGlass size={20} />
                            }
                            onChange={e => setSearchValue(e.target.value)}
                        />

                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default AdminSchedule