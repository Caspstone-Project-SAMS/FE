import axios from 'axios';
import { EMPLOYEE_API } from '.';
import { Employee } from '../models/employee/Employee';

// const getEmployeeByID = async (id: number): Promise<SemesterDetail | null> => {
//     try {
//       const response = await axios.get(`${EMPLOYEE_API}/${id}`, {
//         headers: {
//           'accept': '*/*'
//         }
//       });
//       return response.data as SemesterDetail;
//     } catch (error) {
//       console.error('Error on get Semester by ID: ', error);
//       return null;
//     }
//   };

const getAllEmployee = async (): Promise<Employee | null> => {
  try {
    const response = await axios.get(`${EMPLOYEE_API}?roleId=2`);

    return response.data as Employee;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// const

export const EmployeeService = {
  getAllEmployee,
};
