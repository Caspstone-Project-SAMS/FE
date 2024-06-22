import React, { useState } from 'react'
import ExcelJS from 'exceljs'
import { Button, message, Modal, Upload } from 'antd'
import { UploadOutlined } from '@ant-design/icons'
import { ValidateService } from './helpers/ValidateService'

type validateFmt = {
    result?: any,
    errors: validateError[],
}

type validateError = {
    type: 'warning' | 'error',
    message: string
}

// const props: UploadProps = {
//     name: 'file',
//     action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
//     headers: {
//       authorization: 'authorization-text',
//     },
//     onChange(info) {
//       if (info.file.status !== 'uploading') {
//         console.log(info.file, info.fileList);
//       }
//       if (info.file.status === 'done') {
//         message.success(`${info.file.name} file uploaded successfully`);
//       } else if (info.file.status === 'error') {
//         message.error(`${info.file.name} file upload failed.`);
//       }
//     },
//   };

const handleImportSemester = (excelFile, workbook: ExcelJS.Workbook) => {
    const result: validateFmt = {
        result: undefined,
        errors: []
    }

    workbook.xlsx.load(excelFile)
        .then(workbook => {
            const worksheet = workbook.getWorksheet('Import-Semester')

            const startRow = 4;
            const endRow = 38;
            const columns = [
                {
                    index: 'B',
                    name: '#',
                    isNull: false
                },
                {
                    index: 'C',
                    name: 'Mã Kỳ',
                    isNull: false
                },
                {
                    index: 'D',
                    name: 'Tình trạng kỳ',
                    isNull: false
                },
                {
                    index: 'E',
                    name: 'Ngày bắt đầu',
                    isNull: false
                },
                {
                    index: 'F',
                    name: 'Ngày kết thúc',
                    isNull: false
                },
                {
                    index: 'G',
                    name: 'Tạo bởi',
                    isNull: false
                },];

            const sample = [];
            for (let i = startRow; i <= endRow; i++) {
                let isValidRecord = true;
                const rowData: any = {};
                columns.forEach((col) => {
                    const cell = worksheet!.getCell(`${col.index}${i}`);
                    //Check if null value allowed (no -> not noted)
                    if ((cell.value === null) === col.isNull) {
                        rowData[col.index] = cell.value;

                        if (col.index === 'E') {
                            const isValid = ValidateService.DateChecker('DD/MM/YYYY', cell.value);
                            if (!isValid && isValid !== undefined) {
                                result.errors.push({
                                    type: 'error',
                                    message: `Wrong date format at cell ${col.index}${i}`
                                })
                            }
                        }
                    } else {
                        isValidRecord = false
                        result.errors.push({
                            type: 'warning',
                            message: `Missing value at cell ${col.index}${i}`
                        });
                        return;
                    }
                });
                if (isValidRecord) {
                    sample.push(rowData);
                }
            }
            console.log("after, ", sample);

            const isGud = result.errors.length > 0 ? result.errors : 'Succeed, no error here'
            console.log("Result here ", ...isGud);
        })
}

const Excel = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const wb = new ExcelJS.Workbook();

    const handleExcel = (file) => {
        try {
            const workbook = new ExcelJS.Workbook();
            handleImportSemester(file, workbook);
            return false
        } catch (error) {
            console.log("Error when receive excel file ", error);
            return false
        }

    }

    return (
        <div>
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
                <Upload name='file'
                    beforeUpload={(file) => handleExcel(file)}
                    action={''}
                //  onChange={(file) => handleExcel(file)}
                >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                </Upload>
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