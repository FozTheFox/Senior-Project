"use client";

import { MdOutlineSpaceDashboard, MdCarRepair, MdSettings } from "react-icons/md";
import dynamic from "next/dynamic";
import { CgProfile } from "react-icons/cg";
import { IoDocument } from "react-icons/io5";
import { FaCar} from "react-icons/fa";
import { BiSolidReport } from "react-icons/bi";
import React, { useEffect, useState } from "react";
import Logout from "../../component/Logout";


const Clock = dynamic(() => import("@/app/utils/Clock"), { ssr: false });

export default function Sidebar() {
  const [roleName, setRoleName] = useState("");
  const [user, setUser] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  useEffect(() => {
    // ดึงข้อมูล role จาก sessionStorage
    const storedRole = sessionStorage.getItem("role");
    setRoleName(storedRole);

    const userData = JSON.parse(sessionStorage.getItem("user")); // สมมติว่าข้อมูลผู้ใช้ถูกเก็บใน sessionStorage
    setUser(userData);
  }, []);

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  const toggleReport = () => {
    setIsReportOpen(!isReportOpen);
  };

  return (
    <div className="p-6 w-1/2 h-full bg-white z-20 fixed top-0 -left-96 md:w-60 md:left-0 peer-focus:left-0 flex flex-col shadow-lg overflow-y-auto">
      <div className=" flex flex-col justify-start items-center">
        <h1 className="text-2xl text-center font-bold text-blue-900">
          SapPhun Thawi
        </h1>
        <span className="text-2xl text-center text-blue-900 border-b border-gray-100 pb-8 w-full">
          Service
        </span>
        <div className="my-4 border-b border-gray-100 pb-4">
          <div className="flex mb-1 justify-center items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            {user && user.image ? (
              <img
                src={`https://bodyworkandpaint.pantook.com/storage/${user.image}`}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover group-hover:border-white"
              />
            ) : (
              <CgProfile className="text-6xl text-gray-600 group-hover:text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
              {user ? user.name : "Loading..."}
            </h3>
          </div>
          <div className="flex mb-2 justify-center items-center gap-4 px-5">
            <Clock />
          </div>
        </div>

        {/* แสดงเมนูตาม roleName */}
        {roleName === "Admin" && (
          <div className="my-4 border-b border-gray-100 pb-4">
            <a href="/admin/dashboard">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  Dashboard
                </h3>
              </div>
            </a>
            <a href="/admin/car">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <FaCar className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  รับรถ
                </h3>
              </div>
            </a>
            <a href="/admin/Issuequotation">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <IoDocument className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  ใบเสนอราคา
                </h3>
              </div>
            </a>
            <a href="/admin/quota">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <IoDocument className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  ใบเสร็จ
                </h3>
              </div>
            </a>
            <a href="/admin/managerepair">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdCarRepair className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  จัดการรถรอซ่อม
                </h3>
              </div>
            </a>
            <a href="/admin/process">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdCarRepair className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  กระบวนการซ่อม
                </h3>
              </div>
            </a>
            <a href="/admin/setting">
            <div
              className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
              onClick={toggleSettings}
            >
              <MdSettings className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                ตั้งค่า
              </h3>
            </div>
            </a>
            <a href="/admin/report">
            <div
              className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
              onClick={toggleReport}
            >
              <BiSolidReport className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                รายงาน
              </h3>
            </div>
            </a>
        </div>
      )}

        {roleName === "รับรถ" && (
          <div className="my-4 border-b border-gray-100 pb-4">
            <a href="/employee/dashboard">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdOutlineSpaceDashboard className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  Dashboard
                </h3>
              </div>
            </a>
            <a href="/employee/car">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <FaCar className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  รับรถ
                </h3>
              </div>
            </a>
            <a href="/employee/Issuequotation">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <IoDocument className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  ใบเสนอราคา
                </h3>
              </div>
            </a>
            <a href="/employee/quota">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <IoDocument className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  ใบเสร็จ
                </h3>
              </div>
            </a>
            <a href="/employee/process">
              <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                <MdCarRepair className="text-2xl text-gray-600 group-hover:text-white" />
                <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                  กระบวนการซ่อม
                </h3>
              </div>
            </a>
          </div>
        )}

        <div className="my-4 w-full pb-4">
          <Logout />
          {/* <div className="flex mb-4 justify-start items-center gap-4 px-5 border border-gray-200 hover:bg-red-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
              <MdLogout className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Logout
              </h3>
            </div> */}
        </div>
      </div>
    </div>
  );
}
