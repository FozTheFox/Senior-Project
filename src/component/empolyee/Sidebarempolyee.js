"use client";

import {
  MdOutlineSpaceDashboard,
  MdOutlineAnalytics,
  MdOutlineIntegrationInstructions,
  MdOutlineMoreHoriz,
  MdOutlineSettings,
  MdOutlineLogout,
  MdCarRepair,
  MdSettings,
  MdLogout,
} from "react-icons/md";
import dynamic from "next/dynamic";
import { CgProfile } from "react-icons/cg";
import { IoDocument } from "react-icons/io5";
import { FaCar, FaUserCircle } from "react-icons/fa";
import { BiMessageSquareDots, BiSolidReport } from "react-icons/bi";
import React from "react";

const Clock = dynamic(() => import("@/app/utils/Clock"), { ssr: false });

// const Clock = () => {
//     const [CT, setCT] = React.useState(new Date());

//     React.useEffect(() => {

//         const timer = setInterval(() => {
//            setCT(new Date());
//         }, 1000);

//         return () => clearInterval(timer);
//     }, [CT]);

//     return <div>{CT.toLocaleTimeString()}</div>
// };

export default function Sidebaremployee() {
  return (
    <div className="p-6 w-1/2 h-screen bg-white z-20 fixed top-0 -left-96 lg:w-60 lg:left-0 peer-focus:left-0 flex flex-col shadow-lg">
      <div className="flex flex-col justify-start items-center">
        <h1 className="text-2xl text-center font-bold text-blue-900">
          SapPhun Thawi
        </h1>
        <span className="text-2xl text-center text-blue-900 border-b border-gray-100 pb-8 w-full">
          Service
        </span>
        <div className="my-4 border-b border-gray-100 pb-4">
          <div className="flex mb-1 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
            <CgProfile className="text-6xl text-gray-600 group-hover:text-white" />
            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
              สมชาย สบายดี
            </h3>
          </div>
          <div className="flex mb-2 justify-center items-center gap-4 px-5">
            <Clock />
          </div>
        </div>
        <div className="my-4 border-b border-gray-100 pb-4">
          <a href="car">
            <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
              <FaCar className="text-2xl text-gray-600 group-hover:text-white" />{" "}
              {/* npm install react-icons --save */}
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Cars
              </h3>
            </div>
          </a>
          <a href="quota">
            <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
              <IoDocument className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Bill
              </h3>
            </div>
          </a>
          <a href="process">
            <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
              <MdCarRepair className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Process
              </h3>
            </div>
          </a>
          <a href="report">
            <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
              <BiSolidReport className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Report
              </h3>
            </div>
          </a>
        </div>
        <div className="my-4 border-b border-gray-100 pb-4">
          <a href="setting">
            <div className="flex mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
              <MdSettings className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Settings
              </h3>
            </div>
          </a>
        </div>
        <div className="my-4 w-full">
          <a href="login">
            <div className="flex mb-4 justify-start items-center gap-4 px-5 border border-gray-200 hover:bg-red-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
              <MdLogout className="text-2xl text-gray-600 group-hover:text-white" />
              <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                Logout
              </h3>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}
