import axios, { AxiosError } from 'axios';
import { SUBJECT_API } from '.';
import { Subject, SubjectMessage } from '../models/subject/Subject';
import { isRejectedWithValue } from '@reduxjs/toolkit';

const getAllSubject = async (): Promise<Subject[] | null> => {
  try {
    const response = await axios.get(SUBJECT_API);

    return response.data as Subject[];
  } catch (error) {
    console.log(error);
    return null;
  }
};

const getSubjectByID = async (subjectID: number): Promise<Subject> => {

    const response = await axios.get(`${SUBJECT_API}/get-by-id?id=${subjectID}`);
    return response.data as Subject;

};

const createSubject = async (
  SubjectCode: string,
  SubjectName: string,
  SubjectStatus: number,
  // CreateBy: string,
) => {
  try {
    const response = await axios.post(
      SUBJECT_API,
      {
        SubjectCode,
        SubjectName,
        SubjectStatus,
        // CreateBy,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("abc", error.message)
      throw new AxiosError(error.response.data)
    }
    return isRejectedWithValue(error.message)
  }
};



const updateSubject = async (
  subjectID: number,
  SubjectCode: string,
  SubjectName: string,
  // SubjectStatus: boolean,
) => {
  try {
    const response = await axios.put(
      `${SUBJECT_API}?id=${subjectID}`,
      {
        SubjectCode,
        SubjectName,
        // SubjectStatus: true,
      },
      {
        headers: {
          'Content-Type': 'application/json-patch+json',
        },
      },
    );
    console.log(response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("abc", error.message)
      throw new AxiosError(error.response.data)
    }
    return isRejectedWithValue(error.message)
  }
};

const deleteSubject = async (subjectID: number) => {
  try {
    const response = await axios.delete(SUBJECT_API + '/' + subjectID);
    console.log('delete success', response.data);
    return response.data;
  } catch (error: any) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("abc", error.message)
      throw new AxiosError(error.response.data)
    }
    return isRejectedWithValue(error.message)
  }
};

export const SubjectService = {
  getAllSubject,
  getSubjectByID,
  createSubject,
  updateSubject,
  deleteSubject,
};
