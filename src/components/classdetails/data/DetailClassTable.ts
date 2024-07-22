import { ClassDetail } from '../../../models/ClassDetail'; // Adjust the path as needed

const DetailClassTable = (): ClassDetail[] => {
  const fakeData: ClassDetail[] = [
    {
      key: '1',
      studentname: 'John Doe',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Not yet',
      fingerprintstatus: 'authenticated',
    },
    {
      key: '2',
      studentname: 'John Doe',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Attended',
      fingerprintstatus: 'authenticated',
    },
    {
      key: '3',
      studentname: 'Jane Smith',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Absent',
      fingerprintstatus: 'unauthenticated',
    },
    {
      key: '4',
      studentname: 'John Doe',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Not yet',
      fingerprintstatus: 'authenticated',
    },
    {
      key: '5',
      studentname: 'John Doe',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Not yet',
      fingerprintstatus: 'authenticated',
    },
    {
      key: '6',
      studentname: 'Jane Smith',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Not yet',
      fingerprintstatus: 'unauthenticated',
    },
    {
      key: '7',
      studentname: 'John Doe',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Not yet',
      fingerprintstatus: 'authenticated',
    },
    {
      key: '8',
      studentname: 'John Doe',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Not yet',
      fingerprintstatus: 'authenticated',
    },
    {
      key: '9',
      studentname: 'John Doe',
      studentcode: 'SE123123',
      email:'ducnhhse123123@fpt.edu.vn',
      status: 'Not yet',
      fingerprintstatus: 'authenticated',
    },
    // Add more fake data as needed
  ];

  return fakeData;
};

export default DetailClassTable;