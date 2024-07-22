import styles from './index.module.less'
import '../../../assets/styles/styles.less'

import React, { useState } from 'react'
import ContentHeader from '../../../components/header/contentHeader/ContentHeader'
import Excel from '../../../components/excel/Excel'
import { Button, Dropdown, Input, MenuProps, Modal, Typography } from 'antd'
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaAngleDown } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";

const { Text, Title } = Typography;

const AdminSchedule = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchValue, setSearchValue] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<'Email' | 'Phone' | 'Department'>('Email');

    const handleSearch = () => {

    }

    const onClick: MenuProps['onClick'] = ({ key }) => {
        setSearchCategory(key);
    };

    const items: MenuProps['items'] = [
        {
            key: 'Email',
            label: (
                <Text>
                    Email
                </Text>
            ),
        },
        {
            key: 'Phone',
            label: (
                <Text>
                    Phone
                </Text>
            ),
        },
        {
            key: 'Department',
            label: (
                <Text>
                    Department
                </Text>
            ),
        },
    ];

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
                    title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <div className={styles.searchBox}>
                        <Input
                            className={styles.searchInput}
                            placeholder="Email, phone, department"
                            prefix={
                                <HiMagnifyingGlass size={20}
                                    style={{ marginRight: '6px' }} />
                            }
                            onChange={e => setSearchValue(e.target.value)}
                        />
                        <div className={styles.filterBox}>
                            <div className={styles.filterLeftCtn}>
                                <div className={styles.filterItemTxt}>
                                    <FiFilter size={18} />
                                    <Text style={{ fontSize: '1rem' }}>{searchCategory}</Text>
                                </div>
                                <Dropdown
                                    trigger={['click']}
                                    menu={{ items, onClick }}
                                    placement="bottomRight"

                                >
                                    <Button
                                        type="text"
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                        }}
                                    >
                                        <FaAngleDown size={18} />
                                    </Button>
                                </Dropdown>
                            </div>
                            <div className={styles.filterRightCtn}>
                                <Button
                                    type="primary"
                                    className={styles.filterBtn}>
                                    <Text style={{ fontSize: '1rem', color: '#FFF' }}>
                                        Search
                                    </Text>
                                </Button>
                            </div>
                        </div>

                        <div className={styles.searchListCtn}>

                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    )
}

export default AdminSchedule