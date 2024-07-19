import styles from './index.module.less';
import '../../assets/styles/styles.less'

import React, { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { RcFile } from 'antd/es/upload'
import { Button, Checkbox, Image, message, Modal, Skeleton, Steps, Typography, Upload } from 'antd'
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

type ValidateFmt = {
    result?: any[];
    errors: Message[];
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

//Nhận file -> Quét Excel file (theo format riêng) - return ValidateFmt
// HandleSubmit -> Trả về lỗi || thành công

const { Text, Title } = Typography

const Excel: React.FC<FolderType> = ({ fileType }) => {
    const userInfo = useSelector((state: RootState) => state.auth.userDetail);
    const [current, setCurrent] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);
    const [isFAPFile, setIsFAPFile] = useState<boolean>(false);

    //havent has api - not modelling data yet
    const [excelResult, setExcelResult] = useState<ValidateFmt>();
    const [errLogs, setErrLogs] = useState<Message[]>([]);
    const [warningLogs, setWarningLogs] = useState<Message[]>([]);
    const [successLogs, setSuccessLogs] = useState<Message[]>([]);

    const [onValidateExcel, setOnValidateExcel] = useState(false);
    const [onValidateServer, setOnValidateServer] = useState(false);
    const [validateSvResult, setValidateSvResult] = useState<ServerResult | undefined>();

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
                        // const userID = userInfo?.result?.id;
                        // if (userID) {
                        if (isFAPFile) {
                            excelData = await FileHelper.handleImportFAPStudent(file, workbook)
                            setExcelResult(excelData)
                        } else {
                            excelData = await FileHelper.handleImportStudent(file, workbook)
                            setExcelResult(excelData)
                        }
                        // } else {
                        //     errLogs.push({
                        //         type: 'error',
                        //         message: 'Login are required to use this function',
                        //     });
                        // }
                    }
                    break;
                case 'class':
                    {
                        if (isFAPFile) {
                            excelData = await FileHelper.handleImportFAPClass(file, workbook)
                            setExcelResult(excelData)
                        } else {
                            excelData = await FileHelper.handleImportClass(file, workbook);
                            setExcelResult(excelData)
                        }
                    }
                    break;
                case 'schedule':
                    {
                        const excelData = await FileHelper.handleImportSchedule(file, workbook);
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
                        const result = RequestHelpers.postExcelStudent(excelData);
                        result.then(response => {
                            // console.log("After merge success, data: ", response);
                            saveInfo(response)
                        }).catch(err => {
                            // console.log("Err here after merge ", err);
                            saveInfo(err)
                        })
                    }
                    break;
                case 'class':
                    {
                        const result = RequestHelpers.postExcelClass(excelData);
                        result.then(data => {
                            saveInfo(data)
                        }).catch(err => {
                            saveInfo(err)
                        })
                    }
                    break;
                case 'schedule':
                    {
                        // console.log("This is input ", excelData);
                        const result = RequestHelpers.postExcelSchedule(excelData);
                        result.then(data => {
                            // console.log("Post schedule success ", data);
                            saveInfo(data)
                        }).catch(err => {
                            // console.log("Post schedule error ", err);
                            saveInfo(err)
                        })
                    }
                    break;
                default:
                    break;
            }
        } else {
            message.warning('No data found in excel')
        }
    }

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

    const handleClear = () => {
        setErrLogs([]);
        setWarningLogs([]);
        setSuccessLogs([]);

        setCurrent(0);

        setOnValidateExcel(false);
        setExcelResult({
            result: [],
            errors: []
        });

        setOnValidateServer(false)
        setValidateSvResult(undefined)
    }

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
                Import Excel
            </Button>
            <Modal
                title={
                    <Text style={{ fontSize: '1.25rem' }}>
                        Import {HelperService.capitalizeFirstLetter(fileType)}
                    </Text>
                }
                centered
                open={modalOpen}
                maskClosable={false}
                className={styles.excelModal}
                onCancel={() => {
                    setModalOpen(false)
                    handleClear();
                }}
                closable={true}
                footer={
                    <>
                        <Button
                            key="back"
                            onClick={() => {
                                setModalOpen(false)
                                handleClear();
                            }}
                        >
                            Cancel
                        </Button>
                        {
                            current === 1 ? (
                                <Button key="submit" type="primary" onClick={() => {
                                    handleClear();
                                    setCurrent(0);
                                }}>
                                    Import again
                                </Button>
                            ) : (
                                <Button key="submit" type="primary" onClick={() => {
                                    handleSubmit();
                                    setCurrent(1);
                                }}>
                                    Submit
                                </Button>
                            )
                        }
                    </>
                }
            >
                <div
                    style={{ minHeight: '70vh' }}
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
                                    {
                                        (fileType === 'class' || fileType === 'student') && (
                                            <Checkbox
                                                onChange={() => { setIsFAPFile(!isFAPFile) }}
                                                style={{ margin: '5px 0 10px' }}
                                            >
                                                FPT Excel
                                            </Checkbox>
                                        )
                                    }
                                    <Button
                                        size='large'
                                        icon={<FileExcelOutlined />}
                                        onClick={() => handleDownloadTemplate()}
                                    >Download template file</Button>
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
                                                (warningLogs.length === 0 && errLogs.length === 0) ? (<MessageCard props={[]} />) : (
                                                    <>
                                                        <Text># Those record will be ignored, please consider again before continue</Text>
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