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

export const DashboardService = {
  getTotalStudent,
  getTotalLecturer,
  getTotalSubject,
  getTotalClass,
};
