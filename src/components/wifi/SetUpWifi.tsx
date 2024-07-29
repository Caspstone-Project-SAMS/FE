import { Button, Image, Input, Modal, Steps, theme, Tooltip, Typography } from 'antd'
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { ModuleService } from '../../hooks/Module';
import styles from './index.module.less'
import { EyeInvisibleOutlined, EyeTwoTone, InfoOutlined } from '@ant-design/icons';
import OverviewImg from '../../assets/imgs/setUpWifi/Overview_Img.png'
import ModuleRmBg from '../../assets/imgs/module_rm_bg.png'

const { Text, Title } = Typography

const steps = [
    {
        title: 'Overview',
        content: 'First-content',
    },
    {
        title: 'Change wifi',
        content: 'Second-content',
    },
    {
        title: 'Input',
        content: 'Last-content',
    },
    {
        title: 'Setup',
        content: 'Last-content',
    },
    {
        title: 'Change wifi',
        content: 'Last-content',
    },
];


const SetUpWifi = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [ssid, setSsid] = useState<string>('');
    const [pass, setPass] = useState<string>('');

    //Guide
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const next = () => {
        setCurrent(current + 1);
    };

    const prev = () => {
        setCurrent(current - 1);
    };

    const items = steps.map((item) => ({ key: item.title, title: item.title }));
    const contentStyle: React.CSSProperties = {
        minHeight: '180px',
        maxHeight: '250px',
        textAlign: 'center',
        color: token.colorTextTertiary,
        backgroundColor: token.colorFillAlter,
        borderRadius: token.borderRadiusLG,
        border: `1px dashed ${token.colorBorder}`,
        marginTop: 16,
        padding: '20px',
    };


    const showModal = () => {
        setIsModalOpen(true);
    };

    const showGuideModal = () => {
        setIsGuideModalOpen(true)
    }

    const handleClose = () => {
        setIsModalOpen(false);
    };
    const handleCloseGuideModal = () => {
        setCurrent(0)
        setIsGuideModalOpen(false)
    }
    const handleSetup = () => {
        let isValid = true;
        if (ssid.length === 0) {
            isValid = false;
            toast.error('Wifi name must not be empty!', { duration: 1650 });
        }
        if (pass.length < 8) {
            isValid = false;
            toast.error('Password must contains at least 8 characters!', { duration: 1650 });
        }
        if (isValid) {
            const promise = ModuleService.setUpWifi(ssid, pass);
            promise.then(data => {
                toast.success('Sent to wifi successfully, please check on module!')
            }).catch(err => {
                toast.error('Connect failed, please check wifi name and password again')
            })
        }
    }

    return (
        <div className={styles.setUpWifiCtn}>
            <Button type='dashed' style={{ height: '100%', marginTop: '20px' }} onClick={showModal}>
                <div className={styles.imageCtn}>
                    <Image
                        className={styles.image}
                        preview={false}
                        src={ModuleRmBg}
                        alt='Module'
                    />
                    <Title level={4}>Set Up Module Wi-Fi</Title>
                    <Text style={{
                        color: '#64748B'
                    }}>Module: BE_CA_xxx</Text>
                </div>
            </Button>
            {/* Setup wifi modal */}
            <Modal
                title={
                    <div className={styles.modalTitleCtn}>
                        <div >
                            <Text className={styles.titleTxt}>
                                Set up Wifi
                            </Text>
                            <Tooltip placement="top" title={'Guideline'} >
                                <Button
                                    size='small'
                                    type="default"
                                    shape="circle"
                                    icon={<InfoOutlined />}
                                    onClick={() => showGuideModal()}
                                />
                            </Tooltip>
                        </div>
                        <Text style={{
                            fontSize: '1rem',
                            color: '#64748B',
                            fontWeight: 400
                        }}>Enter the Wi-Fi that module will connect</Text>
                    </div>
                }
                open={isModalOpen}
                onOk={handleClose}
                onCancel={handleClose}
                footer={
                    <>
                        <Button
                            key="back"
                            onClick={() => {
                                handleClose()
                            }}
                        >
                            Cancel
                        </Button>
                        <Button key="submit" type="primary" onClick={() => {
                            handleSetup();
                        }}>
                            Setup
                        </Button>
                    </>
                }
            >
                <div className={styles.setUpWifiModal}>
                    <div style={{ marginBottom: '10px' }}>
                        <Text className={styles.label}>WI-FI NAME</Text>
                        <Input
                            style={{ padding: '10px 10px', fontSize: '1rem' }}
                            name='ssid'
                            onChange={(e) => setSsid(e.target.value)} />
                    </div>
                    <div>
                        <Text className={styles.label}>PASSWORD</Text>
                        <Input.Password
                            style={{ padding: '10px 10px', fontSize: '1rem' }}
                            name='pass'
                            onChange={(e) => setPass(e.target.value)}
                            iconRender={(visible) =>
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            }
                        />
                    </div>
                </div>
            </Modal>

            {/* Guid modal */}
            <Modal
                title='Set up WI-FI guidance'
                open={isGuideModalOpen}
                onOk={handleCloseGuideModal}
                onCancel={handleCloseGuideModal}
                width={'50vw'}
                centered
                footer={
                    <>
                        {current > 0 && (
                            <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
                                Previous
                            </Button>
                        )}
                        {current < steps.length - 1 && (
                            <Button type="primary" onClick={() => next()}>
                                Next
                            </Button>
                        )}
                        {current === steps.length - 1 && (
                            <Button type="primary" onClick={() => handleCloseGuideModal()}>
                                Ok
                            </Button>
                        )}
                    </>
                }
            >
                <div className={styles.guideModalCtn}>
                    <Steps current={current} items={items} />
                    <div style={contentStyle}>
                        <img
                            src={OverviewImg}
                            alt="Logo"
                            className={styles.instructionImg}
                        />
                    </div>
                    <div style={{ marginTop: 24 }}>
                        <Title level={3}>Overview set up wifi for module:</Title>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text className={styles.instructionTxt}>
                                1. Change to module wifi (Usually start with): BE_CA...
                            </Text>
                            <Text className={styles.instructionTxt}>
                                2. Input Wi-fi name and password that module need to connect
                            </Text>
                            <Text className={styles.instructionTxt}>
                                3. Hit "Set up" and view the notification
                            </Text>
                            <Text className={styles.instructionTxt}>
                                4. After successfully, change back to usual wifi and continue working
                            </Text>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default SetUpWifi