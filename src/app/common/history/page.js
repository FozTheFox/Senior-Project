"use client";

import Topbar from "../../ui/Topbar";
import { useState, useEffect } from "react";
import { FaSearch, FaCarAlt } from "react-icons/fa"; // ใช้ไอคอนเพิ่มเติม

export default function history() {
  const [customerHistory, setCustomerHistory] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // ดึงข้อมูลผู้ใช้จาก sessionStorage
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const customerId = user.Customer_ID; // สมมติว่า user มี Customer_ID

      // ดึงข้อมูลจาก API
      fetch(
        `https://bodyworkandpaint.pantook.com/api/customerhistory?Customer_ID=${customerId}`
      )
        .then((response) => response.json())
        .then((data) => {
          setCustomerHistory(data.data);
        })
        .catch((err) => {
          console.error("Error fetching customer history:", err);
          setError(err);
        });
    } else {
    }
  }, []);

  useEffect(() => {
    if (customerHistory.length > 0) {
      const completedProcesses = customerHistory[0].repair_processes.filter(
        (process) => process.Status === "Completed"
      );
      const totalProcesses = customerHistory[0].repair_processes.length;
      const progressPercentage =
        (completedProcesses.length / totalProcesses) * 100;
      setProgress(progressPercentage);
    }
  }, [customerHistory]);

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
          <div className="bg-white rounded-xl p-6">
            <h1 className="items-center justify-center text-3xl font-bold">
              ประวัติการเข้าซ่อม
            </h1>
          </div>
          {customerHistory.length > 0 ? (
            <div className="mt-8 w-full max-w-4xl bg-white p-6 rounded-lg shadow-lg">
              {customerHistory.map((result, index) => (
                <div key={index} className="mb-8 border-b pb-6">
                  {/* รายละเอียดรถยนต์ */}
                  <h2 className="text-xl font-semibold mb-2 text-gray-800">
                    <FaCarAlt className="inline-block text-orange-500" />{" "}
                    เลขทะเบียนรถ: {result.LicensePlate}
                  </h2>
                  <p className="mb-2 text-gray-600">สถานะ: {result.Status}</p>
                  <p className="mb-4 text-gray-600">
                    รายละเอียดปัญหา: {result.ProblemDetails}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="relative pt-1">
                      <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
                        <div
                          style={{
                            width: `${isNaN(progress) ? 0 : progress}%`,
                          }}
                          className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
                        ></div>
                      </div>
                      <span className="block text-right text-sm text-gray-500">
                        {`${isNaN(progress) ? 0 : progress.toFixed(2)}%`}{" "}
                        เสร็จสมบูรณ์
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
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 text-center text-gray-500">กรุณาเข้าสู่ระบบ</div>
          )}
        </div>
      </div>
    </div>
  );
}
