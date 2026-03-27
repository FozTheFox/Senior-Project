"use client";
import React, { useState, useMemo } from "react";
import Sidebar from "../../../ui/Sidebar";
import { FaHouseUser } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoTime } from "react-icons/io5";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// DateRangePicker Component
const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex space-x-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          value={startDate ? startDate.toISOString().substr(0, 10) : ""}
          onChange={(e) => onStartDateChange(new Date(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <input
          type="date"
          value={endDate ? endDate.toISOString().substr(0, 10) : ""}
          onChange={(e) => onEndDateChange(new Date(e.target.value))}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
};

// TechnicianList Component
const TechnicianCard = ({ technician, isSelected, onClick }) => (
  <div
    className={`mb-2 cursor-pointer ${isSelected ? "bg-blue-100" : ""}`}
    onClick={() => onClick(technician)}
  >
    <div className="flex items-center p-4">
      <div className="h-10 w-10 mr-4 bg-gray-300 rounded-full">
        <img
          src={`https://bodyworkandpaint.pantook.com/storage/${technician.image}`}
          alt={technician.name}
          className="h-full w-full rounded-full"
        />
      </div>
      <div>
        <h3 className="font-semibold">{technician.name}</h3>
        <p className="text-sm text-gray-500">{technician.email}</p>
      </div>
    </div>
  </div>
);

const TechnicianList = ({
  technicians,
  selectedTechnician,
  onSelectTechnician,
}) => (
  <div className="h-[calc(100vh-200px)]">
    {technicians.map((technician) => (
      <TechnicianCard
        key={technician.User_ID}
        technician={technician}
        isSelected={selectedTechnician?.User_ID === technician.User_ID}
        onClick={onSelectTechnician}
      />
    ))}
  </div>
);

// WorkTimeDetails Component
const WorkTimeDetails = ({ technician, startDate, endDate }) => {
  const filteredWorkTimes = technician.workTimes.filter((time) => {
    const timeDate = new Date(time.Year, time.Month - 1);
    return (
      (!startDate || timeDate >= startDate) && (!endDate || timeDate <= endDate)
    );
  });

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{technician.name}'s Work Times</h2>
      <div className="h-[calc(100vh-300px)] overflow-auto">
        <ul className="space-y-2">
          {filteredWorkTimes.map((time, index) => (
            <li key={index} className="text-sm">
              {time.Year} -{" "}
              {new Date(time.Year, time.Month - 1).toLocaleString("default", {
                month: "long",
              })}
              :{time.Total_Hours} hours {time.Total_Minutes} minutes
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Report Component (Main Component)
const fetchRepairStatusTimes = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/repair-status-times"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const queryClient = new QueryClient();

const Report = () => {
  const [selectedTechnician, setSelectedTechnician] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const {
    data: repairStatusData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["repairStatusTimes"],
    queryFn: fetchRepairStatusTimes,
  });

  const technicians = useMemo(() => {
    if (repairStatusData?.status && Array.isArray(repairStatusData.data)) {
      return repairStatusData.data.reduce((acc, item) => {
        const existingTechnician = acc.find(
          (tech) => tech.User_ID === item.User_ID
        );
        if (existingTechnician) {
          existingTechnician.workTimes.push(item);
        } else {
          acc.push({
            User_ID: item.User_ID,
            name: item.name,
            email: item.email,
            image: item.image,
            workTimes: [item],
          });
        }
        return acc;
      }, []);
    }
    return [];
  }, [repairStatusData]);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-8 text-red-500">
        Error: {error.message}
      </div>
    );

  const generatePrintPage = () => {
    const techniciansToDisplay = selectedTechnician
      ? [selectedTechnician]
      : technicians; // ถ้าไม่มีการเลือก ให้ใช้ technicians ทั้งหมด

    const allTechniciansWorkTimeRows = techniciansToDisplay
      .map((technician) => {
        const filteredWorkTimes = technician.workTimes.filter((time) => {
          const timeDate = new Date(time.Year, time.Month - 1);
          return (
            (!startDate || timeDate >= startDate) &&
            (!endDate || timeDate <= endDate)
          );
        });

        // Calculate the number of rows for the rowspan
        const rowspanValue = filteredWorkTimes.length;

        const workTimeRows = filteredWorkTimes
          .map(
            (time, index) => `
          <tr class="no-border">
            ${
              index === 0
                ? `<td class="top" rowspan="${rowspanValue}">${technician.name}</td>`
                : ""
            }
            <td>${time.Year}</td>
            <td>${new Date(time.Year, time.Month - 1).toLocaleString(
              "default",
              { month: "long" }
            )}</td>
            <td>${time.Total_Hours}</td>
            <td>${time.Total_Minutes}</td>
          </tr>
        `
          )
          .join("");

        const totalWorkTime = (() => {
          // Calculate total work time
          const totalHours = filteredWorkTimes.reduce(
            (sum, time) => sum + Number(time.Total_Hours),
            0
          );
          const totalMinutes = filteredWorkTimes.reduce(
            (sum, time) => sum + Number(time.Total_Minutes),
            0
          );

          // Convert total minutes to hours and minutes
          const extraHours = Math.floor(totalMinutes / 60);
          const remainingMinutes = totalMinutes % 60;
          const finalTotalHours = totalHours + extraHours;

          const formattedOutput =
            finalTotalHours > 0
              ? `${finalTotalHours} hours ${remainingMinutes} minutes`
              : `${remainingMinutes} minutes`;

          return `
            <tr>
              <td colspan="4" class="total">รวมเวลาการทำงาน</td>
              <td>${formattedOutput}</td>
            </tr>
          `;
        })();

        return workTimeRows + totalWorkTime;
      })
      .join("");

    const newWindow = window.open("", "", "width=1000,height=800");
    if (newWindow) {
      newWindow.document.write(`
          <html>
            <head>
              <title>Report</title>
              <style>
                body {
                  font-family: 'Arial', sans-serif;
                  margin: 0;
                  padding: 0;
                }
                .container {
                  width: 80%;
                  margin: 0 auto;
                  padding: 20px;
                }
                .header {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .header img {
                  width: 100px;
                }
                .header h1 {
                  font-size: 24px;
                  margin: 0;
                }
                .header p {
                  margin: 0;
                  font-size: 14px;
                }
                .title {
                  text-align: center;
                  margin: 20px 0;
                  font-size: 18px;
                }
                .report-info {
                  text-align: center;
                  margin-bottom: 20px;
                }
                .report-info span {
                  display: inline-block;
                  margin: 0 10px;
                }
                table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
                }
                table, th, td {
                  border: 1px solid #000;
                }
                th, td {
                  padding: 8px;
                  text-align: left;
                }
                .total {
                  text-align: right;
                  padding-right: 20px;
                  font-weight: bold;
                }
                .no-border td {
                  border-top: none;
                  border-bottom: none;
                }
                .top {
                  text-align: top;
                }
              </style>
            </head>
            <body>
              <div class="container">
                <div class="header">
                  <img alt="Company Logo" height="100" src="https://storage.googleapis.com/a1aa/image/y4hzOGmBUDqOFpD8u4tjHoa6orUOX04pjsMY7LpIdvaLmm5E.jpg" width="100"/>
                  <h1>บริษัท ออโต้ไพร์ จำกัด</h1>
                  <p>14 ถนนหลวง แขวงวัดเทพศิรินทร์ เขตป้อมปราบฯ กรุงเทพมหานาคร 10100</p>
                </div>
                <div class="title">รายงานการขายอะไหล่ทั้งหมด</div>
                <div class="report-info">
                  <span>รายงาน ณ เดือน: กรกฎาคม</span>
                  <span>พ.ศ.: 2548</span>
                  <span>หน้า: 1/1</span>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>ชื่อพนังงาน</th>
                      <th>ปี</th>
                      <th>เดือน</th>
                      <th>ชั่วโมง</th>
                      <th>นาที</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${allTechniciansWorkTimeRows}
                  </tbody>
                </table>
              </div>
            </body>
          </html>
        `);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
    }
  };

  return (
    <div className="p-10 px-72 mx-auto w-full">
      <div className="mb-6 gap-5 grid sm:grid-cols-4">
        <a href="re_worktime">
          <div className="min-h-[150px] max-w-[350px] bg-gray-500 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
            <IoTime className="my-1 text-7xl text-white group-hover:text-white" />
            <strong className="my-1 text-base text-white group-hover:text-white font-semibold">
              รายงานเวลาทำงานช่าง
            </strong>
          </div>
        </a>
        <a href="re_car">
          <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
            <FaCar className="my-1 text-7xl text-gray-600 group-hover:text-white" />
            <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
              รายงานรถซ่อมสำเร็จ
            </strong>
          </div>
        </a>
        <a href="re_quota">
          <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
            <HiDocumentReport className="my-1 text-7xl text-gray-600 group-hover:text-white" />
            <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
              รายงานใบเสนอราคาทั้งหมด
            </strong>
          </div>
        </a>
        <a href="re_insu">
          <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
            <FaHouseUser className="my-1 text-7xl text-gray-600 group-hover:text-white" />
            <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
              รายงานบริษัทประกัน
            </strong>
          </div>
        </a>
      </div>
      <div className="grid sm:grid-cols-2 w-full h-[550px] bg-white shadow-lg ring-1 ring-black/5 rounded-xl">
        <div>
          <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">
            Technician Work Time Report
          </h1>
          <div className="grid sm:grid-cols-2 pl-5">
            <DateRangePicker
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
            />
            <button
              type="button"
              onClick={generatePrintPage}
              className="mt-6 mb-4 ml-20 mr-5 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
            >
              ออกใบเสร็จ
            </button>
          </div>
          <div className="p-5 flex">
            <div className="w-full h-[300px] p-2 rounded border border-gray-700 overflow-y-auto">
              <TechnicianList
                technicians={technicians}
                selectedTechnician={selectedTechnician}
                onSelectTechnician={setSelectedTechnician}
              />
            </div>
          </div>
        </div>
        <div className="p-5 pt-10 flex">
          <div className="w-full h-[430px] p-2 rounded border border-gray-700">
            {selectedTechnician && (
              <WorkTimeDetails
                technician={selectedTechnician}
                startDate={startDate}
                endDate={endDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <Sidebar />
    <Report />
  </QueryClientProvider>
);

export default App;
