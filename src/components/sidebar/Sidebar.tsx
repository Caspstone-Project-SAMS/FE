import './Sidebar.css';
import './Sidebar.less';
import React, { useState } from 'react';
import Sider from 'antd/es/layout/Sider';
import { Image, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../redux/Store';
import { useSelector } from 'react-redux';

import { GoBook } from "react-icons/go";
import { PiStudent } from 'react-icons/pi';
import { CiCalendar } from 'react-icons/ci';
import { IoCalendar } from 'react-icons/io5';
import { GiBookshelf } from 'react-icons/gi';
import { GrSchedules } from 'react-icons/gr';
import { MdViewModule } from "react-icons/md";
import { LuDoorOpen } from "react-icons/lu";
import { IoHomeOutline } from 'react-icons/io5';
import { MdManageAccounts } from 'react-icons/md';
import { MdOutlineManageAccounts } from 'react-icons/md';

import Logo from '../../assets/imgs/logo_sider.png';
import Logo_Cutted from '../../assets/imgs/logo_cut.png';

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const Auth = useSelector((state: RootState) => state.auth);
  const role = Auth.userDetail?.result?.role.name;
  return (
    <Sider
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      style={{ backgroundColor: 'white' }}
    >
      <Header
        style={{
          backgroundColor: 'white',
          width: '100%',
          padding: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <div className="demo-logo">
          <Image
            width={'100%'}
            height={collapsed ? '100%' : ''}
            src={collapsed ? Logo_Cutted : Logo}
            preview={false}
            alt="App logo - SAMS"
          />
        </div>
      </Header>
      <Menu
        onClick={(item) => {
          navigate(item.key);
        }}
        mode="inline"
        items={
          role === 'Admin'
            ? [
              {
                label: 'Home',
                key: '/home',
                icon: <IoHomeOutline />,
              },
              {
                label: 'Account',
                key: '/account-admin',
                children: [
                  {
                    label: 'Student',
                    key: '/account-admin/student',
                  },
                  {
                    label: 'Teacher',
                    key: '/account-admin/teacher',
                  },
                ],
                icon: <MdManageAccounts />,
              },

              {
                label: 'Class',
                key: '/admin-class',
                icon: <GiBookshelf />,
              },
              {
                label: 'Schedule',
                key: '/schedule',
                icon: <GrSchedules />,
              },
              {
                label: 'Semester',
                key: '/semester',
                icon: <IoCalendar />,
              },
              {
                label: 'Room',
                key: '/room',
                icon: <LuDoorOpen />,
              },
              {
                label: 'Subject',
                key: '/admin-subject',
                icon: <GoBook />,
              },
              {
                label: 'Slot',
                key: '/slot',
                icon: <GiBookshelf />,
              },
              {
                label: 'Module',
                key: '/module',
                icon: <MdViewModule />,
              },
            ]
            : role === 'Lecturer'
              ? [
                {
                  label: 'Home',
                  key: '/home',
                  icon: <IoHomeOutline />,
                },
                {
                  label: 'Class',
                  key: '/class',
                  icon: <GiBookshelf />,
                },
                {
                  label: 'Students',
                  key: '/student',
                  icon: <PiStudent />,
                },
                {
                  label: 'Calendar',
                  key: '/calendar',
                  icon: <CiCalendar />,
                },
                {
                  label: 'Account',
                  key: '/account',
                  icon: <MdOutlineManageAccounts />,
                },
              ]
              : [
                {
                  label: 'Account',
                  key: '/student',
                  icon: <MdOutlineManageAccounts />,
                },
              ]
        }
      />
    </Sider>
  );
};

export default Sidebar;
