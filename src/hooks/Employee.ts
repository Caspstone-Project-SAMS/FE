import axios, { AxiosError } from 'axios';
import { EMPLOYEE_API } from '.';
import { Employee, EmployeeDetails } from '../models/employee/Employee';
import { isRejectedWithValue } from '@reduxjs/toolkit';

const getEmployeeByID = async (lecturerID: string): Promise<EmployeeDetails | null> => {
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

const createLecturer = async (
  UserName: string,
  Email: string,
  DisplayName: string,
) => {
  try {
    const response = await axios.post(
      EMPLOYEE_API, 
      [
        {
          UserName,
          Email,
          DisplayName,
        },
      ],
      {
        headers: {
          'accept': '*/*',
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log('Error:', error.message);
      throw new AxiosError(error.response.data);
    }
    return isRejectedWithValue(error.message);
  }
};


export const EmployeeService = {
  getAllEmployee,
  get10Employee,
  searchByParams,
  getEmployeeByID,
  createLecturer,
};
