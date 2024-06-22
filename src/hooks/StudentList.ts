import axios from 'axios';
import { STUDENT_API } from '.';
import { Student } from '../models/student/Student';

const getAllStudent = async (): Promise<Student[] | null> => {
    try {
        const response = await axios.get(STUDENT_API);
        return response.data as Student[];
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const StudentService = {
    getAllStudent,
}