import { CalendarService } from '../../../hooks/Calendar';
import { StudentService } from '../../../hooks/StudentList';
import { ScheduleResponse } from '../../../models/excel/Excel';
import { Message } from '../../../models/excel/LogMessage';

type Data = {
  status: boolean;
  data: string;
  errors: string[];
};

type Result = {
  successLogs: Message[];
  errorLogs: Message[];
  warningLogs: Message[];
  data?: Data;
};

const postExcelStudent = async (studentList): Promise<Result> => {
  const response = StudentService.importExcelStudent(studentList);
  let successLogs: Message[] = [];
  let errorLogs: Message[] = [];
  const result: Result = {
    successLogs: [],
    errorLogs: [],
    warningLogs: [],
    data: undefined,
  };

  return response
    .then((data) => {
      //Ktra fail 90%, 1 record dung -> Show những record đã dc tạo, in lỗi những record sai
      const createdListArr = data.data.result.map((item) => item.studentCode);
      if (createdListArr) {
        const createdTxt = `Created ${createdListArr.join(', ')}`;
        successLogs = [
          {
            type: 'success',
            message: createdTxt,
          },
        ];
      }
      const errList = data.data.errors;
      if (errList.length > 0) {
        errorLogs = errList.map((err) => ({
          type: 'error',
          message: err,
        }));
      }

      const fmtData: Data = {
        status: true,
        data: data.data.result,
        errors: data.data.errors,
      };

      result.successLogs = successLogs;
      result.errorLogs = errorLogs;
      result.data = fmtData;
      return result;
      // setValidateSvResult(fmtData);
    })
    .catch((err) => {
      // setOnValidateServer(false)
      // setOnValidateExcel(false)
      const errResponses = err.response.data.errors;
      if (errResponses && Array.isArray(errResponses)) {
        errorLogs = errResponses.map((err) => ({
          type: 'error',
          message: err,
        }));
        // setWarningLogs([])
        // setErrLogs(fmtLogs);
        // setValidateSvResult(errData)
      }
      result.errorLogs = errorLogs;
      result.data = {
        status: false,
        data: '',
        errors: errResponses,
      };
      return result;
    });
};

const postExcelClass = async (classList): Promise<Result> => {
  const response = StudentService.importExcelClass(classList);
  const result: Result = {
    successLogs: [],
    errorLogs: [],
    warningLogs: [],
    data: undefined,
  };

  return response
    .then((response) => {
      console.log('SUCCESS when add to class ', response);
      const createdListArr = response.result.map((item) => {
        console.log('Im in each item ', item);
        return item.studentCode;
      });
      console.log('List arr ', createdListArr);
      if (createdListArr) {
        const createdTxt = `Created ${createdListArr.join(', ')}`;
        result.successLogs = [
          {
            type: 'success',
            message: createdTxt,
          },
        ];
      }
      const errList = response.errors;
      console.log('err list arr ', errList);
      if (errList.length > 0) {
        result.errorLogs = errList.map((err) => ({
          type: 'error',
          message: err,
        }));
      }

      result.data = {
        status: true,
        data: response.result,
        errors: response.errors,
      };

      return result;
    })
    .catch((err) => {
      console.log('Eror when add to class ', err);
      const errResponses = err.response.data.errors;
      if (errResponses && Array.isArray(errResponses)) {
        result.errorLogs = errResponses.map((err) => ({
          type: 'error',
          message: err,
        }));
      }

      result.data = {
        status: false,
        data: '',
        errors: errResponses,
      };
      return result;
    });
};

const postExcelSchedule = async (scheduleList): Promise<Result> => {
  const response = CalendarService.importExcelSchedule(scheduleList);
  const result: Result = {
    successLogs: [],
    errorLogs: [],
    warningLogs: [],
    data: undefined,
  };
  return response
    .then((response) => {
      if (response.isSuccess) {
        result.successLogs = [
          {
            type: 'success',
            message: response.title,
          },
        ];
        result.data = {
          status: true,
          data: response.title,
          errors: [],
        };
      } else {
        const errList = response.data.errors;
        if (errList.length > 0) {
          result.errorLogs = errList.map((err) => ({
            type: 'error',
            message: err,
          }));
        }
      }
      return result;
    })
    .catch((err) => {
      // console.log('Error occured in postexcelschedule', err);
      const errResponses = err.response.data.errors;
      if (errResponses && Array.isArray(errResponses)) {
        result.errorLogs = errResponses.map((err) => ({
          type: 'error',
          message: err,
        }));
      }

      result.data = {
        status: false,
        data: '',
        errors: errResponses,
      };
      return result;
    });
};

export const RequestHelpers = {
  postExcelStudent,
  postExcelClass,
  postExcelSchedule,
};
