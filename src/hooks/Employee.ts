import axios from 'axios';
import { EMPLOYEE_API } from '.';
import { Employee, EmployeeDetails } from '../models/employee/Employee';

const getEmployeeByID = async (lecturerID: number): Promise<EmployeeDetails | null> => {
    try {
      const response = await axios.get(`${EMPLOYEE_API}/${lecturerID}`, {
        headers: {
          'accept': '*/*'
        }
      });
      return response.data as EmployeeDetails;
    } catch (error) {
      console.error('Error on get employee by ID: ', error);
      return null;
    }
  };

const getAllEmployee = async (): Promise<Employee | null> => {
  try {
    const response = await axios.get(`${EMPLOYEE_API}?roleId=2`);

    return response.data as Employee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const get10Employee = async (): Promise<Employee | null> => {
  try {
    const response = await axios.get(EMPLOYEE_API, {
      params: {
        quantity: 10,
        roleId: 2,
      },
    });

    return response.data as Employee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const searchByParams = async (
  email: string,
  phone: string,
  department: string,
): Promise<Employee | null> => {
  try {
    const response = await axios.get(EMPLOYEE_API, {
      params: {
        quantity: 10,
        roleId: 2,
        email: email ? email : '',
        phone: phone ? phone : '',
        department: department ? department : '',
      },
    });

    return response.data as Employee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const EmployeeService = {
  getAllEmployee,
  get10Employee,
  searchByParams,
  getEmployeeByID,
};
