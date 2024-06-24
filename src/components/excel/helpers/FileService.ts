import ExcelJS from 'exceljs';
import { ValidateService } from './ValidateService';
import { RcFile } from 'antd/es/upload';

type validateFmt = {
  result?: any;
  errors: validateError[];
};

type validateError = {
  type: 'warning' | 'error';
  message: string;
};

const handleImportSemester = (
  excelFile: RcFile,
  workbook: ExcelJS.Workbook,
) => {
  const result: validateFmt = {
    result: undefined,
    errors: [],
  };

  const createMsgLog = (log: validateError) => {
    const { message, type } = log;
    result.errors.push({
      type: type,
      message: message,
    });
  };

  const promise = workbook.xlsx.load(excelFile).then((workbook) => {
    const worksheet = workbook.getWorksheet('Import-Semester');

    //Check worksheet exist
    if (worksheet) {
      const startRow = 4;
      const endRow = 38;
      const columns = [
        {
          index: 'B',
          name: '#',
          isNull: false,
        },
        {
          index: 'C',
          name: 'Mã Kỳ',
          isNull: false,
        },
        {
          index: 'D',
          name: 'Tình trạng kỳ',
          isNull: false,
        },
        {
          index: 'E',
          name: 'Ngày bắt đầu',
          isNull: false,
        },
        {
          index: 'F',
          name: 'Ngày kết thúc',
          isNull: false,
        },
        {
          index: 'G',
          name: 'Tạo bởi',
          isNull: false,
        },
      ];

      const sample = [];
      //Validate and admit record
      for (let i = startRow; i <= endRow; i++) {
        let isValidRecord = true;
        const rowData: any = {};
        columns.forEach((col) => {
          const cell = worksheet!.getCell(`${col.index}${i}`);
          //Check if null value allowed (no -> not noted)
          if ((cell.value === null) === col.isNull) {
            rowData[col.index] = cell.value;
            //Check date type is valid
            if (col.index === 'E') {
              const isValid = ValidateService.DateChecker(
                'DD/MM/YYYY',
                cell.value,
              );
              if (!isValid && isValid !== undefined) {
                createMsgLog({
                  type: 'error',
                  message: `Wrong date format at cell ${col.index}${i}`,
                });
              }
            }
          } else {
            isValidRecord = false;
            // createMsgLog({
            //   type: 'warning',
            //   message: `Missing value at cell ${col.index}${i}`,
            // });
            // return;
          }
        });
        if (isValidRecord) {
          sample.push(rowData);
        } else if (
          Object.keys(rowData).length < 6 &&
          Object.keys(rowData).length > 1
        ) {
          createMsgLog({
            type: 'warning',
            message: `Unvalid record at row ${i}`,
          });
        }
      }
      console.log('sample, ', sample);

      const isGud =
        result.errors.length > 0 ? result.errors : 'Succeed, no error here';
      console.log('Log Result here ', isGud);
      return sample;
    } else {
      createMsgLog({
        type: 'error',
        message: 'Worksheet name not match, please do not change sheet name',
      });
    }
  });

  return promise
    .then((data) => {
      console.log('Data promise ', data);
      result.result = data;
      return result;
    })
    .catch((e) => {
      createMsgLog({
        type: 'error',
        message: 'File unvalid, only accept .xlsx file',
      });
      return result;
    });
};

export const FileService = {
  handleImportSemester,
};
