import React, { useEffect, useState } from 'react'
import ExcelJS from 'exceljs'
import { Button, message, Modal, Steps, Typography, Upload, UploadProps } from 'antd'
import { CloudUploadOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import MessageCard from './messageCard/MessageCard'
import { FileService } from './helpers/FileService'
import { RcFile } from 'antd/es/upload'
import styles from './index.module.less';
import '../../assets/styles/styles.less'

type validateFmt = {
    result?: any[];
    errors: Message[];
};
type Message = {
    message: string
    type: 'warning' | 'error',
}

const props: UploadProps = {
    progress: {
        strokeColor: {
            '0%': '#108ee9',
            '100%': '#87d068',
        },
        strokeWidth: 3,
        format: (percent) => percent && `${parseFloat(percent.toFixed(2))}%`,
    },
}

const Excel = () => {
    const [current, setCurrent] = useState(0);
    const [modalOpen, setModalOpen] = useState(false);

    //havent has api - not modelling data yet
    const [excelResult, setExcelResult] = useState<validateFmt>();
    const [errLogs, setErrLogs] = useState<Message[]>([]);
    const [warningLogs, setWarningLogs] = useState<Message[]>([]);

    const [onValidateExcel, setOnValidateExcel] = useState(false);
    const [onValidateServer, setOnValidateServer] = useState(false);

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
            console.log("file size: ", file.size)
            if (file.size >= 15728640) {
                message.error('File size exceed 15MB!', 1.5)
                return false;
            }
            const workbook = new ExcelJS.Workbook();
            const excelData = await FileService.handleImportSemester(file, workbook)
            console.log("import data here", excelData);
            setExcelResult(excelData)
            setOnValidateExcel(true);
            return false
        } catch (error) {
            console.log("Error when receive excel file ", error);
            return false
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
                            handleClearExcel();
                            actions.remove(file)
                        }} style={{ fontSize: 16 }}
                    />
                </div>
            </div>
        );
    };

    const handleClearExcel = () => {
        setOnValidateExcel(false);
        setExcelResult({
            result: [],
            errors: []
        })
        setErrLogs([])
        setWarningLogs([])
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
        // console.log("Changed ", excelResult);
    }, [excelResult])

    return (
        <div className={styles.excelValidateCtn}>
            <Button type="primary" onClick={() => setModalOpen(true)}>
                Display a modal
            </Button>
            <Modal
                title="Import Excel Document"
                centered
                open={modalOpen}
                onOk={() => setModalOpen(false)}
                onCancel={() => setModalOpen(false)}
            >
                <div
                    style={{ minHeight: '70vh' }}
                >
                    <Steps
                        current={current}
                        items={[
                            {
                                title: 'Validate Excel',
                                description: 'hehe',
                                // icon: onValidateExcel ? <LoadingOutlined /> : <FileExcelOutlined />
                            },
                            {
                                title: 'Checking on server',
                                description: 'hehe',
                                // icon: onValidateServer ? <LoadingOutlined /> : <CloudServerOutlined />
                            },
                        ]}
                    />
                    <Upload.Dragger
                        name='file'
                        beforeUpload={(file) => handleExcel(file)}
                        action={''}
                        maxCount={1}
                        {...props}
                        itemRender={customItemRender}
                    // accept={'.xlsx'}
                    //  onChange={(file) => handleExcel(file)}
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
                        onValidateExcel ? (
                            <>
                                <Typography.Text># Those record will be ignored, please consider again before continue</Typography.Text>
                                {
                                    (errLogs.length > 0) ? (<MessageCard props={errLogs} isSuccess={false} />) : ('')
                                }
                                {
                                    (warningLogs.length > 0) ? (<MessageCard props={warningLogs} isSuccess={false} />) : ('')
                                }
                                {
                                    (warningLogs.length === 0 && errLogs.length === 0) ? (<MessageCard props={[]} isSuccess={true} />) : ('')
                                }
                            </>
                        ) : ('')
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