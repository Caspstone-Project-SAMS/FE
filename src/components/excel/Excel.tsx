import React, { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { Button, Image, message, Modal, Skeleton, Steps, Typography, Upload } from 'antd'
import { CloudUploadOutlined, DeleteOutlined, FileTextOutlined, FolderAddOutlined, LoadingOutlined } from '@ant-design/icons'
import MessageCard from './messageCard/MessageCard'
import { FileHelper } from './helpers/FileHelper'
import { RcFile } from 'antd/es/upload'
import styles from './index.module.less';
import '../../assets/styles/styles.less'
import { StudentService } from '../../hooks/StudentList'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/Store'

import SuccessIcon from '../../assets/icons/success_icon.png'
import ErrorIcon from '../../assets/icons/cancel_icon.png'

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

const Excel: React.FC<FolderType> = ({ fileType }) => {
    const userInfo = useSelector((state: RootState) => state.auth.userDetail);
    const [current, setCurrent] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

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

    const handleExcel = async (file: RcFile) => {
        try {
            //15,728,640
            if (file.size >= 15728640) {
                message.error('File size exceed 15MB!', 1.5)
                return false;
            }
            const workbook = new ExcelJS.Workbook();
            // const excelData = await FileHelper.handleImportSemester(file, workbook)
            // const userID = userInfo!.result!.id
            let excelData: ValidateFmt
            switch (fileType) {
                case 'student':
                    {
                        const userID = userInfo?.result?.id;
                        if (userID) {
                            excelData = await FileHelper.handleImportStudent(file, workbook, userID)
                            setExcelResult(excelData)
                        } else {
                            message.warning('ID not exist!')
                        }
                    }
                    break;
                case 'class':
                    // code block
                    break;
                case 'schedule':
                    // code block
                    break;
                default:
                    message.info('Excel file not supported!')
            }

            // console.log("import data here", excelData);
            // setExcelResult(excelData)
            setOnValidateExcel(true);
            return false
        } catch (error) {
            console.log("Error when receive excel file ", error);
            return false
        }
    }

    const handleSubmit = async () => {
        const studentList = excelResult?.result;
        if (studentList && studentList.length > 0) {
            setOnValidateServer(true)
            const response = StudentService.importExcelStudent(studentList);

            response.then(data => {
                setOnValidateServer(false)
                setOnValidateExcel(false)
                //Ktra fail 90%, 1 record dung -> Show những record đã dc tạo, in lỗi những record sai
                const createdListArr = data.data.result.map(item => (item.studentCode))
                if (createdListArr) {
                    const createdTxt = `Created ${createdListArr.join(', ')}`
                    setSuccessLogs([{
                        type: 'success',
                        message: createdTxt
                    }])
                    console.log("createdTxt ", createdTxt);
                }
                const errList = data.data.errors
                if (errList.length > 0) {
                    const fmtLogs: Message[] = errList.map(err => ({
                        type: 'error',
                        message: err
                    }))
                    setErrLogs(fmtLogs)
                }

                const fmtData: ServerResult = {
                    status: true,
                    data: data.data.result,
                    errors: data.data.errors
                }

                setValidateSvResult(fmtData);
            }).catch(err => {
                setOnValidateServer(false)
                setOnValidateExcel(false)
                console.log("errors handling import ", err)
                const errResponses = err.response.data.errors;
                if (errResponses && Array.isArray(errResponses)) {
                    const errData: ServerResult = {
                        status: false,
                        data: '',
                        errors: errResponses
                    }
                    const fmtLogs: Message[] = errResponses.map(err => ({
                        type: 'error',
                        message: err
                    }))

                    setWarningLogs([])
                    setErrLogs(fmtLogs);
                    setValidateSvResult(errData)
                }
            })
        } else {
            message.warning('No data found in excel')
        }
    }

    const customItemRender = (originNode, file, fileList, actions) => {
        return (
            <div className={styles.fileItem}>
                <div className={`flex item-center ${styles.itemBody}`}>
                    <FileTextOutlined style={{ fontSize: 20, marginRight: '10px' }} />
                    <div className={`flex-column`}>
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
        setOnValidateExcel(false);
        setExcelResult({
            result: [],
            errors: []
        });
        setErrLogs([]);
        setWarningLogs([]);
        setSuccessLogs([]);
        setCurrent(0);
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
                title="Import Excel Document"
                centered
                open={modalOpen}
                maskClosable={false}
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
                                    Retry
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
                                // description: 'Handle input',
                                // icon: onValidateExcel ? <LoadingOutlined /> : <FileExcelOutlined />
                            },
                            {
                                title: 'Checking on server',
                                // description: 'Is meet requirements',
                                icon: onValidateServer && <LoadingOutlined />
                            },
                        ]}
                    />
                    {
                        current === 0 && (
                            <div className='upload-excel'>
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
                                                        <Typography.Text># Those record will be ignored, please consider again before continue</Typography.Text>
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
                                    <Typography.Title level={2}>
                                        Validating...
                                    </Typography.Title>
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
                                                    <Typography.Title level={2}>
                                                        {
                                                            validateSvResult.status ? ('Create successfully') : ('Create Failed')
                                                        }
                                                    </Typography.Title>
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