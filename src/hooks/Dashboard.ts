import axios from 'axios';
import { DASHBOARD_API } from '.';

const getTotalStudent = async () => {
  return await axios.get(`${DASHBOARD_API}/total-students`);
};

const getTotalLecturer = async () => {
  return await axios.get(`${DASHBOARD_API}/total-lecturers`);
};
const getTotalSubject = async () => {
  return await axios.get(`${DASHBOARD_API}/total-subjects`);
};
const getTotalClass = async () => {
  return await axios.get(`${DASHBOARD_API}/total-classes`);
};

const getTotalModule = async () => {
  return await axios.get(`${DASHBOARD_API}/total-modules`);
};

const getScheduleStatistic = async (semesterId: number | null | undefined) => {
  try {
    const response = await axios.get(`${DASHBOARD_API}/schedules-statistic`,{
      params: {
        semesterId,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getAllModuleActivityStatistic = async (semesterId: number | null | undefined) => {
  try {
    const response = await axios.get(`${DASHBOARD_API}/module-activities-statistic`,{
      params: {
        semesterId,
      },
    });

    return response.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const DashboardService = {
  getTotalStudent,
  getTotalLecturer,
  getTotalSubject,
  getTotalClass,
  getTotalModule,
  getScheduleStatistic,
  getAllModuleActivityStatistic,
};
