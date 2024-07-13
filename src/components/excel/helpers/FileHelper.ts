import ExcelJS from 'exceljs';
import { ValidateHelper } from './ValidateHelper';
import { RcFile } from 'antd/es/upload';
import moment from 'moment';

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

const handleImportSchedule = (
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
    const worksheet1 = workbook.getWorksheet('page-1_table-1');
    const worksheet2 = workbook.getWorksheet('page-1_table-2');
    const sample: any[] = [];
    const sample2: any[] = [];

    //Check worksheet exist
    if (worksheet1 === undefined || worksheet2 === undefined) {
      console.log('notfound');
      createMsgLog({
        type: 'error',
        message:
          'Worksheet name not match, please do not change sheet name and make sure it has name page-1_table-1 and page-1_table-2',
      });
      return [];
    }
    //Worksheet 1 - scan weekly time
    const columns = [
      {
        index: 'A',
        name: 'MON', // For visualize
        param: 'mon',
        isNull: false,
      },
      {
        index: 'B',
        name: 'TUE',
        param: 'tue',
        isNull: false,
      },
      {
        index: 'C',
        name: 'WED',
        param: 'wed',
        isNull: false,
      },
      {
        index: 'D',
        name: 'THU',
        param: 'thu',
        isNull: false,
      },
      {
        index: 'E',
        name: 'FRI',
        param: 'fri',
        isNull: false,
      },
      {
        index: 'F',
        name: 'SAT',
        param: 'sat',
        isNull: false,
      },
      {
        index: 'G',
        name: 'SUN',
        param: 'sun',
        isNull: false,
      },
    ];
    if (worksheet1) {
      //Validate and admit record in row 2
      columns.forEach((col) => {
        const cell = worksheet1!.getCell(`${col.index}2`);
        //Check if null value allowed (no -> not noted)
        if ((cell.value === null) === col.isNull) {
          // rowData[col.param] = cell.value;
          const day = col.param;
          const date = cell.value;
          sample.push({ [day]: date });
        }
      });
      if (sample.length !== 7) {
        createMsgLog({
          type: 'error',
          message: `Unvalid record at row 2`,
        });
      }
      console.log('sample ', sample);
    }

    //Scan for slot schedule
    if (worksheet2) {
      const startRow2 = 1;
      const endRow2 = 8;
      const columns2 = [
        {
          index: 'A',
          name: 'Slot', // For visualize
          param: 'slotNumber',
          isNull: false,
        },
        {
          index: 'B',
          name: 'MON',
          param: 'mon',
          isNull: false,
        },
        {
          index: 'C',
          name: 'TUE',
          param: 'tue',
          isNull: false,
        },
        {
          index: 'D',
          name: 'WED',
          param: 'wed',
          isNull: false,
        },
        {
          index: 'E',
          name: 'THU',
          param: 'thu',
          isNull: false,
        },
        {
          index: 'F',
          name: 'FRI',
          param: 'fri',
          isNull: false,
        },
        {
          index: 'G',
          name: 'SAT',
          param: 'sat',
          isNull: false,
        },
        {
          index: 'H',
          name: 'SUN',
          param: 'sun',
          isNull: false,
        },
      ];

      //Validate and admit cell record
      for (let i = startRow2; i <= endRow2; i++) {
        let currentSlot: any;

        columns2.forEach((col) => {
          const cellData: any = {};
          const cell = worksheet2!.getCell(`${col.index}${i}`);
          //Check if null value allowed (no -> not noted)
          if ((cell.value === null) === col.isNull && cell.value !== '-') {
            // Ktra cot A thi format slot number
            if (col.index === 'A') {
              const slot = String(cell.value).split(' ');
              const slotNumber = slot[1];
              currentSlot = slotNumber;
            } else {
              //Ktra tung cell, slot roi format
              const fmtObj = ValidateHelper.formatScheduleExcel(
                String(cell.value),
              );
              const { classCode, room } = fmtObj;

              if (classCode && room) {
                cellData['classCode'] = classCode;
                // cellData['roomName'] = room;
                cellData['date'] = col.param;
              } else {
                //Error when format regex
                createMsgLog({
                  type: 'warning',
                  message: `Unvalid value at cell ${col.index}${i}`,
                });
              }
            }

            if (Object.keys(cellData).length > 1) {
              cellData['slotNumber'] = currentSlot;
              sample2.push(cellData);
            }
          }
        });
      }
      console.log('sample2, ', sample2);
    }

    const dayMap = sample.reduce((acc, day) => {
      const [key, value] = Object.entries(day)[0];
      acc[key] = value;
      return acc;
    }, {});

    const updatedSchedule = sample2.map((item) => {
      const newItem = { ...item };
      if (dayMap[newItem.date]) {
        const date = dayMap[newItem.date];
        console.log('here in the date ', dayMap[newItem.date]);
        //
        // if(moment(date, 'DD/MM', true).isValid()){
        //   const show = moment(date, 'DD/MM', true).format('YYYY/MM/DD');
        // } else if(moment(date, 'DD/MM/YYYY', true).isValid()){
        //   console.log("object");
        // } else{

        // }

        newItem.date = dayMap[newItem.date];
      }
      return newItem;
    });
    console.log('Formateed here ', updatedSchedule);
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
  handleImportSchedule,
};
