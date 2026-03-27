"use client";
import Sidebar from "../../ui/Sidebar";
import { CgProfile } from "react-icons/cg";
import { FaHouseUser } from "react-icons/fa";
import { FaCar, FaShieldAlt } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import SetEmp from "../setting/component/set_emp";
import SetCar from "../setting/component/set_car";
import SetInsu from "../setting/component/set_insu";
import SetPart from "../setting/component/set_part";
import { useState } from "react";

export default function setting() {
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
      <div className="p-10 px-72">
        <div className="mb-6 gap-5 grid sm:grid-cols-4">
          <div
            className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto"
            onClick={() => handleComponentChange("SetEmp")}
          >
            <CgProfile className="my-1 text-9xl text-gray-600 group-hover:text-white" />
            <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
              ตั้งค่าพนักงาน
            </strong>
          </div>
          <div
            className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto"
            onClick={() => handleComponentChange("SetCar")}
          >
            <FaCar className="my-1 text-9xl text-gray-600 group-hover:text-white" />
            <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
              ตั้งค่ารถ
            </strong>
          </div>
          <div
            className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto"
            onClick={() => handleComponentChange("SetInsu")}
          >
            <FaShieldAlt className="my-1 text-9xl text-gray-600 group-hover:text-white" />
            <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
              ตั้งค่าบริษัทประกัน
            </strong>
          </div>
          <div
            className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto"
            onClick={() => handleComponentChange("SetPart")}
          >
            <FaScrewdriverWrench className="my-1 text-9xl text-gray-600 group-hover:text-white" />
            <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
              ตั้งค่าอะไหล่
            </strong>
          </div>
        </div>
        {activeComponent === "SetEmp" && <SetEmp />}
        {activeComponent === "SetCar" && <SetCar />}
        {activeComponent === "SetInsu" && <SetInsu />}
        {activeComponent === "SetPart" && <SetPart />}
      </div>
    </div>
  );
}
