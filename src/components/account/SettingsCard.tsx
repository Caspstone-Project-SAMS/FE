// IMPORTS
import React, { useState } from 'react';
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
import AccountCard from './AccountCard';
import ResetPasswordCard from './ResetPasswordCard';

//APP
export default function SettingsCard(props: any) {
  //TAB STATES
  const [value, setValue] = React.useState('one');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  // GENDER SELECT STATES
  const genderSelect = [
    {
      value: 'male',
      label: 'Male',
    },
    {
      value: 'female',
      label: 'Female',
    },
  ];

  // FORM STATES
  const [user, setUser] = useState({
    // DEFAULT VALUES
    firstName: props.firstName,
    lastName: props.lastName,
    fullName: props.fullName,
    address: props.address,
    dob: props.dob,
    gender: props.gender,
    phone: props.phone,
    email: props.email,
    pass: props.pass,
    showPassword: false,
  });

  const changeField = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

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
    <Card variant="outlined" sx={{ height: '115%', width: '100%' }}>
      {/* TABS */}
      <br></br>
      <Tabs
        value={value}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="one" label="Account" />
        <Tab value="two" label="Reset Password" />
        {/* <Tab value="three" label="Tab 3" /> */}
      </Tabs>
      <Divider></Divider>

      {/* MAIN CONTENT CONTAINER */}
      {value === 'one' && (
        <AccountCard 
          handleChange={handleChange}
          value={value}
          setValue={setValue}
          user={user}
          setUser={setUser}
          edit={edit}
          update={update}
          // fullName={props.fullName}
          email={props.email}
          Email={props.Email}
          setEmail={props.setEmail}
          phone={props.phone}
          Phone={props.Phone}
          setPhone={props.setPhone}
          name={props.name}
          Name={props.Name}
          setName={props.setName}
          address={props.address}
          Address={props.Address}
          setAddress={props.setAddress}
          dob={props.dob}
          DOB={props.DOB}
          setDOB={props.setDOB}
          gender={props.gender}
          Gender={props.Gender}
          setGender={props.setGender}
          firstName={props.firstName}
          FirstName={props.FirstName}
          setFirstName={props.setFirstName}
          lastName={props.lastName}
          LastName={props.LastName}
          setLastName={props.setLastName}
          submit={props.submit}
        />
      )}
      {value === 'two' && <ResetPasswordCard />}
    </Card>
  );
}
