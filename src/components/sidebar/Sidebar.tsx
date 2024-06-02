import React from "react";
import Sider from "antd/es/layout/Sider";
import { IoHomeOutline } from "react-icons/io5";
import { GiBookshelf } from "react-icons/gi";
import { PiStudent } from "react-icons/pi";
import { CiCalendar } from "react-icons/ci";
import { MdOutlineManageAccounts } from "react-icons/md";
import { FaListCheck } from "react-icons/fa6";
import { Menu } from "antd";
import { Header } from "antd/es/layout/layout";
import { useNavigate } from "react-router-dom";

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Sider style={{ backgroundColor: "white" }}>
      <Header style={{ backgroundColor: "white" }} />
      <Menu
        onClick={(item) => {
          navigate(item.key)
        }}
        mode="inline"
        items={[
          {
            label: "Home",
            key: "/",
            icon: <IoHomeOutline />,

          },
          {
            label: "Class",
            key: "/class",
            icon: <GiBookshelf />,
          },
          {
            label: "Students",
            key: "/student",
            icon: <PiStudent />,
          },
          {
            label: "Calendar",
            key: "/calendar",
            // children: [
            //   {
            //     label: "1",
            //     key: "1",
            //   },
            //   {
            //     label: "2",
            //     key: "2",
            //   },
            // ],
            icon: <CiCalendar />,
          },
          {
            label: "Account",
            key: "/account",
            icon: <MdOutlineManageAccounts />,
          },
          {
            label: "Attendance",
            key: "/attendance",
            icon: <FaListCheck />,
          },
        ]}
      />
    </Sider>
  );
};

export default Sidebar;
