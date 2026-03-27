"use client";

import Sidebar from "../../ui/Sidebar";
import { FaHouseUser } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoTime } from "react-icons/io5";

import Re_insu from "../report/component/re_insu";
import Re_quota from "../report/component/re_quota";
import Re_worktime from "../report/component/re_worktime";
import Re_user from "../report/component/re_user";
import Re_part from "../report/component/re_part";
import { useState } from "react";

export default function report() {
  const [activeComponent, setActiveComponent] = useState(null);

  const handleComponentChange = (component) => {
    // Check if the clicked component is already active
    if (activeComponent === component) {
      setActiveComponent(null); // Deselect if already active
    } else {
      setActiveComponent(component); // Select the new component
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="pt-4 px-72">
        <div className="mb-6 gap-5 grid sm:grid-cols-5">
          <div
            className={`min-h-[150px] w-[200px]  dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 hover:text-white group cursor-pointer hover:shadow-lg m-auto ${
              activeComponent === "Re_worktime" ? "bg-black text-white" : " bg-white text-black"
            }`}
            onClick={() => handleComponentChange("Re_worktime")}
          >
            <IoTime className="my-1 text-7xl group-hover:text-white" />
            <strong className="my-1 text-base font-semibold text-cente">
              เวลาทำงานของช่าง
            </strong>
          </div>

          <div
            className={`min-h-[150px] w-[200px]  dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 hover:text-white group cursor-pointer hover:shadow-lg m-auto ${
              activeComponent === "Re_quota" ? "bg-black text-white" : " bg-white text-black"
            }`}
            onClick={() => handleComponentChange("Re_quota")}
          >
            <HiDocumentReport className="my-1 text-7xl group-hover:text-white" />
            <strong className="my-1 text-base font-semibold text-center">
              ประวัติรถเข้าซ่อมทั้งหมด
            </strong>
          </div>

          <div
            className={`min-h-[150px] w-[200px]  dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 hover:text-white group cursor-pointer hover:shadow-lg m-auto ${
              activeComponent === "Re_insu" ? "bg-black text-white" : " bg-white text-black"
            }`}
            onClick={() => handleComponentChange("Re_insu")}
          >
            <FaHouseUser className="my-1 text-7xl group-hover:text-white" />
            <strong className="my-1 text-base font-semibold text-cente">
              บริษัทประกัน
            </strong>
          </div>

          <div
            className={`min-h-[150px] w-[200px]  dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 hover:text-white group cursor-pointer hover:shadow-lg m-auto ${
              activeComponent === "Re_user" ? "bg-black text-white" : " bg-white text-black"
            }`}
            onClick={() => handleComponentChange("Re_user")}
          >
            <FaHouseUser className="my-1 text-7xl group-hover:text-white" />
            <strong className="my-1 text-base font-semibold text-cente">
              พนักงานทั้งหมด
            </strong>
          </div>

          <div
            className={`min-h-[150px] w-[200px]  dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 hover:text-white group cursor-pointer hover:shadow-lg m-auto ${
              activeComponent === "Re_part" ? "bg-black text-white" : " bg-white text-black"
            }`}
            onClick={() => handleComponentChange("Re_part")}
          >
            <FaHouseUser className="my-1 text-7xl group-hover:text-white" />
            <strong className="my-1 text-base font-semibold text-cente">
              รายการอะไหล่
            </strong>
          </div>
        </div>
        {activeComponent === "Re_insu" && <Re_insu />}
        {activeComponent === "Re_quota" && <Re_quota />}
        {activeComponent === "Re_worktime" && <Re_worktime />}
        {activeComponent === "Re_user" && <Re_user />}
        {activeComponent === "Re_part" && <Re_part />}
      </div>
    </div>
  );
}
