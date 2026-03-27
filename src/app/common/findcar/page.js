"use client";

import Topbar from "../../ui/Topbar";
import { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaCarAlt } from "react-icons/fa"; // ใช้ไอคอนเพิ่มเติม

export default function FindCar() {
  const [licensePlate, setLicensePlate] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [progress, setProgress] = useState(0);

  // ฟังก์ชันแปลสถานะ
  const translateStatus = (status) => {
    switch (status) {
      case "Completed":
        return "เสร็จ";
      case "In Progress":
        return "กำลังดำเนินการ";
      case "Pending":
        return "รอดำเนินการ";
      default:
        return status; // ถ้าไม่พบสถานะ ให้คืนค่าสถานะเดิม
    }
  };

  // ฟังก์ชันแปลรายละเอียดปัญหา
  const translateProblemDetails = (problem) => {
    switch (problem) {
      case "Scratch on door":
        return "รอยขีดข่วนที่ประตู";
      case "Broken window":
        return "กระจกแตก";
      case "Engine issue":
        return "ปัญหาเครื่องยนต์";
      default:
        return problem; // ถ้าไม่พบรายละเอียดปัญหา ให้คืนค่าปัญหาดั้งเดิม
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://bodyworkandpaint.pantook.com/api/customersearchByLicensePlate?LicensePlate=${licensePlate}`
      );
      setSearchResults(response.data.data);
    } catch (error) {
      console.error(`Error making API request: ${error.message}`);
      console.error(error.response); // Log the response from the API
    }
  };

  useEffect(() => {
    if (searchResults.length > 0) {
      const completedProcesses = searchResults[0].repair_processes.filter(
        (process) => process.Status === "Completed"
      );
      const totalProcesses = searchResults[0].repair_processes.length;
      const progressPercentage =
        (completedProcesses.length / totalProcesses) * 100;
      setProgress(progressPercentage);
    }
  }, [searchResults]);

  return (
    <div>
      <div className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
        <Topbar />
      </div>
      <div className="content-wrapper pt-20 2xl:pt-16">
        <img
          className="w-full h-screen object-cover fixed opacity-20"
          src="https://www.drivergocar.com/wp-content/uploads/2022/08/27-best-repair-garages-in-bangkok-cover.jpg"
          alt="background"
        />
        <div className="relative flex flex-col items-center justify-center p-8 sm:pt-16 md:p-12 lg:p-12 z-10">
          {/* Input Section */}
          <label className="block w-full max-w-md mb-6">
            <span className="block text-black font-semibold text-lg mb-2">
              <FaCarAlt className="inline-block mr-2 text-orange-500" />{" "}
              กรอกเลขทะเบียน
            </span>
            <input
              type="text"
              className="block w-full p-3 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="กรุณาใส่เลขทะเบียนรถยนต์"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
            />
          </label>

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg w-full max-w-md flex items-center justify-center gap-2"
            onClick={handleSearch}
          >
            <FaSearch className="text-white" /> ค้นหา
          </button>

          {searchResults.filter(
            (result) => result.Status !== "PaymentCompleted"
          ).length > 0 && (
            <div className="mt-8 w-full max-w-4xl bg-white p-2 rounded-lg shadow-lg overflow-y-auto">
              {searchResults
                .filter((result) => result.Status !== "PaymentCompleted")
                .map((result, index) => (
                  <div key={index} className="mb-8 border-b pb-6">
                    {/* รายละเอียดรถยนต์ */}
                    <h2 className="text-xl font-semibold mb-2 text-gray-800">
                      <FaCarAlt className="inline-block text-orange-500" />{" "}
                      เลขทะเบียนรถ: {result.LicensePlate}
                    </h2>
                    <p className="mb-2 text-gray-600">
                      สถานะ: {translateStatus(result.Status)}
                    </p>
                    <p className="mb-4 text-gray-600">
                      รายละเอียดปัญหา:{" "}
                      {translateProblemDetails(result.ProblemDetails)}
                    </p>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="relative pt-1">
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                          <div
                            style={{ width: `${progress}%` }}
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                          ></div>
                        </div>
                        <span className="block text-right text-sm text-gray-500">
                          {`${progress.toFixed(2)}%`} เสร็จสมบูรณ์
                        </span>
                      </div>
                    </div>

                    {/* รายละเอียดขั้นตอนการซ่อม */}
                    {result.repair_processes.map((process, processIndex) => (
                      <div
                        key={processIndex}
                        className="mb-6 bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
                        <h3 className="text-lg font-semibold mb-2 text-gray-700">
                          ขั้นตอน: {process.StepName}
                        </h3>
                        <p className="mb-2 text-gray-600">
                          สถานะ: {translateStatus(process.Status)}
                        </p>

                        {process.repair_status.length === 0 ? (
                          <p className="text-gray-600">ยังไม่ทำการอัพเดต</p>
                        ) : (
                          <div className="flex flex-wrap justify-center gap-4">
                            {process.repair_status
                              .filter((status) => status.StatusType === "ก่อน")
                              .map((status, statusIndex) => (
                                <div
                                  key={statusIndex}
                                  className="flex flex-col items-center w-full md:w-1/2 lg:w-1/3 p-4"
                                >
                                  <p className="text-lg font-bold mb-2">ก่อน</p>
                                  {status.Image3 && (
                                    <img
                                      src={`https://bodyworkandpaint.pantook.com/storage/${status.Image3}`}
                                      alt="ก่อน"
                                      className="w-48 h-48 object-cover rounded-lg shadow-md"
                                    />
                                  )}
                                </div>
                              ))}

                            {process.repair_status
                              .filter((status) => status.StatusType === "หลัง")
                              .map((status, statusIndex) => (
                                <div
                                  key={statusIndex}
                                  className="flex flex-col items-center w-full md:w-1/2 lg:w-1/3 p-4"
                                >
                                  <p className="text-lg font-bold mb-2">หลัง</p>
                                  {status.Image3 && (
                                    <img
                                      src={`https://bodyworkandpaint.pantook.com/storage/${status.Image3}`}
                                      alt="หลัง"
                                      className="w-48 h-48 object-cover rounded-lg shadow-md"
                                    />
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
