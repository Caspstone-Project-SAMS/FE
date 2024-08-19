// IMPORTS
import React, { useEffect, useState } from 'react';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Visibility from '@mui/icons-material/Visibility';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import { Grid } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import CustomInput from './CustomInput';

//APP
export default function AccountCard(props: any) {
  //TAB STATES
  const [value, setValue] = React.useState('one');
  const [phone, setPhone] = useState(props.Phone || props.user.phone || '');

  const [formValues, setFormValues] = useState({
    fullName: props.Name || props.user.fullName || '',
    address: props.Address || props.user.address || '',
    dob: props.DOB || props.user.dob || '',
    gender: props.Gender || props.user.gender || 1,
    firstName: props.FirstName || props.user.firstName || '',
    lastName: props.LastName || props.user.lastName || '',
    phone: phone,
    email: props.Email || props.user.email || '',
    password: '',
  });

  //   const handleChange = (event: React.SyntheticEvent, newValue: string) => {
  //     setValue(newValue);
  //   };

  useEffect(() => {
    // Synchronize with props.Phone only when it's initially set or updated
    if (props.Phone) {
      setPhone(props.Phone);
    }
  }, [props.Phone]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'phone') {
      setPhone(value);
      props.setPhone(value);
    } else if (name === 'fullName') {
      props.setName(value);
    } else if (name === 'address') {
      props.setAddress(value);
    } else if (name === 'dob') {
      props.setDOB(value);
    } else if (name === 'email') {
      props.setEmail(value);
    } else if (name === 'gender') {
      props.setGender(value);
    } else if (name === 'firstName') {
      props.setFirstName(value);
    } else if (name === 'lastName') {
      props.setLastName(value);
    }
  };

  // GENDER SELECT STATES
  const genderSelect = [
    {
      value: 1,
      label: 'Male',
    },
    {
      value: 2,
      label: 'Female',
    },
    {
      value: 3,
      label: 'Others',
    },
  ];

  // FORM STATES
  //   const [user, setUser] = useState({
  //     // DEFAULT VALUES
  //     fullName: props.fullName,
  //     address: props.address,
  //     dob: props.dob,
  //     gender: props.gender,
  //     phone: props.phone,
  //     email: props.email,
  //     showPassword: false,
  //   });

  //   const changeField = (event: React.ChangeEvent<HTMLInputElement>) => {
  //     setUser({ ...user, [event.target.name]: event.target.value });
  //   };

  //BUTTON STATES
  const [edit, update] = useState({
    required: true,
    disabled: false,
    isEdit: true,
  });

  // EDIT -> UPDATE
  const changeButton = (event: any) => {
    event.preventDefault();
    user.showPassword = false;
    edit.disabled = !edit.disabled;
    edit.isEdit = !edit.isEdit;
    update({ ...edit });
    console.log('user: ', user);
  };

  // TOGGLE PASSWORD VISIBILITY
  const handlePassword = () => {
    user.showPassword = !user.showPassword;
    setUser({ ...user });
  };

  //RETURN
  return (
    <Card variant="outlined" sx={{ height: '100%', width: '100%' }}>
      {/* MAIN CONTENT CONTAINER */}
      <form>
        <CardContent
          sx={{
            p: 3,
            height: '400px',
            textAlign: { xs: 'center', md: 'start' },
            overflowY: 'auto',
          }}
        >
          {/* FIELDS */}
          <FormControl fullWidth>
            <Grid
              container
              direction={{ xs: 'column', md: 'row' }}
              columnSpacing={5}
              rowSpacing={3}
            >
              {/* ROW 1: FIRST NAME */}
              <Grid component="form" item xs={6}>
                <CustomInput
                  id="firstName"
                  name="firstName"
                  value={formValues.firstName}
                  onChange={handleChange}
                  title="First Name"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>

              {/* ROW 1: LAST NAME */}
              <Grid component="form" item xs={6}>
                <CustomInput
                  id="lastName"
                  name="lastName"
                  value={formValues.lastName}
                  onChange={handleChange}
                  title="Last Name"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  id="fullName"
                  name="fullName"
                  value={formValues.fullName}
                  onChange={handleChange}
                  title="Full Name"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  id="address"
                  name="address"
                  value={formValues.address}
                  onChange={handleChange}
                  title="Address"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>
              <Grid item xs={6}>
                <CustomInput
                  id="dob"
                  name="dob"
                  value={formValues.dob}
                  onChange={handleChange}
                  title="Birthday"
                  dis={edit.disabled}
                  req={edit.required}
                  type="date" // Changed to date input
                  inputProps={{
                    pattern: '\\d{2}:\\d{2}:\\d{4}', // Added pattern for dd:mm:yyyy
                  }}
                ></CustomInput>
              </Grid>

              {/* ROW 2: GENDER */}
              <Grid item xs={6}>
                <CustomInput
                  select
                  id="gender"
                  name="gender"
                  value={formValues.gender}
                  onChange={handleChange}
                  title="Gender"
                  dis={edit.disabled}
                  req={edit.required}
                  //MAP THRU OPTIONS
                  content={genderSelect.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                ></CustomInput>
              </Grid>

              {/* ROW 3: PHONE */}
              <Grid item xs={6}>
                <CustomInput
                  id="phone"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  title="Phone Number"
                  dis={edit.disabled}
                  req={edit.required}
                  //DIALING CODE
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">84+</InputAdornment>
                    ),
                  }}
                ></CustomInput>
              </Grid>

              {/* ROW 3: EMAIL */}
              <Grid item xs={6}>
                <CustomInput
                  type="email"
                  id="email"
                  name="email"
                  value={formValues.email}
                  onChange={handleChange}
                  title="Email"
                  dis={edit.disabled}
                  req={edit.required}
                ></CustomInput>
              </Grid>

              {/* ROW 4: PASSWORD */}
              {/* <Grid item xs={6}>
                <CustomInput
                  id="pass"
                  name="pass"
                  value={user.pass}
                  onChange={changeField}
                  title="Password"
                  dis={edit.disabled}
                  req={edit.required}
                  type={user.showPassword ? "text" : "password"}
                  // PASSWORD ICON
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePassword}
                          edge="end"
                          disabled={edit.disabled}
                        >
                          {user.showPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                ></CustomInput>
              </Grid> */}

              {/* BUTTON */}
              <Grid
                container
                direction="column"
                justifyContent="flex-end"
                alignItems="flex-end"
                item
                xs={12}
                style={{ height: '100%' }}
              >
                <Button
                  sx={{ p: '1rem 2rem', my: 2, height: '3rem' }}
                  component="button"
                  size="large"
                  variant="contained"
                  color="primary"
                  onClick={() => props.submit()}
                >
                  {edit.isEdit === false ? 'UPDATE' : 'EDIT'}
                </Button>
              </Grid>
            </Grid>
          </FormControl>
        </CardContent>
      </form>
    </Card>
  );
}
