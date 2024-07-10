import ExcelJS from 'exceljs';
import { ValidateHelper } from './ValidateHelper';
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
              const isValid = ValidateHelper.dateChecker(
                'DD/MM/YYYY',
                cell.value,
              );
              if (!isValid && isValid !== undefined) {
                createMsgLog({
                  type: 'error',
                  message: `Wrong date format at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              }
            }
          } else {
            isValidRecord = false;
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

const handleImportStudent = (
  excelFile: RcFile,
  workbook: ExcelJS.Workbook,
  creator: string, //adminID
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
    const worksheet = workbook.getWorksheet('Import-Student');

    //Check worksheet exist
    if (worksheet) {
      const startRow = 4;
      const endRow = 38;
      const columns = [
        {
          index: 'B',
          name: '#',
          param: 'index',
          isNull: false,
        },
        {
          index: 'C',
          name: 'MSSV',
          param: 'StudentCode',
          isNull: false,
        },
        {
          index: 'D',
          name: 'Tên học sinh',
          param: 'DisplayName',

          isNull: false,
        },
        {
          index: 'E',
          name: 'Email',
          param: 'Email',
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
            if (col.index !== 'B') {
              rowData[col.param] = cell.value;
            }
            //  a829c0b5-78dc-4194-a424-08dc8640e68a
            //Check MSSV unique and not contain special char
            if (col.index === 'C') {
              const mssv = cell.value;

              const isDuplicated = sample.filter((item) => item.C === mssv);

              const isContainSpecialChar = ValidateHelper.emojiChecker(
                String(mssv),
              );
              if (isDuplicated.length > 0) {
                createMsgLog({
                  type: 'warning',
                  message: `MSSV duplicated at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              }
              if (isContainSpecialChar) {
                createMsgLog({
                  type: 'warning',
                  message: `MSSV at cell ${col.index}${i} contains special character`,
                });
                isValidRecord = false;
              }
            }

            //Check email format
            if (col.index === 'E') {
              const isValidEmail = ValidateHelper.emailChecker(
                String(cell.value),
              );
              if (!isValidEmail) {
                createMsgLog({
                  type: 'warning',
                  message: `Wrong email format at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              }
            }
          } else {
            isValidRecord = false;
          }
        });
        if (isValidRecord) {
          rowData['CreateBy'] = creator;
          sample.push(rowData);
        } else if (
          //Collumn mssv, ho ten, email
          Object.keys(rowData).length < 4 &&
          Object.keys(rowData).length > 1
        ) {
          console.log('Err her,', rowData);
          createMsgLog({
            type: 'warning',
            message: `Unvalid record at row ${i}`,
          });
        }
      }
      console.log('sample, ', sample);

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

export const FileHelper = {
  handleImportSemester,
  handleImportStudent,
};
