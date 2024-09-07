import { Button, Image, Input, Modal, Select, Steps, theme, Tooltip, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { ModuleService } from '../../hooks/Module';
import styles from './index.module.less'
import { EyeInvisibleOutlined, EyeTwoTone, InfoOutlined } from '@ant-design/icons';
import OverviewImg from '../../assets/imgs/setUpWifi/Overview_Img.png'
import ModuleRmBg from '../../assets/imgs/module_rm_bg.png'
import { HelperService } from '../../hooks/helpers/helperFunc';
import { useNavigate } from 'react-router-dom';

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

const { Option } = Select;

const SetUpWifi = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
    const [rememberWifis, setRememberWifis] = useState([]);
    const [ssid, setSsid] = useState<string>('');
    const [pass, setPass] = useState<string>('');
    const navigate = useNavigate();

    //Guide
    const { token } = theme.useToken();
    const [current, setCurrent] = useState(0);

    const selectAfter = (
        <Select
            placeholder='Recents'
            style={{
                width: '32%',
                height: 'auto',
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0
            }}
            onChange={(e) => handleSelectWifi(e)}
        >
            {
                rememberWifis.map((item, i) => (
                    <Option
                        style={{
                            borderTopLeftRadius: 0,
                            borderBottomLeftRadius: 0
                        }}
                        key={`wifi_opt_${i}`} value={item.ssid}>{item.ssid}</Option>
                ))
            }
        </Select>
    );
    const handleSelectWifi = (val: string) => {
        const selected = rememberWifis.find(item => item.ssid === val);
        if (selected) {
            setSsid(selected.ssid)
            setPass(selected.pass)
        }
    }

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
    //Web cant sent to http module
    const showModal = () => {
        setIsModalOpen(true);
    };
    const navToConfig = () => {
        navigate('/module')
    }

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
    const handleSetup = async () => {
        let isValid = true;
        if (ssid.length === 0) {
            isValid = false;
            toast.error('Wifi name must not be empty!', { duration: 2200 });
        }
        if (pass.length < 8) {
            isValid = false;
            toast.error('Password must contains at least 8 characters!', { duration: 2200 });
        }
        if (isValid) {
            try {
                const promise2 = await ModuleService.setUpWifi(ssid, pass);
                if (promise2) {
                    toast.success('Sent to wifi successfully, please check on module!')
                    const wifi = {
                        ssid: ssid,
                        pass: HelperService.encryptString(pass)
                    }
                    handleRememberWifi(wifi) // used wifi will not pushed to top list - error
                }
            } catch (error) {
                toast.error('Unknown error occured')
            }
            // const promise2 = await ModuleService.setUpWifi(ssid, pass);
            // if (promise2) {
            //     toast.success('Sent to wifi successfully, please check on module!')
            //     const wifi = {
            //         ssid: ssid,
            //         pass: HelperService.encryptString(pass)
            //     }
            //     handleRememberWifi(wifi) // used wifi will not pushed to top list - error
            // }
        }
    }
    const getRememberWifi = () => {
        const wifis = localStorage.getItem('wifiList');
        return wifis ? JSON.parse(wifis) : [];
    };
    const getRememberWifiDecrypt = () => {
        try {
            const wifis = localStorage.getItem('wifiList');
            if (wifis) {
                const list = JSON.parse(wifis);
                list.forEach(item => {
                    item.pass = HelperService.decryptString(item.pass);
                });
                const decryptedList = list.map(item => ({
                    ...item,
                    pass: HelperService.decryptString(item.pass)
                }));
                console.log("ok ", decryptedList);

                return list
            }
            return []
        } catch (error) {
            return []
        }
    };
    const saveRememberWifi = (wifis) => {
        localStorage.setItem('wifiList', JSON.stringify(wifis));
    };
    const handleRememberWifi = (wifi) => {
        try {
            let rememberWifiList = getRememberWifi();
            if (rememberWifiList) {
                rememberWifiList = rememberWifiList.filter(wifiItem => wifiItem.ssid !== wifi.ssid);
            }
            // console.log("after filter ", rememberWifiList);
            rememberWifiList.unshift(wifi);

            if (rememberWifiList.length > 5) {
                rememberWifiList.pop();
            }
            saveRememberWifi(rememberWifiList);
            setRememberWifis(getRememberWifiDecrypt())
        } catch (error) {
            console.log("Unknown err happen when remember wifi");
        }
    };

    useEffect(() => {
        // console.log("wifi here ", getRememberWifiDecrypt());
        setRememberWifis(getRememberWifiDecrypt())
    }, [isModalOpen])

    return (
        <div className={styles.setUpWifiCtn}>
            <Button type='dashed' style={{ height: '100%', marginTop: '20px' }} onClick={navToConfig}>
                <div className={styles.imageCtn}>
                    <Image
                        className={styles.image}
                        preview={false}
                        src={ModuleRmBg}
                        alt='Module'
                    />
                    <Title level={4}>Set Up Module</Title>
                    <Text style={{
                        color: '#64748B'
                    }}>Setting module, view history...</Text>
                </div>
            </Button>
            {/* Setup wifi modal */}
            <Modal
                title={
                    <div className={styles.modalTitleCtn}>
                        <div >
                            <Text className={styles.titleTxt}>

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
                        <div className={styles.ssidInputCtn}>
                            <Input
                                className={styles.ssidInput}
                                // addonAfter={selectAfter}
                                value={ssid}
                                style={{ fontSize: '1rem', minHeight: '47.5px' }}
                                name='ssid'
                                onChange={(e) => setSsid(e.target.value)}
                            />
                            {
                                selectAfter
                            }
                        </div>
                    </div>
                    <div>
                        <Text className={styles.label}>PASSWORD</Text>
                        <Input.Password
                            style={{ padding: '10px', fontSize: '1rem' }}
                            name='pass'
                            value={pass}
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