import styles from './index.module.less';
import '../../assets/styles/styles.less'

import React, { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { RcFile } from 'antd/es/upload'
import { Button, Checkbox, Dropdown, Image, MenuProps, message, Modal, Select, Skeleton, Steps, Typography, Upload } from 'antd'
import { CloudUploadOutlined, DeleteOutlined, FileExcelOutlined, FileTextOutlined, FolderAddOutlined, LoadingOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'

import { FileHelper } from './helpers/FileHelper'
import { RequestHelpers } from './helpers/RequestHelper'
import { HelperService } from '../../hooks/helpers/helperFunc'
import SuccessIcon from '../../assets/icons/success_icon.png'
import ErrorIcon from '../../assets/icons/cancel_icon.png'
import MessageCard from './messageCard/MessageCard'
import { StudentService } from '../../hooks/StudentList';
import { CalendarService } from '../../hooks/Calendar';
import { ClassService } from '../../hooks/Class';
import useDispatch from '../../redux/UseDispatch';
import { getAllSemester } from '../../redux/slice/global/GlobalSemester';
import { FaAngleDown } from 'react-icons/fa6';
import { SubjectService } from '../../hooks/Subject';

type ValidateFmt = {
    result?: any[];
    errors: Message[];
    success: Message[];
    //Continue import student to class, continue generate schedule for other weeks
    isContinueAble?: boolean;
};
type ServerResult = {
    status: boolean;
    data: string
    errors: string[]
};
type Message = {
    message: string
    type: 'warning' | 'error' | 'success',
}
type FolderType = {
    fileType: 'student' | 'class' | 'schedule'
}

type Week = {
    label: string,
    value: string
}

//Nhận file -> Quét Excel file (theo format riêng) - return ValidateFmt
// HandleSubmit -> Trả về lỗi || thành công

const { Text, Title } = Typography

const Excel: React.FC<FolderType> = ({ fileType }) => {
    const dispatch = useDispatch()
    const userInfo = useSelector((state: RootState) => state.auth.userDetail);
    const semester = useSelector((state: RootState) => state.globalSemester.data);
    const [semesterData, setSemesterData] = useState<MenuProps['items']>([]);
    const [selectedSemester, setSelectedSemester] = useState<number>(0)
    const [labelSemester, setLabelSemester] = useState<string>('')
    const [subjectData, setSubjectData] = useState<Week[]>([]);
    const [selectedSubject, setSelectedSubject] = useState<string>('')

    const [current, setCurrent] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFAPFile, setIsFAPFile] = useState<boolean>(false);

    //Excel state - handling result, visible state logs 
    const [excelResult, setExcelResult] = useState<ValidateFmt>();
    const [errLogs, setErrLogs] = useState<Message[]>([]);
    const [warningLogs, setWarningLogs] = useState<Message[]>([]);
    const [successLogs, setSuccessLogs] = useState<Message[]>([]);

    const [onValidateExcel, setOnValidateExcel] = useState(false);
    const [onValidateServer, setOnValidateServer] = useState(false);
    const [validateSvResult, setValidateSvResult] = useState<ServerResult | undefined>();
    //Continue import
    const [canContinueSchedule, setCanContinueSchedule] = useState<boolean>(true);
    const [isContinueAble, setIsContinueAble] = useState<boolean>(false);
    const [isImportToClass, setIsImportToClass] = useState<boolean>(false);

    const [weeks, setWeeks] = useState<Week[]>([]);
    const [weekStart, setWeekStart] = useState<string | undefined>(undefined);
    const [weekEnd, setWeekEnd] = useState<string | undefined>(undefined);

    //Functions----------------------------
    function formatBytes(bytes: number) {
        const kb = 1024;
        const mb = kb * 1024;

        if (bytes < kb) {
            return `${bytes} Bytes`;
        } else if (bytes < mb) {
            const kilobytes = (bytes / kb).toFixed(2);
            return `${kilobytes} KB`;
        } else {
            const megabytes = (bytes / mb).toFixed(2);
            return `${megabytes} MB`;
        }
    }

    const handleDownloadTemplate = () => {
        switch (fileType) {
            case 'student':
                StudentService.downloadTemplateExcel();
                break;
            case 'class':
                ClassService.downloadTemplateExcel()
                break;
            case 'schedule':
                CalendarService.downloadTemplateExcel();
                break;
            default:
                break;
        }
    }

    const handleExcel = async (file: RcFile) => {
        try {
            //15,728,640
            if (file.size >= 15728640) {
                message.error('File size exceed 15MB!', 1.5)
                return false;
            }
            const workbook = new ExcelJS.Workbook();
            let excelData: ValidateFmt
            switch (fileType) {
                case 'student':
                    {
                        if (isFAPFile) {
                            excelData = await FileHelper.handleImportFAPStudent(file, workbook)
                            if (excelData.isContinueAble) { //if the excel file perfect
                                setIsContinueAble(true)
                            }
                            setExcelResult(excelData)
                        } else {
                            excelData = await FileHelper.handleImportStudent(file, workbook)
                            setExcelResult(excelData)
                        }
                    }
                    break;
                case 'class':
                    {
                        if (isFAPFile) {
                            excelData = await FileHelper.handleImportFAPClass(file, workbook)
                            if (excelData.result) {
                                excelData.result.forEach(item => {
                                    if (!item.classCode.includes(selectedSubject)) {
                                        item.classCode = item.classCode + '-' + selectedSubject
                                    }
                                })
                            }
                            console.log("Excel data here ", excelData);
                            setExcelResult(excelData)
                        } else {
                            excelData = await FileHelper.handleImportClass(file, workbook);
                            setExcelResult(excelData)
                        }
                    }
                    break;
                case 'schedule':
                    {
                        setCanContinueSchedule(false);
                        handleClearLogs();
                        const excelData = await FileHelper.handleImportSchedule(file, workbook, isContinueAble);
                        setExcelResult(excelData)
                    }
                    break;
                default:
                    message.info('Excel file not supported!')
            }
            setOnValidateExcel(true);
            return false
        } catch (error) {
            console.log("Error when receive excel file ", error);
            return false
        }
    }

    const saveInfo = (input) => {
        const { errorLogs, successLogs, warningLogs, data } = input;

        setOnValidateServer(false)
        setOnValidateExcel(false)

        setSuccessLogs(successLogs ? successLogs : [])
        setErrLogs(errorLogs ? errorLogs : [])
        setWarningLogs(warningLogs ? warningLogs : [])

        if (data) {
            setValidateSvResult(data)
        }
    }

    const handleSubmit = async () => {
        const excelData = excelResult?.result;
        if (excelData && excelData.length > 0) {
            setOnValidateServer(true)
            switch (fileType) {
                case 'student':
                    {
                        setIsContinueAble(false);
                        console.log("Current gonna push ", excelData);
                        //continue import to class
                        if (isImportToClass) {
                            const dataImportToClass: any[] = []
                            const dataStudent = excelData.map(item => {
                                const { classCode, ...result } = item;
                                dataImportToClass.push({ classCode, studentCode: item.studentCode })
                                return result
                            })
                            const promiseCreateStudent = RequestHelpers.postExcelStudent(dataStudent);
                            promiseCreateStudent.then(response => {
                                // console.log("After merge success, data: ", response);
                                const { errorLogs, successLogs, warningLogs, data } = response
                                setSuccessLogs(successLogs ? successLogs : [])
                                setErrLogs(errorLogs ? errorLogs : [])
                                setWarningLogs(warningLogs ? warningLogs : [])
                                let title = ''
                                if (data && data.status) {
                                    title = data.data;
                                    const result = RequestHelpers.postExcelClass(dataImportToClass, selectedSemester);
                                    result.then(response2 => {
                                        if (response2 && response2.data) { // data.data - title
                                            response2.data.data = title + '\n' + response2.data.data
                                        }
                                        const { errorLogs, successLogs, warningLogs, data } = response2

                                        setOnValidateServer(false)
                                        setOnValidateExcel(false)
                                        setSuccessLogs((prev) => [...prev, ...successLogs])
                                        setErrLogs((prev) => [...prev, ...errorLogs])
                                        setWarningLogs((prev) => [...prev, ...warningLogs])
                                        if (data) {
                                            setValidateSvResult(data)
                                        }
                                    }).catch(err => {
                                        saveInfo(err)
                                    })

                                    setValidateSvResult(data)
                                } else {
                                    saveInfo(response)
                                }
                            }).catch(err => {
                                console.log("Err here after merge ", err);
                                saveInfo(err)
                            })
                        } else {
                            const result = RequestHelpers.postExcelStudent(excelData);
                            result.then(response => {
                                // console.log("After merge success, data: ", response);
                                saveInfo(response)
                            }).catch(err => {
                                // console.log("Err here after merge ", err);
                                saveInfo(err)
                            })
                        }
                    }
                    break;
                case 'class':
                    {
                        const result = RequestHelpers.postExcelClass(excelData, selectedSemester);
                        result.then(data => {
                            saveInfo(data)
                        }).catch(err => {
                            saveInfo(err)
                        })
                    }
                    break;
                case 'schedule':
                    {
                        if (isContinueAble) {
                            setIsContinueAble(false);
                            if (weekStart && weekEnd) {
                                const isValid = HelperService.isStartWeekSooner(weekStart, weekEnd);
                                if (isValid) {
                                    const refVal = [
                                        {
                                            index: 0,
                                            dayOfWeek: 'mon',
                                        },
                                        {
                                            index: 1,
                                            dayOfWeek: 'tue',
                                        },
                                        {
                                            index: 2,
                                            dayOfWeek: 'wed',
                                        },
                                        {
                                            index: 3,
                                            dayOfWeek: 'thu',
                                        },
                                        {
                                            index: 4,
                                            dayOfWeek: 'fri',
                                        },
                                        {
                                            index: 5,
                                            dayOfWeek: 'sat',
                                        },
                                        {
                                            index: 6,
                                            dayOfWeek: 'sun',
                                        },
                                    ]
                                    const result: any[] = [];
                                    console.log("Data ", excelData);
                                    const weekArr = HelperService.getWeeks(weekStart, weekEnd);
                                    weekArr.forEach(week => {
                                        const days = HelperService.getDaysOfWeek(week);
                                        days.forEach((day, index) => {
                                            const scheduleValid = excelData.filter(item => item.dayOfWeek === refVal[index].dayOfWeek)
                                            if (scheduleValid.length > 0) {
                                                const newSchedule = scheduleValid.map(schedule => {
                                                    const fmtData = {
                                                        classCode: schedule.classCode,
                                                        date: day,
                                                        slotNumber: schedule.slotNumber
                                                    }
                                                    return fmtData
                                                })
                                                result.push(...newSchedule);
                                            }
                                        })
                                    })
                                    const formatExcelData = excelData.map(schedule => {
                                        const { dayOfWeek, ...valueNeed } = schedule
                                        return valueNeed
                                    })
                                    // console.log("formated data", excelData);
                                    // console.log("Done - this is schedule valid", result);
                                    const mergedArr = [...formatExcelData, ...result];
                                    console.log("mergedArr", mergedArr);
                                    const promise = RequestHelpers.postExcelSchedule(mergedArr);
                                    promise.then(data => {
                                        saveInfo(data)
                                    }).catch(err => {
                                        saveInfo(err)
                                    })
                                } else {
                                    setOnValidateServer(false)
                                    setOnValidateExcel(true)
                                    message.warning('Start week time can not further than end week ')
                                }
                            } else {
                                message.info('Choose week start and week end before continue!')
                            }
                        } else {
                            const result = RequestHelpers.postExcelSchedule(excelData);
                            result.then(data => {
                                // console.log("Post schedule success ", data);
                                saveInfo(data)
                            }).catch(err => {
                                // console.log("Post schedule error ", err);
                                saveInfo(err)
                            })
                        }
                    }
                    break;
                default:
                    break;
            }
        } else {
            message.warning('No data found in excel')
        }
    }

    // const onContinueImportToClass = () => {

    // }

    const customItemRender = (originNode, file, fileList, actions) => {
        return (
            <div className={styles.fileItem}>
                <div className={`flex item-center ${styles.itemBody}`}>
                    <FileTextOutlined style={{ fontSize: 20, marginRight: '10px' }} />
                    <div className={`flex-column`} style={{ width: '100%' }}>
                        <span className={styles.fileName}>{file.name}</span>
                        File size: {formatBytes(Number(file.size))}
                    </div>
                </div>
                <div>
                    <DeleteOutlined
                        className={styles.fileIconDelete}
                        onClick={() => {
                            handleClear();
                            actions.remove(file)
                        }} style={{ fontSize: 16 }}
                    />
                </div>
            </div>
        );
    };

    const handleClearLogs = () => {
        setErrLogs([]);
        setWarningLogs([]);
        setSuccessLogs([]);
    }

    const handleClear = () => {
        setErrLogs([]);
        setWarningLogs([]);
        setSuccessLogs([]);
        setIsFAPFile(false);

        setSelectedSubject('');
        setCanContinueSchedule(true);
        setIsContinueAble(false);
        setIsImportToClass(false);

        setCurrent(0);
        setOnValidateExcel(false);
        setExcelResult({
            result: [],
            errors: [],
            success: []
        });

        setOnValidateServer(false);
        setValidateSvResult(undefined);

        // setWeekStart(undefined);
        // setWeekEnd(undefined);
    }
    // const getLabelByKey = (key: number): string => {
    //     if (semesterData && semesterData.length > 0) {
    //         const item = semesterData.find(item => item!.key === key);
    //         // return item.label;
    //     }
    // };

    const onSearchSelect = (value: string) => {
        // console.log('search:', value);
    };

    const onClick: MenuProps['onClick'] = ({ key, domEvent }) => {
        try {
            setSelectedSemester(Number(key))
            setLabelSemester(domEvent.target.innerHTML)
        } catch (error) {
            console.log("Err key type");
        }
    };

    const handleFormatSemester = () => {
        const menuData: MenuProps['items'] = []

        if (semester && semester.length > 0) {
            semester.forEach((item, i) => {
                if (item.semesterStatus === 2) {
                    setSelectedSemester(item.semesterID);
                    setLabelSemester(item.semesterCode);
                }
                menuData.push({
                    key: item.semesterID,
                    style: { padding: 0 },
                    label: <Text style={{
                        display: 'flex',
                        width: '100%',
                        padding: '6px',
                    }}>{item.semesterCode}</Text>,
                })
            })
            console.log("semester ", semester);
            setSemesterData(menuData);
        }
    }
    const handleFormatSubject = () => {
        const promise = SubjectService.getAllSubject();
        promise.then(data => {
            const subjects: Week[] = []

            if (data && data.length > 0) {
                data.forEach((item) => {
                    if (item.subjectCode) {
                        subjects.push({
                            label: item.subjectCode,
                            value: item.subjectCode
                        });
                    }
                })
                console.log("subjects ", subjects);
                setSubjectData(subjects);
            }
        }).catch(err => {
            message.warning('Server busy, please try again later...')
        })
    }

    //Use Effect--------------------------------------------
    useEffect(() => {
        // handleFormatSubject();
        if (fileType === 'schedule') {
            setWeeks(HelperService.generateWeekFromCur());
        }
        if (semester && semester.length === 0) {
            dispatch(getAllSemester())
            handleFormatSubject()
        } else {
            handleFormatSubject()
            handleFormatSemester()
        }
    }, [semester])

    useEffect(() => {
        setErrLogs([]);
        setWarningLogs([]);

        excelResult?.errors.forEach(log => {
            switch (log.type) {
                case 'error':
                    setErrLogs(prev => [...prev, log])
                    break;
                case 'warning':
                    setWarningLogs(prev => [...prev, log])
                    break;
                default:
                    break;
            }
        })
        excelResult?.success.forEach(log => {
            switch (log.type) {
                case 'success':
                    setSuccessLogs(prev => [...prev, log])
                    break;
                default:
                    break;
            }
        })
    }, [excelResult])

    return (
        <div className={styles.excelValidateCtn}>
            <Button
                size='large'
                onClick={() => setModalOpen(true)}
                className={styles.importExcelBtn}
                icon={<FolderAddOutlined />}
            >
                {fileType === 'class' ? ('Import Student To Class') : ('Import Excel')}
            </Button>
            <Modal
                title={
                    <Text style={{ fontSize: '1.25rem' }}>
                        Import {
                            fileType === 'class' ? ('Student To Class') : (
                                HelperService.capitalizeFirstLetter(fileType)
                            )
                        }
                    </Text>
                }
                centered
                open={modalOpen}
                maskClosable={false}
                className={styles.excelModal}
                onCancel={() => {
                    handleClear();
                    setModalOpen(false)
                }}
                closable={true}
                footer={
                    <>
                        {
                            //Continue import student to class
                            (isContinueAble && fileType === 'student') && (
                                <div>
                                    <Text style={{ fontSize: '0.95rem' }}>
                                        # System recognized that excel file also contained "classCode" <br />
                                        Do you want to import to class? <br />
                                    </Text>
                                    <Checkbox
                                        value={isImportToClass}
                                        onChange={() => setIsImportToClass(!isImportToClass)}
                                        style={{ marginBottom: 10 }}
                                    >
                                        Yes
                                    </Checkbox>
                                </div>
                            )
                        }
                        {
                            current === 1 ? (
                                <Button key="submit" type="primary"
                                    disabled={onValidateServer}
                                    onClick={() => {
                                        handleClear();
                                        setCurrent(0);
                                    }}>
                                    Import again
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        key="back"
                                        onClick={() => {
                                            handleClear();
                                            setModalOpen(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                    {
                                        ((fileType === 'schedule') && isContinueAble) ? (
                                            <Button
                                                disabled={isContinueAble && (weekStart === undefined || weekEnd === undefined)}
                                                key="submit"
                                                type="primary"
                                                onClick={() => {
                                                    handleSubmit();
                                                    setCurrent(1);
                                                }}>
                                                Submit
                                            </Button>
                                        ) : (
                                            ((fileType === 'class' && isFAPFile) ? (
                                                <Button
                                                    disabled={!isContinueAble}
                                                    key="submit"
                                                    type="primary"
                                                    onClick={() => {
                                                        handleSubmit();
                                                        setCurrent(1);
                                                    }}>
                                                    Submit
                                                </Button>
                                            ) : (
                                                <Button
                                                    key="submit"
                                                    type="primary"
                                                    onClick={() => {
                                                        handleSubmit();
                                                        setCurrent(1);
                                                    }}>
                                                    Submit
                                                </Button>
                                            ))
                                        )
                                    }
                                </>
                            )
                        }
                    </>
                }
            >
                <div
                    style={{
                        minHeight: '70vh',
                        // minWidth: '50vw'
                    }}
                >
                    <Steps
                        current={current}
                        style={{ margin: '12px 0' }}
                        items={[
                            {
                                title: 'Validate Excel',
                                // icon: onValidateExcel ? <LoadingOutlined /> : <FileExcelOutlined />
                            },
                            {
                                title: 'Checking on server',
                                icon: onValidateServer && <LoadingOutlined />
                            },
                        ]}
                    />
                    {
                        current === 0 && (
                            <div className='upload-excel'>
                                <div className={styles.templateSection}>
                                    <div className={styles.templateSectionLeft}>
                                        {/* Import class, and continue import to class when import student */}
                                        {(fileType === 'class' || (fileType === 'student' && isContinueAble)) && (
                                            <>
                                                <Text>Semester: </Text>
                                                <Dropdown
                                                    trigger={['click']}
                                                    menu={{ items: semesterData, onClick }}>
                                                    <Button
                                                        icon={<FaAngleDown />}
                                                        iconPosition='end'
                                                        style={{
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            gap: '5px',
                                                            width: 'fit-content'
                                                        }}
                                                    >
                                                        <Text>
                                                            {labelSemester}
                                                        </Text>
                                                    </Button>
                                                </Dropdown>
                                            </>
                                        )}
                                        {
                                            (fileType === 'class' && isFAPFile) && (
                                                <>
                                                    <Text>Subject: </Text>
                                                    <Select
                                                        showSearch
                                                        placeholder="Subject"
                                                        optionFilterProp="label"
                                                        onChange={val => {
                                                            setSelectedSubject(val)
                                                            setIsContinueAble(true);
                                                        }}
                                                        onSearch={onSearchSelect}
                                                        options={subjectData}
                                                        style={{ minWidth: '8vw' }}
                                                    />
                                                </>
                                            )
                                        }
                                        {
                                            fileType === 'schedule' && (
                                                <div className={styles.continueImportScheduleCtn}>
                                                    <Checkbox
                                                        disabled={!canContinueSchedule}
                                                        checked={isContinueAble}
                                                        onChange={() => { setIsContinueAble(!isContinueAble) }}
                                                    >
                                                        Continue import for other weeks
                                                    </Checkbox>
                                                    <div className={styles.checkboxCtn}>
                                                        <Select
                                                            disabled={!isContinueAble}
                                                            showSearch
                                                            placeholder="Start week"
                                                            optionFilterProp="label"
                                                            onChange={val => setWeekStart(val)}
                                                            onSearch={onSearchSelect}
                                                            options={weeks}
                                                            style={{ minWidth: '8vw' }}
                                                        />
                                                        <Text>TO</Text>
                                                        <Select
                                                            disabled={!isContinueAble}
                                                            showSearch
                                                            placeholder="End week"
                                                            optionFilterProp="label"
                                                            onChange={val => setWeekEnd(val)}
                                                            onSearch={onSearchSelect}
                                                            options={weeks}
                                                            style={{ minWidth: '8vw' }}
                                                        />
                                                    </div>
                                                </div>
                                            )
                                        }
                                    </div>
                                    <div className={styles.templateSectionRight}>
                                        {
                                            (fileType === 'class' || fileType === 'student') && (
                                                <Checkbox
                                                    checked={isFAPFile}
                                                    onChange={() => { setIsFAPFile(!isFAPFile) }}
                                                    style={{ margin: '5px 0 10px' }}
                                                >
                                                    FAP Excel
                                                </Checkbox>
                                            )
                                        }
                                        <Button
                                            size='large'
                                            icon={<FileExcelOutlined />}
                                            onClick={() => handleDownloadTemplate()}
                                        >Download template file</Button>
                                    </div>
                                </div>

                                <Upload.Dragger
                                    name='file'
                                    beforeUpload={(file) => handleExcel(file)}
                                    action={''}
                                    maxCount={1}
                                    itemRender={customItemRender}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <CloudUploadOutlined />
                                    </p>
                                    <p className="ant-upload-text">
                                        <b style={{ color: '#2563EB' }}>Choose a file</b>{' '}
                                        or drop it here</p>
                                    <p className="ant-upload-hint">
                                        File receive: .xlsx <br />
                                        Max file size: 15MB
                                    </p>
                                </Upload.Dragger>
                                {
                                    onValidateExcel && (
                                        <>
                                            {
                                                (warningLogs.length === 0 && errLogs.length === 0)
                                                    ? (successLogs.length > 0 ? ( // show success logs for import schedule func
                                                        <MessageCard props={successLogs} title='Excel file good to go' />
                                                    ) : (
                                                        <MessageCard props={[]} />
                                                    ))
                                                    : (
                                                        <>
                                                            <div style={{ marginBottom: 8 }}>
                                                                <Text># Those record will be ignored, please consider again before continue</Text>
                                                            </div>
                                                            {
                                                                (errLogs.length > 0) && (<MessageCard props={errLogs} />)
                                                            }
                                                            {
                                                                (warningLogs.length > 0) && (<MessageCard props={warningLogs} />)
                                                            }
                                                        </>
                                                    )
                                            }

                                        </>
                                    )
                                }
                            </div>
                        )
                    }
                    {/* --------------------- Validate server --------------------- */}
                    {
                        current === 1 && (
                            onValidateServer ? (
                                <>
                                    <Title level={2}>
                                        Validating...
                                    </Title>
                                    <Skeleton active />
                                </>
                            ) : (
                                <div className={styles.validateServer}>
                                    <div className={styles.validateSvResult}>
                                        {
                                            validateSvResult && (
                                                <>
                                                    <Image
                                                        width={60}
                                                        src={validateSvResult.status ? SuccessIcon : ErrorIcon}
                                                        preview={false}
                                                        style={{ margin: '10px 0' }}
                                                    />
                                                    <Title level={2}>
                                                        {
                                                            validateSvResult.status ? ('Import successfully') : ('Import Failed')
                                                        }
                                                    </Title>
                                                </>
                                            )
                                        }
                                    </div>

                                    {
                                        validateSvResult && validateSvResult.data && <MessageCard props={successLogs} />
                                    }
                                    {
                                        errLogs.length > 0 && <MessageCard props={errLogs} />
                                    }
                                </div>
                            )
                        )
                    }
                </div>
            </Modal>
        </div>
    )
}

export default Excel


//Read all things in the excel file
// const readDataFromFile = (data: any) => {
//     const workbook = new ExcelJS.Workbook();
//     workbook.xlsx.load(data)
//         .then(workbook => {
//             console.log(workbook, 'workbook instance');

//             workbook.eachSheet((sheet, id) => {
//                 sheet.eachRow((row, rowIndex) => {
//                     console.log(row.values, rowIndex);
//                 });
//             });
//         });
// }

//Ok response
// {
//     "isSuccess": true,
//     "title": "Create Students Result",
//     "errors": [
//         "StudentCode TEST_CHARACTER_VALID is already taken",
//         "StudentCode SAMS is already taken"
//     ],
//     "result": [
//         {
//             "studentCode": "The_Flash",
//             "displayName": "Ordinary scientist",
//             "email": "anything_you-got@gotgel.org",
//             "createBy": "Yamj"
//         }
//     ]
// }