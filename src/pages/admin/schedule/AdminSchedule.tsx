import styles from './index.module.less'
import '../../../assets/styles/styles.less'

import React, { useEffect, useState } from 'react'
import ContentHeader from '../../../components/header/contentHeader/ContentHeader'
import Excel from '../../../components/excel/Excel'
import { Avatar, Button, Divider, Dropdown, Image, Input, MenuProps, Modal, Typography } from 'antd'
import { HiMagnifyingGlass } from "react-icons/hi2";
import { FaAngleDown } from "react-icons/fa6";
import { FiFilter } from "react-icons/fi";
import { EmployeeService } from '../../../hooks/Employee'
import { Employee, EmployeeDetail } from '../../../models/employee/Employee'
import MyCalendar from '../../../components/calendar/MyCalendar'

const { Text, Title } = Typography;

const AdminSchedule = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [lecturerList, setLecturerList] = useState<EmployeeDetail[]>([])
    const [selectedLecturer, setSelectedLecturer] = useState<EmployeeDetail | undefined>()

    const [searchValue, setSearchValue] = useState<string>('');
    const [searchCategory, setSearchCategory] = useState<'Email' | 'Phone' | 'Department'>('Email');

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

    const handleSearch = async () => {
        let lecturers: Employee;
        try {
            switch (searchCategory) {
                case 'Email':
                    lecturers = await EmployeeService.searchByParams(searchValue, '', '');
                    setLecturerList(lecturers.result)
                    break;
                case 'Department':
                    lecturers = await EmployeeService.searchByParams('', '', searchValue);
                    setLecturerList(lecturers.result)
                    break;
                case 'Phone':
                    lecturers = await EmployeeService.searchByParams('', searchValue, '');
                    setLecturerList(lecturers.result)
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.log("Unexpected errors occured");
        }
    }

    useEffect(() => {
        setTimeout(() => {
            const lecturers = EmployeeService.get10Employee();

            lecturers.then(data => {
                console.log("lecturers ", data);
                if (data) {
                    setLecturerList(data.result)
                }
            }).catch(err => {
                console.log("Error occured when get employee");
            })
        }, 1200);
    }, [])

    // useEffect(() => {
    // console.log("Selected new ", selectedLecturer);
    //     console.log("List changed ", lecturerList);

    // }, [lecturerList])

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
                <Text className={styles.titleTxt}>Lecturer: </Text>
                {
                    selectedLecturer ? (
                        <div className={styles.selectedLecturer}>
                            <EmployeeCard
                                department={selectedLecturer.department}
                                email={selectedLecturer.email}
                                name={selectedLecturer.displayName}
                                key={`selected_lec`}
                                avatar={selectedLecturer.avatar ? selectedLecturer.avatar : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1718108394~exp=1718111994~hmac=133f803dd1192a01c2db5decc8c445321e7376559b5c19f03028cc2ef0c73d4a&w=740'}
                            />
                            <Button
                                type="text"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                }}
                                onClick={() => showModal()}
                            >
                                <FaAngleDown size={18} />
                            </Button>
                        </div>
                    ) : (
                        <div className={styles.selectedLecturer}>
                            <span className={styles.blurTxt}>Not selected</span>
                            <Button
                                type="text"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginRight: '2px'
                                }}
                                onClick={() => showModal()}
                            >
                                <FaAngleDown size={18} />
                            </Button>
                        </div>
                    )
                }

                <Modal
                    title="Search Lecturer"
                    open={isModalOpen}
                    onOk={handleOk}
                    onCancel={handleCancel}
                    footer={
                        <>
                            <Button
                                key="back"
                                onClick={() => {
                                    handleCancel();
                                }}
                            >
                                Close
                            </Button>
                        </>
                    }
                >
                    <div className={styles.searchBox}>
                        <Input
                            className={styles.searchInput}
                            placeholder="Email, phone, department"
                            prefix={
                                <HiMagnifyingGlass
                                    size={20}
                                    style={{ marginRight: '6px' }}
                                />
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
                                    className={styles.filterBtn}
                                    onClick={() => {
                                        handleSearch()
                                    }}
                                >
                                    <Text style={{ fontSize: '1rem', color: '#FFF' }}>
                                        Search
                                    </Text>
                                </Button>
                            </div>
                        </div>
                        <Divider style={{ margin: '12px 0 24px' }} />

                        <div className={styles.searchListCtn}>
                            {
                                lecturerList.length > 0 ? lecturerList.map((item, index) => (
                                    <>

                                        <Button
                                            style={{
                                                width: '100%',
                                                height: 'auto',
                                            }}
                                            onClick={() => {
                                                setSelectedLecturer(item);
                                                handleCancel();
                                            }}>
                                            <EmployeeCard
                                                department={item.department}
                                                email={item.email}
                                                name={item.displayName}
                                                key={`lec_${index}`}
                                                avatar={item.avatar ? item.avatar : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1718108394~exp=1718111994~hmac=133f803dd1192a01c2db5decc8c445321e7376559b5c19f03028cc2ef0c73d4a&w=740'}
                                            />
                                        </Button>

                                    </>
                                ))
                                    : (
                                        <Text
                                            style={{
                                                color: '#FBBF24',
                                                fontSize: '1rem',
                                                textAlign: 'center',
                                                width: '100%',
                                                display: 'block'
                                            }}
                                        >
                                            Lecturers not found!
                                        </Text>
                                    )
                            }
                        </div>
                    </div>
                </Modal>
            </div>
            <div style={{ height: '95vh' }}>
                <MyCalendar LECTURER_ID={selectedLecturer ? selectedLecturer.id : undefined} />
            </div>
        </div>
    )
}

export default AdminSchedule;

type CardProps = {
    avatar: string,
    name: string,
    email: string;
    department: string,
}
const EmployeeCard: React.FC<CardProps> = ({ avatar, department, email, name }) => {

    return (
        <div className={styles.employeeCardCtn}>
            <div className={styles.imageCtn}>
                <Avatar
                    size={75}
                    src={
                        <Image
                            preview={false}
                            width={50}
                            src={avatar ? avatar : 'https://img.freepik.com/free-vector/illustration-businessman_53876-5856.jpg?t=st=1718108394~exp=1718111994~hmac=133f803dd1192a01c2db5decc8c445321e7376559b5c19f03028cc2ef0c73d4a&w=740'}
                        />
                    }
                />
            </div>
            <div className={styles.employeeDetailCtn}>
                <div className={styles.left}>
                    <Text className={styles.mainTxt}>{name}</Text>
                    <Text className={styles.subTxt}>{email}</Text>
                </div>
                <div className={styles.right}>
                    <Text>Department</Text>
                    <Text>
                        {department}
                    </Text>
                </div>
            </div>
        </div>
    )
}