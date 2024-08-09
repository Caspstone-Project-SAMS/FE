import ExcelJS from 'exceljs';
import { ValidateHelper } from './ValidateHelper';
import { RcFile } from 'antd/es/upload';
import moment from 'moment';
import { ExcelHelpers } from '../../../hooks/helpers/ExcelHelpers';

type validateFmt = {
  result?: any;
  errors: Message[];
  success: Message[];
  isContinueAble?: boolean;
};

type Message = {
  message: string;
  type: 'warning' | 'error' | 'success';
};

const handleImportSemester = (
  excelFile: RcFile,
  workbook: ExcelJS.Workbook,
) => {
  const result: validateFmt = {
    result: undefined,
    errors: [],
    success: [],
  };

  const createMsgLog = (log: Message) => {
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
  // creator: string, //adminID
) => {
  const result: validateFmt = {
    result: undefined,
    errors: [],
    success: [],
  };

  const createMsgLog = (log: Message) => {
    const { message, type } = log;
    result.errors.push({
      type: type,
      message: message,
    });
  };
  const createSucceedLog = (log: Message) => {
    const { message, type } = log;
    result.success.push({
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
            //Check MSSV unique and not contain special char
            if (col.index === 'C') {
              const mssv = cell.value;

              const isValidFormat = ExcelHelpers.checkValidStudentCode(
                String(mssv),
              );
              const isDuplicated = sample.filter(
                (item) => item.StudentCode === mssv,
              );

              const isContainSpecialChar = ValidateHelper.emojiChecker(
                String(mssv),
              );
              if (!isValidFormat) {
                createMsgLog({
                  type: 'warning',
                  message: `Student code is wrong format at cell ${col.index}${i}.\n Example receive: SE112233, MKT123456,...`,
                });
                isValidRecord = false;
              }
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
              const isDuplicated = sample.filter(
                (item) => item.Email === cell.value,
              );
              const isValidEmail = ValidateHelper.emailChecker(
                String(cell.value),
              );

              if (isDuplicated.length > 0) {
                createMsgLog({
                  type: 'warning',
                  message: `Duplicated email at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              }
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
          // rowData['CreateBy'] = creator;
          sample.push(rowData);
        } else if (
          //Collumn mssv, ho ten, email
          Object.keys(rowData).length !== 3 &&
          Object.keys(rowData).length >= 1
        ) {
          createMsgLog({
            type: 'warning',
            message: `Unvalid record at row ${i}`,
          });
        }
      }
      console.log('sample, ', sample);
      if (sample.length > 0) {
        createSucceedLog({
          type: 'success',
          message:
            sample.length === 1
              ? '1 record has been successfully written'
              : `${sample.length} records have been successfully written`,
        });
      }

      return sample;
    } else {
      createMsgLog({
        type: 'error',
        message:
          'Worksheet name not match, make sure file sheet has name Import-Student',
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

const handleImportClass = (excelFile: RcFile, workbook: ExcelJS.Workbook) => {
  const result: validateFmt = {
    result: undefined,
    errors: [],
    success: [],
  };

  const createMsgLog = (log: Message) => {
    const { message, type } = log;
    result.errors.push({
      type: type,
      message: message,
    });
  };
  const createSucceedLog = (log: Message) => {
    const { message, type } = log;
    result.success.push({
      type: type,
      message: message,
    });
  };
  const promise = workbook.xlsx.load(excelFile).then((workbook) => {
    const worksheet = workbook.getWorksheet('Import-Class');
    const sample: any[] = [];

    //Check worksheet exist
    if (worksheet === undefined) {
      createMsgLog({
        type: 'error',
        message:
          'Worksheet name not match, please do not change sheet name and make sure it has name Import-Class',
      });
      return [];
    }

    if (worksheet) {
      const startRow = 4;
      const endRow = 38;
      const columns = [
        {
          index: 'B',
          name: '#', // For visualize
          param: 'index',
          isNull: false,
        },
        {
          index: 'C',
          name: 'Class Code',
          param: 'classCode',
          isNull: false,
        },
        {
          index: 'D',
          name: 'Student Code',
          param: 'studentCode',
          isNull: false,
        },
      ];
      for (let i = startRow; i <= endRow; i++) {
        let isValidRecord = true;
        const rowData: any = {};
        //Validate and admit record
        columns.forEach((col) => {
          const cell = worksheet!.getCell(`${col.index}${i}`);
          //Check if null value allowed (no -> not noted)
          if ((cell.value === null) === col.isNull) {
            if (col.index === 'C') {
              rowData[col.param] = cell.value;
            }

            if (col.index === 'D') {
              const mssv = cell.value;
              const isDuplicated = sample.filter(
                (item) =>
                  item['studentCode'] === mssv &&
                  item['classCode'] === rowData['classCode'],
              );
              if (isDuplicated.length > 0) {
                isValidRecord = false;
                createMsgLog({
                  type: 'warning',
                  message: `Duplicate value at row ${i}`,
                });
              } else {
                rowData[col.param] = cell.value;
              }
            }
          } else {
            isValidRecord = false;
          }
        });
        if (isValidRecord) {
          sample.push(rowData);
        } else if (
          //Collumn subjectCode, mssv
          Object.keys(rowData).length < 4 &&
          Object.keys(rowData).length > 1
        ) {
          createMsgLog({
            type: 'warning',
            message: `Unvalid record at row ${i}`,
          });
        }
      }
      console.log('sample ', sample);
    }

    if (sample.length > 0) {
      createSucceedLog({
        type: 'success',
        message:
          sample.length === 1
            ? '1 record has been successfully written'
            : `${sample.length} records have been successfully written`,
      });
    }
    return sample;
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

const handleImportFAPClass = (
  excelFile: RcFile,
  workbook: ExcelJS.Workbook,
) => {
  const result: validateFmt = {
    result: undefined,
    errors: [],
    success: [],
  };

  const createMsgLog = (log: Message) => {
    const { message, type } = log;
    result.errors.push({
      type: type,
      message: message,
    });
  };
  const createSucceedLog = (log: Message) => {
    const { message, type } = log;
    result.success.push({
      type: type,
      message: message,
    });
  };

  const promise = workbook.xlsx.load(excelFile).then((workbook) => {
    const worksheet = workbook.getWorksheet('Sheet1');
    const sample: any[] = [];

    //Check worksheet exist
    if (worksheet === undefined) {
      createMsgLog({
        type: 'error',
        message:
          'Worksheet name not match, please do not change sheet name and make sure it has name Sheet1',
      });
      return [];
    }

    if (worksheet) {
      const startRow = 2;
      const endRow = 151;
      const columns = [
        {
          index: 'A',
          name: 'Class', // For visualize
          param: 'classCode',
          isNull: false,
        },
        {
          index: 'B',
          name: 'Roll number', // For visualize
          param: 'studentCode',
          isNull: false,
        },
        {
          index: 'C',
          name: 'Email',
          param: 'email',
          isNull: false,
        },
        {
          index: 'D',
          name: 'Member Code',
          param: 'memberCode',
          isNull: false,
        },
        {
          index: 'E',
          name: 'Student name',
          param: 'displayName',
          isNull: false,
        },
      ];

      for (let i = startRow; i <= endRow; i++) {
        let isValidRecord = true;
        const rowData: any = {};

        //Validate and admit record
        columns.forEach((col) => {
          const cell = worksheet!.getCell(`${col.index}${i}`);
          //Check if null value allowed (no -> not noted)
          if ((cell.value === null) === col.isNull) {
            if (col.index === 'A') {
              const classCode = String(cell.value);
              //Class code contain spaces between text
              if (classCode.trim().split(' ').length > 1) {
                createMsgLog({
                  type: 'warning',
                  message: `Class code is wrong format, can not contain white space at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              } else {
                rowData[col.param] = cell.value;
              }
            }
            //Check duplicated studentCode?
            if (col.index === 'B') {
              const studentCode = cell.value;
              const isDuplicated = sample.filter(
                (item) => item.studentCode === studentCode,
              );
              if (isDuplicated.length > 0) {
                createMsgLog({
                  type: 'warning',
                  message: `Student code duplicated at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              } else {
                rowData[col.param] = cell.value;
              }
            }
          } else {
            isValidRecord = false;
          }
        });
        if (isValidRecord) {
          if (sample.length <= 150) {
            sample.push(rowData);
          }
        } else if (
          //Collumn classCode, StudentCode
          Object.keys(rowData).length === 3
        ) {
          createMsgLog({
            type: 'warning',
            message: `Unvalid record at row ${i}`,
          });
        }
      }
      if (sample.length > 150) {
        createMsgLog({
          type: 'warning',
          message: 'Maximum 150 records, exceeded records will be ignore.',
        });
      }
    }

    if (sample.length > 0) {
      createSucceedLog({
        type: 'success',
        message:
          sample.length === 1
            ? '1 record has been successfully written'
            : `${sample.length} records have been successfully written`,
      });
    }
    console.log('Sample ', sample);
    return sample;
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

//Also support import student to class if excel file perfect
const handleImportFAPStudent = (
  excelFile: RcFile,
  workbook: ExcelJS.Workbook,
) => {
  const result: validateFmt = {
    result: undefined,
    errors: [],
    success: [],
    isContinueAble: false,
  };

  const createMsgLog = (log: Message) => {
    const { message, type } = log;
    result.errors.push({
      type: type,
      message: message,
    });
  };
  const createSucceedLog = (log: Message) => {
    const { message, type } = log;
    result.success.push({
      type: type,
      message: message,
    });
  };

  const promise = workbook.xlsx.load(excelFile).then((workbook) => {
    const worksheet = workbook.getWorksheet('Sheet1');
    let sample: any[] = [];
    const sampleClass: any[] = [];

    //Check worksheet exist
    if (worksheet === undefined) {
      createMsgLog({
        type: 'error',
        message: `Worksheet name not meet requirements, please make sure thats: \n
          1. Excel file from FAP system, and extension file is .xlxs \n
          2. Sheet name is: "Sheet1"`,
      });
      return [];
    }

    if (worksheet) {
      const startRow = 2;
      const endRow = 151;
      const columns = [
        {
          index: 'A',
          name: 'Class', // For visualize
          param: 'classCode',
          isNull: false,
        },
        {
          index: 'B',
          name: 'Roll number', // For visualize
          param: 'studentCode',
          isNull: false,
        },
        {
          index: 'C',
          name: 'Email',
          param: 'email',
          isNull: false,
        },
        {
          index: 'D',
          name: 'Member Code',
          param: 'memberCode',
          isNull: false,
        },
        {
          index: 'E',
          name: 'Student name',
          param: 'displayName',
          isNull: false,
        },
      ];

      for (let i = startRow; i <= endRow; i++) {
        let isValidRecord = true;
        const rowData: any = {};

        //Validate and admit record
        columns.forEach((col) => {
          const cell = worksheet!.getCell(`${col.index}${i}`);
          //Check if null value allowed (no -> not noted)
          if ((cell.value === null) === col.isNull) {
            //Check if file contain classcode and continue imprt to class
            if (col.index === 'A') {
              sampleClass.push({ classCode: cell.value });
            }
            //Write all the cell, but not valid then will not push
            if (col.index === 'B' || col.index === 'C' || col.index === 'E') {
              rowData[col.param] = cell.value;
            }

            //Check MSSV unique and not contain special char and not having spaces in between
            if (col.index === 'B') {
              const mssv = cell.value;

              const isDuplicated = sample.filter(
                (item) => item.studentCode === mssv,
              );
              const isContainSpecialChar = ValidateHelper.emojiChecker(
                String(mssv),
              );
              const isValidFormat = ExcelHelpers.checkValidStudentCode(
                String(mssv),
              );

              if (!isValidFormat) {
                createMsgLog({
                  type: 'warning',
                  message: `Student code is wrong format at cell ${col.index}${i}.\n Example receive: SE112233, MKT123456,...`,
                });
                isValidRecord = false;
              }

              if (isDuplicated.length > 0) {
                createMsgLog({
                  type: 'warning',
                  message: `Student code duplicated at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              }
              if (isContainSpecialChar) {
                createMsgLog({
                  type: 'warning',
                  message: `Student code at cell ${col.index}${i} contains special character`,
                });
                isValidRecord = false;
              }
            }

            //Check email
            if (col.index === 'C') {
              const isValidEmail = ValidateHelper.emailChecker(
                String(cell.value),
              );
              const isDuplicated = sample.filter(
                (item) => item.email === cell.value,
              );

              if (isDuplicated.length > 0) {
                createMsgLog({
                  type: 'warning',
                  message: `Duplicated email at cell ${col.index}${i}`,
                });
                isValidRecord = false;
              }
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
          if (sample.length <= 150) {
            sample.push(rowData);
          }
        } else if (
          //Collumn StudentCode, email, fullname
          Object.keys(rowData).length !== 3 &&
          Object.keys(rowData).length >= 1
        ) {
          console.log('Creating the unvalid record ', rowData);
          createMsgLog({
            type: 'warning',
            message: `Unvalid record at row ${i}`,
          });
        }
      }

      if (sample.length > 150) {
        createMsgLog({
          type: 'warning',
          message: 'Maximum 150 records, exceeded records will be ignore.',
        });
      }
    }
    //Check if record import to class satisfied in import student
    //if yes -> merge 2 obj and continue return diff to parent and need to format outside once again
    if (sample.length === sampleClass.length && sample.length > 0) {
      console.log('File oke, can continue import to class');
      result.isContinueAble = true;
      sample = sample.map((item, index) => {
        return { ...item, ...sampleClass[index] };
      });
      createSucceedLog({
        type: 'success',
        message:
          sample.length === 1
            ? '1 record has been successfully written'
            : `${sample.length} records have been successfully written`,
      });
    } else {
      if (sample.length > 0) {
        createSucceedLog({
          type: 'success',
          message:
            sample.length === 1
              ? '1 record has been successfully written'
              : `${sample.length} records have been successfully written`,
        });
      }
    }
    console.log('Sample ', sample);
    console.log('SampleClasscode ', sampleClass);
    return sample;
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
  isContinueAble: boolean,
) => {
  const result: validateFmt = {
    result: undefined,
    errors: [],
    success: [],
  };

  const createMsgLog = (log: Message) => {
    const { message, type } = log;
    result.errors.push({
      type: type,
      message: message,
    });
  };

  const createSucceedLog = (log: Message) => {
    const { message, type } = log;
    result.success.push({
      type: type,
      message: message,
    });
  };

  const promise = workbook.xlsx.load(excelFile).then((workbook) => {
    const worksheet1 = workbook.getWorksheet('page-1_table-1');
    const worksheet2 = workbook.getWorksheet('page-1_table-2');

    const uniqueList = new Set<string>();
    const sample: any[] = [];
    const sample2: any[] = [];

    //Check worksheet exist
    if (worksheet1 === undefined && worksheet2 === undefined) {
      createMsgLog({
        type: 'error',
        message:
          'Worksheet name not match, please do not change sheet name and make sure it has name page-1_table-1 and page-1_table-2',
      });
      return [];
    }
    //Laptop view - From extractedtable.com
    // if (worksheet1 !== undefined && worksheet2 === undefined) {
    //   const columns = [
    //     {
    //       index: 'A',
    //       name: 'slot', // For visualize
    //       param: 'slotNumber',
    //       isNull: false,
    //     },
    //     {
    //       index: 'B',
    //       name: 'MON',
    //       param: 'mon',
    //       isNull: false,
    //     },
    //     {
    //       index: 'C',
    //       name: 'TUE',
    //       param: 'tue',
    //       isNull: false,
    //     },
    //     {
    //       index: 'D',
    //       name: 'WED',
    //       param: 'wed',
    //       isNull: false,
    //     },
    //     {
    //       index: 'E',
    //       name: 'THU',
    //       param: 'thu',
    //       isNull: false,
    //     },
    //     {
    //       index: 'F',
    //       name: 'FRI',
    //       param: 'fri',
    //       isNull: false,
    //     },
    //     {
    //       index: 'G',
    //       name: 'SAT',
    //       param: 'sat',
    //       isNull: false,
    //     },
    //     {
    //       index: 'H',
    //       name: 'SUN',
    //       param: 'sun',
    //       isNull: false,
    //     },
    //   ];
    //   const startRow = 1;
    //   const endRow = 30;

    //   for (let i = startRow; i <= endRow; i++) {
    //     let currentSlot: any;

    //     columns.forEach((col) => {
    //       const cell = worksheet1!.getCell(`${col.index}${i}`);
    //       const cellValue = String(cell.value);
    //       const cellData: any = {};

    //       //Check if null value allowed (no -> not noted)
    //       if (
    //         (cellValue === null) === col.isNull &&
    //         cellValue !== '-' &&
    //         cellValue.length > 0
    //       ) {
    //         //Format date
    //         if (i === 2 && col.index !== 'A') {
    //           let date = '';
    //           const dateVal = String(cell.value);
    //           const isMonthFmt = moment(dateVal, 'DD/MM', true).isValid();
    //           const isYearFmt = moment(dateVal, 'DD/MM/YYYY', true).isValid();

    //           if (isMonthFmt) {
    //             const dateFormatted = moment(dateVal, 'DD/MM', true).format(
    //               'YYYY-MM-DD',
    //             );
    //             date = dateFormatted;
    //           } else if (isYearFmt) {
    //             const dateFormatted = moment(
    //               dateVal,
    //               'DD/MM/YYYY',
    //               true,
    //             ).format('YYYY-MM-DD');
    //             date = dateFormatted;
    //           } else {
    //             createMsgLog({
    //               type: 'error',
    //               message: `Unvalid date format at cell ${col.index}2 in table 1`,
    //             });
    //           }

    //           const day = col.param;
    //           // const date = cell.value;
    //           sample.push({ [day]: date });
    //         }

    //         //Format schedule and slot
    //         if (i >= 3) {
    //           //Slot
    //           if (col.index === 'A') {
    //             const slot = String(cellValue).split(' ');
    //             const slotNumber = slot[1];
    //             currentSlot = slotNumber;
    //           } else {
    //             //Ktra tung cell, slot roi format
    //             const fmtObj = ValidateHelper.formatScheduleExcel(
    //               String(cellValue),
    //             );
    //             const { classCode, room } = fmtObj;

    //             if (classCode && room) {
    //               cellData['classCode'] = classCode;
    //               // cellData['roomName'] = room;
    //               cellData['date'] = col.param;
    //             } else {
    //               //Error when format regex
    //               if (!cellValue) {
    //                 createMsgLog({
    //                   type: 'warning',
    //                   message: `Unvalid value at cell ${col.index}${i}`,
    //                 });
    //               }
    //             }
    //             if (Object.keys(cellData).length > 1) {
    //               cellData['slotNumber'] = currentSlot;
    //               sample2.push(cellData);
    //             }
    //           }
    //         }
    //       }
    //     });
    //   }
    //   if (sample.length !== 7) {
    //     createMsgLog({
    //       type: 'error',
    //       message: `Unvalid record at row 2`,
    //     });
    //   }
    //   console.log('Sample ', sample);
    //   console.log('Sample2 ', sample2);
    //   const dayMap = sample.reduce((acc, day) => {
    //     const [key, value] = Object.entries(day)[0];
    //     acc[key] = value;
    //     return acc;
    //   }, {});

    //   const updatedSchedule = sample2.map((item) => {
    //     const newItem = { ...item };
    //     if (dayMap[newItem.date]) {
    //       newItem.date = dayMap[newItem.date];
    //     }
    //     return newItem;
    //   });
    //   console.log('Formateed here ', updatedSchedule);
    //   return updatedSchedule;
    // } else {
    //No longer support extracttable.com -> too least data to test, format not consisted
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
    if (worksheet1 && worksheet2) {
      //Validate and admit record in row 2
      columns.forEach((col) => {
        const cell = worksheet1!.getCell(`${col.index}2`);
        //Check if null value allowed (no -> not noted)
        if ((cell.value === null) === col.isNull) {
          let date = '';
          const dateVal = String(cell.value);
          const isMonthFmt = moment(dateVal, 'DD/MM', true).isValid();
          const isYearFmt = moment(dateVal, 'DD/MM/YYYY', true).isValid();

          if (isMonthFmt) {
            const dateFormatted = moment(dateVal, 'DD/MM', true).format(
              'YYYY-MM-DD',
            );
            date = dateFormatted;
          } else if (isYearFmt) {
            const dateFormatted = moment(dateVal, 'DD/MM/YYYY', true).format(
              'YYYY-MM-DD',
            );
            date = dateFormatted;
          } else {
            createMsgLog({
              type: 'error',
              message: `Unvalid date format at cell ${col.index}2 in table 1`,
            });
          }

          // let isDuplicates = false;
          // for (let i = 0; i < sample.length; i++) {
          //   const value = Object.values(sample[i])[0];
          //   console.log('hehe, this is value ', value);
          //   console.log('hehe, this is uniqueList ', uniqueList);
          //   if (uniqueList.has(date)) {
          //     console.log('Yes, dup her ', value);
          //     isDuplicates = true;
          //     break;
          //   } else {
          //     uniqueList.add(date);
          //   }
          // }
          // if (isDuplicates) {
          //   createMsgLog({
          //     type: 'error',
          //     message: `
          //     Duplicate date at cell ${col.index}2 in table 1 \n
          //     This will resulted in errors, please adjust before continue
          //     `,
          //   });
          // }

          // console.log('alo', { [day]: date });
          // const date = cell.value;
          const day = col.param;
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

    //Scan for slot schedule--------------------------------------------
    if (worksheet2) {
      const startRow2 = 1;
      const endRow2 = 30;
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
          const cellValue = String(cell.value);

          //Check if null value allowed (no -> not noted)
          if (
            (cellValue === null) === col.isNull &&
            cellValue !== '-' &&
            cellValue.length > 0
          ) {
            // Ktra cot A thi format slot number
            if (col.index === 'A') {
              const slot = String(cellValue).split(' ');
              const slotNumber = slot[1];
              currentSlot = slotNumber;
            } else {
              //Ktra tung cell, slot roi format
              const fmtObj = ValidateHelper.formatScheduleExcel(
                String(cellValue),
              );
              const { classCode, room } = fmtObj;

              if (classCode && room) {
                cellData['classCode'] = classCode;
                // cellData['roomName'] = room;
                cellData['date'] = col.param;
              } else {
                //Error when format regex
                if (!cellValue) {
                  createMsgLog({
                    type: 'warning',
                    message: `Unvalid value at cell ${col.index}${i}`,
                  });
                }
              }
            }
            console.log('This is cellData ', cellData);
            if (Object.keys(cellData).length > 1) {
              cellData['slotNumber'] = currentSlot;
              sample2.push(cellData);
            }
            // else if(Object.keys(cellData).length > 1 && ){
            //   createMsgLog({
            //     type: 'error',
            //     message: `Invalid format data at ${col.index}${i} - Val: ${JSON.stringify(cellData)}`,
            //   });
            // }
          }
        });
      }
      if (sample2.length > 0) {
        createSucceedLog({
          type: 'success',
          message:
            sample2.length === 1
              ? '1 record has been successfully written'
              : `${sample2.length} records have been successfully written`,
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
      //merge 2 arr from 2 table base on mon, tue, wed,... col
      if (dayMap[newItem.date]) {
        newItem.date = dayMap[newItem.date];

        if (isContinueAble) {
          //add attr for continue import other weeks
          newItem.dayOfWeek = item.date;
        }
      }
      return newItem;
    });
    console.log('Formateed here ', updatedSchedule);
    return updatedSchedule;
    // }
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
  handleImportClass,
  handleImportSchedule,
  handleImportFAPClass,
  handleImportFAPStudent,
};

// const readDataFromFile = (data: any) => {
//   const workbook = new ExcelJS.Workbook();
//   workbook.xlsx.load(data).then((workbook) => {
//     console.log(workbook, 'workbook instance');

//     workbook.eachSheet((sheet, id) => {
//       sheet.eachRow((row, rowIndex) => {
//         console.log('Row info, ', row);
//         console.log(row.values, rowIndex);
//         const rowData = row.values;

//         // Check if the row has the columns A to E
//         const colA = rowData[1];
//         const colB = rowData[2];
//         const colC = rowData[3];
//         const colD = rowData[4];
//         const colE = rowData[5];

//         if (colA && colB && colC && colD && colE) {
//           console.log('Cell val: ', row.values);
//           // Example: Check if columns A to E are not empty
//           console.log('All columns A to E are present and not empty');
//         }
//       });
//     });
//   });
// };
// readDataFromFile(excelFile);
