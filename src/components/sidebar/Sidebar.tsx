import React, { useState } from 'react';
import Sider from 'antd/es/layout/Sider';
import { IoHomeOutline } from 'react-icons/io5';
import { GiBookshelf } from 'react-icons/gi';
import { PiStudent } from 'react-icons/pi';
import { CiCalendar } from 'react-icons/ci';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { FaListCheck } from 'react-icons/fa6';
import { Image, Menu } from 'antd';
import { Header } from 'antd/es/layout/layout';
import { useNavigate } from 'react-router-dom';
import './Sidebar.css';
import './Sidebar.less';
import Logo from '../../assets/imgs/logo_sider.png';
import Logo_Cutted from '../../assets/imgs/logo_cut.png';
import { RootState } from '../../redux/Store';
import { useSelector } from 'react-redux';
import { MdManageAccounts } from "react-icons/md";
import { FaBookOpen } from "react-icons/fa";
import { IoCalendar } from "react-icons/io5";
import { GrSchedules } from 'react-icons/gr';

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
      {/* <Menu
        onClick={(item) => {
          navigate(item.key)
        }}
        mode="inline"
        items={[
          {
            label: 'Home',
            key: '/',
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
            label: "Calendar",
            key: "/calendar",
            children: [
              {
                label: "1",
                key: "1",
              },
              {
                label: "2",
                key: "2",
              },
            ],
            icon: <CiCalendar />,
          },
          {
            label: 'Account',
            key: '/account',
            icon: <MdOutlineManageAccounts />,
          },
          {
            label: 'Attendance',
            key: '/attendance',
            icon: <FaListCheck />,
          },
        ]}
      /> */}
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
                label: 'Subject',
                key: '/admin-subject',
                icon: <FaBookOpen />,
              },
              // {
              //   label: 'Teacher',
              //   key: '/teacher',
              //   icon: <IoHomeOutline />,
              // },
              {
                label: 'Attendance',
                key: '/admin-attendance',
                icon: <FaListCheck />,
              },
              {
                label: 'Semester',
                key: '/semester',
                icon: <IoCalendar />,
              },
              {
                label: 'Class',
                key: '/admin-class',
                icon: <GiBookshelf />,
              },
              {
                label: 'Room',
                key: '/room',
                icon: <GiBookshelf />,
              },
              {
                label: 'Schedule',
                key: '/schedule',
                icon: <GrSchedules />,
              },
              {
                label: 'Slot',
                key: '/slot',
                icon: <GiBookshelf />,
              },
            ]
            : [
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
              // {
              //   label: 'Attendance',
              //   key: '/attendance',
              //   icon: <FaListCheck />,
              // },
            ]
        }
      />
    </Sider>
  );
};

export default Sidebar;
