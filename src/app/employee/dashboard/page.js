// export default Dashboard;
"use client";
import Sidebar from "@/app/ui/Sidebar";
import { useState, useEffect } from "react";
import axios from "axios"; // For API calls
import { Pie } from "react-chartjs-2"; // For Pie Chart
import "chart.js/auto"; // Don't forget to install this package
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

// Function to calculate progress percentage
const calculateProgress = (repairProcesses) => {
  const totalSteps = repairProcesses.length;
  const completedSteps = repairProcesses.filter(
    (process) => process.Status === "Completed"
  ).length;
  return (completedSteps / totalSteps) * 100; // Calculate percentage of completed steps
};

const Dashboard = () => {
  // State for storing data
  const [repairStatus, setRepairStatus] = useState(null);
  const [inProgressCars, setInProgressCars] = useState([]);
  const [latestQuotations, setLatestQuotations] = useState([]);
  const [waitingCars, setWaitingCars] = useState([]);

  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบข้อมูลจาก sessionStorage
    const role = sessionStorage.getItem("role");

    if (!role || role !== "รับรถ") {
      router.push("/Loginmain"); // ถ้าไม่ใช่ Admin ให้ไปหน้า login
    }
  }, [router]);

  // Fetch API data on component mount
  useEffect(() => {
    // Fetch repair status
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/quotationsshowAlldata"
        );
        const data = response.data.data;

        const currentMonth = dayjs().format("YYYY-MM");

        const filteredData = data.filter(
          (item) => dayjs(item.created_at).format("YYYY-MM") === currentMonth
        );

        const completed = filteredData.filter(
          (item) => item.Status === "Completed"
        ).length;
        const inProgress = data.filter(
          (item) => item.Status === "In Progress"
        ).length;
        const pending = data.filter((item) => item.Status === "Pending").length;

        setRepairStatus({ completed, inProgress, pending }); // Set state
      } catch (error) {
        console.error("Error fetching repair status:", error);
      }
    };

    fetchData();

    // Fetch cars in progress
    const fetchInProgressCars = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/quotationsInProgress"
        );
        setInProgressCars(response.data.data);
      } catch (error) {
        console.error("Error fetching in-progress cars:", error);
      }
    };

    fetchInProgressCars();

    // Fetch latest quotations
    const fetchlatestQuotations = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/LatestQuotations"
        );
        setLatestQuotations(response.data.data);
      } catch (error) {
        console.error("Error fetching waiting cars:", error);
      }
    };

    fetchlatestQuotations();

    // Fetch waiting cars
    const fetchWaitingCars = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/quotationsCompleted"
        );
        setWaitingCars(response.data.data);
      } catch (error) {
        console.error("Error fetching waiting cars:", error);
      }
    };

    fetchWaitingCars();
  }, []);

  // Pie chart data
  const pieData = {
    labels: ["เสร็จสิ้น", "กำลังดำเนินการ", "รอดำเนินการ"],
    datasets: [
      {
        data: repairStatus
          ? [
              repairStatus.completed,
              repairStatus.inProgress,
              repairStatus.pending,
            ]
          : [0, 0, 0],
        backgroundColor: ["#4CAF50", "#2196F3", "#FFC107"],
      },
    ],
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-grow p-10 pl-72">
        <div className="mb-2 grid xl:grid-cols-2 grid-cols-1 gap-8">
          {/* Repair Status */}
          <div className="w-full bg-white p-6 shadow-md rounded-md lg:h-[400px] xl:h-[460px] 2xl:h-[560px]">
            <h1 className="text-2xl font-bold mb-4 text-gray-800">
              สถานะการซ่อม
            </h1>
            <div className="md:w-2/4 lg:w-64 2xl:w-96 mx-auto">
              <Pie data={pieData} />
            </div>
            {repairStatus && (
              <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                <p className="text-sm">รอดำเนินการ: {repairStatus.pending}</p>
                <p className="text-sm">
                  กำลังดำเนินการ: {repairStatus.inProgress}
                </p>
                <p className="text-sm">เสร็จสิ้น: {repairStatus.completed}</p>
              </div>
            )}
          </div>

          {/* Waiting Cars */}
          <div className="mb-6 bg-white p-6 shadow-md rounded-md lg:h-[400px] xl:h-[460px] 2xl:h-[560px]">
            <h2 className="text-xl font-bold mb-4 text-gray-800">รถที่รอรับ</h2>
            <div className="overflow-wrap">
              <ul>
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th className="text-center px-4 py-2 border-b border-gray-600">ทะเบียน</th>
                      <th className="text-center px-4 py-2 border-b border-gray-600">ลูกค้า</th>
                      <th className="text-center px-4 py-2 border-b border-gray-600">เบอร์โทร</th>
                    </tr>
                  </thead>
                  <tbody>
                    {waitingCars && waitingCars.length > 0 ? (
                      waitingCars.map((car) => (
                        <tr key={car.LicensePlate}>
                          <td className="text-center border-b px-4 py-2">
                            {car.LicensePlate}
                          </td>
                          <td className="text-center border-b px-4 py-2 lg:break-words lg:whitespace-normal ">
                            {car.customer.FullName}
                          </td>
                          <td className="text-center border-b px-4 py-2">
                            {car.customer.CustomerPhone}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="border px-4 py-2">
                          ไม่มีรถที่รอรับในขณะนี้
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </ul>
            </div>
          </div>
        </div>

        {/* Latest Quotations */}
        <div className="mb-6 bg-white p-6 shadow-md rounded-md ">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            ใบเสนอราคาล่าสุด
          </h2>
          <div className="overflow-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700 border-b border-gray-600">
                    ทะเบียน
                  </th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700 border-b border-gray-600">
                    ลูกค้า
                  </th>
                  <th className="p-2 text-center text-sm font-semibold text-gray-700 border-b border-gray-600">
                    ราคาการซ่อมโดยประมาณ
                  </th>
                </tr>
              </thead>
              <tbody>
                {latestQuotations.map((quote) => (
                  <tr
                    key={quote.licenseplate}
                    className="border-b border-gray-300 pb-4"
                  >
                    <td className="p-2 text-gray-700 text-center">{quote.licenseplate}</td>
                    <td className="p-2 text-gray-700 text-center">
                      {quote.customer.FullName}
                    </td>
                    <td className="p-2 text-gray-700 text-center">
                      {quote.RepairCost} บาท
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* In Progress Cars */}
        <div className="w-full bg-white p-6 shadow-md rounded-md  max-h-screen">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            รถที่กำลังซ่อม
          </h2>
          <div className="overflow-auto  h-[660px]">
            <ul>
              {inProgressCars.map((car) => (
                <li
                  key={car.Quotation_ID}
                  className="mb-6 px-6 border-b border-gray-300 pb-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <p className="text-gray-700">ทะเบียน: {car.licenseplate}</p>
                    <p className="text-gray-700">
                      {car.Brand} {car.Model} {car.Year}
                    </p>
                    <p className="text-gray-700">สี: {car.color}</p>
                    <p className="text-gray-700">
                      รายละเอียดปัญหา: {car.problemdetails}
                    </p>
                  </div>
                  <p className="text-gray-700 mt-2">
                    ความคืบหน้า:{" "}
                    {Math.round(calculateProgress(car.repair_processes))}%
                  </p>
                  <div className="w-full bg-gray-200 h-4 rounded-full">
                    <div
                      className="bg-blue-600 h-4 rounded-full"
                      style={{
                        width: `${calculateProgress(car.repair_processes)}%`,
                      }}
                    ></div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
