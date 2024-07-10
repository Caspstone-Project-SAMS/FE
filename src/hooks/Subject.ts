import axios from 'axios';
import { SUBJECT_API } from '.';
import { Subject, SubjectMessage } from '../models/subject/Subject';

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
  SubjectStatus: boolean,
  CreateBy: string,
) => {
  try {
    const response = await axios.post(
      SUBJECT_API,
      {
        SubjectCode,
        SubjectName,
        SubjectStatus,
        CreateBy,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error('Error on create new Subject: ', error);
    return null;
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
  } catch (error) {
    console.error('Error on update Subject: ', error);
    return null;
  }
};

const deleteSubject = async (subjectID: number) => {
  try {
    const response = await axios.delete(SUBJECT_API + '/' + subjectID);
    console.log('delete success', response.data);
    return response.data;
  } catch (error) {
    console.error('Error on delete Subject: ', error);
    return null;
  }
};

export const SubjectService = {
  getAllSubject,
  getSubjectByID,
  createSubject,
  updateSubject,
  deleteSubject,
};
