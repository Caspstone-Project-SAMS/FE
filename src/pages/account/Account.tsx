import React, { useEffect, useState } from 'react';
import { message } from 'antd';
import useDispatch from '../../redux/UseDispatch';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/Store';
import {
  clearResetPasswordMessages,
  editProfile,
  updateName,
} from '../../redux/slice/Auth';

import { UserInfo } from '../../models/UserInfo';

// IMPORTS
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ProfileCard from '../../components/account/ProfileCard';
import SettingsCard from '../../components/account/SettingsCard';
import { EmployeeService } from '../../hooks/Employee';
import { EmployeeDetails } from '../../models/employee/Employee';
import { Box } from '@mui/material';

// FONTS
// import "@fontsource/roboto/300.css";
// import "@fontsource/roboto/400.css";
// import "@fontsource/roboto/500.css";
// import "@fontsource/roboto/700.css";

// STYLE & THEME
const theme = createTheme();

const EditAccount: React.FC = () => {
  const UserId = useSelector(
    (state: RootState) => state.auth.userDetail?.result?.id,
  );

  const user = useSelector((state: RootState) => state.auth.data);

  const failMessage = useSelector((state: RootState) => state.auth.fail);
  const successMessage = useSelector(
    (state: RootState) => state.auth.success?.title,
  );

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [isCheck, setIsCheck] = useState(0);

  const [Email, setEmail] = useState('');
  const [PhoneNumber, setPhoneNumber] = useState('');
  const [Avatar, setAvatar] = useState<File | null>(null);
  const [DisplayName, setDisplayName] = useState('');
  const [Address, setAddress] = useState('');
  const [DOB, setDOB] = useState('');
  const [Gender, setGender] = useState(0);
  const [FirstName, setFirstName] = useState('');
  const [LastName, setLastName] = useState('');

  const [lecturer, setLecturer] = useState<EmployeeDetails>();

  const [errors, setErrors] = useState({
    OldPassword: '',
    NewPassword: '',
    ConfirmPassword: '',
  });

  const [text, setText] = useState('');

  const mainUser = {
    // DEFAULT VALUES
    title: 'CEO of Apple',
    dt1: 32,
    dt2: 40,
    dt3: 50,
    firstName: user?.result?.firstName,
    lastName: user?.result?.lastName,
    gender: user?.result?.gender,
    phone: user?.result?.phoneNumber,
    email: user?.result?.email,
    pass: 'password123',
  };

  const fullName = `${mainUser.firstName} ${mainUser.lastName}`;

  useEffect(() => {
    if (successMessage) {
      message.success(successMessage);
      resetFields();
      dispatch(clearResetPasswordMessages());
    }
    if (failMessage && failMessage.data) {
      message.error(`${failMessage.data.data.data.errors}`);
      dispatch(clearResetPasswordMessages());
    }
  }, [successMessage, failMessage, dispatch]);

  const employeeID: string = user?.result?.employeeID || '';
  useEffect(() => {
    if (employeeID !== '') {
      const response = EmployeeService.getEmployeeByID(employeeID);

      response
        .then((data) => {
          setLecturer(data || undefined);
        })
        .catch((error) => {
          console.log('get employee by id error: ', error);
        });
    }
  }, [employeeID]);

  const resetFields = () => {
    setAvatar(null);
    setErrors({
      NewPassword: '',
      OldPassword: '',
      ConfirmPassword: '',
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    if (UserId) {
      // dispatch(updateName({name: DisplayName}))
      await editSpecificProfile(
        UserId,
        Email,
        PhoneNumber,
        Avatar,
        DisplayName,
        Address,
        DOB,
        Gender,
        FirstName,
        LastName,
      );
    }
    setLoading(false);
    resetFields();
  };

  const editSpecificProfile = async (
    UserId: string,
    Email: string,
    PhoneNumber: string,
    Avatar: File | null,
    DisplayName: string,
    Address: string,
    DOB: string,
    Gender: number,
    FirstName: string,
    LastName: string,
  ) => {
    const arg = {
      UserId: UserId,
      Email: Email,
      PhoneNumber: PhoneNumber,
      Avatar: Avatar,
      DisplayName: DisplayName,
      Address: Address,
      DOB: DOB,
      Gender: Gender,
      FirstName: FirstName,
      LastName: LastName,
    };
    await dispatch(editProfile(arg) as any);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline>
        {/* BACKGROUND */}
        <Box
          sx={{
            minHeight: '100vh',
            backgroundColor: '#f5f5f5', 
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid
            container
            direction="column"
            sx={{ overflowX: 'hidden', minHeight: '100vh' }}
          >
            <Grid item xs={12} md={6} sx={{ flexShrink: 0 }}>
              <img
                alt="avatar"
                style={{
                  width: '100vw',
                  height: '35vh',
                  objectFit: 'cover',
                  objectPosition: '50% 50%',
                  position: 'relative',
                }}
                src="https://iris2.gettimely.com/images/default-cover-image.jpg"
              />
            </Grid>

            {/* COMPONENTS */}
            <Grid
              container
              direction={{ xs: 'column', md: 'row' }}
              spacing={3}
              sx={{
                position: 'absolute',
                top: '20vh',
                px: { xs: 0, md: 7 },
                width: '90%',
                paddingBottom: 10,
                overflowY: 'auto',
                flexGrow: 1,
              }}
            >
              {/* PROFILE CARD */}
              <Grid item md={3} sx={{ flexShrink: 0 }}>
                <ProfileCard
                  sub={mainUser.title}

                  img={user?.result?.avatar}
                  Avatar={Avatar}
                  setAvatar={setAvatar}
                  name={user?.result?.displayName}
                  role={user?.result?.role.name}
                  department={lecturer?.result.department}
                ></ProfileCard>
              </Grid>

              {/* SETTINGS CARD */}
              <Grid item md={9}>
                <SettingsCard
                  expose={(v: string) => setText(v)}
                  fullName={user?.result?.displayName}
                  phone={mainUser.phone}
                  email={mainUser.email}
                  Email={Email}
                  setEmail={setEmail}
                  Phone={PhoneNumber}
                  setPhone={setPhoneNumber}
                  Name={DisplayName}
                  setName={setDisplayName}
                  address={user?.result?.address}
                  Address={Address}
                  setAddress={setAddress}
                  dob={user?.result?.dob}
                  DOB={DOB}
                  setDOB={setDOB}
                  pass={mainUser.pass}
                  gender={mainUser.gender}
                  Gender={Gender}
                  setGender={setGender}
                  firstName={mainUser.firstName}
                  FirstName={FirstName}
                  setFirstName={setFirstName}
                  lastName={mainUser.lastName}
                  LastName={LastName}
                  setLastName={setLastName}
                  submit={handleSubmit}
                  loading={loading}
                ></SettingsCard>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      </CssBaseline>
    </ThemeProvider>
  );
};

export default EditAccount;
