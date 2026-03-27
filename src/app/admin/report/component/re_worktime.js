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
  const formatDate = (date) =>
    date instanceof Date && !isNaN(date)
      ? date.toISOString().substr(0, 10)
      : "";

  return (
    <div className="flex space-x-4 mb-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Start Date
        </label>
        <input
          type="date"
          value={formatDate(startDate)}
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
          value={formatDate(endDate)}
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
    onClick={() => onClick(isSelected ? null : technician)} // Check if selected
  >
    <div className="flex items-center p-4">
      {/* <div className="h-10 w-10 mr-4 bg-gray-300 rounded-full">
        <img
          src={`https://bodyworkandpaint.pantook.com/storage/${technician.image}`}
          alt={technician.name}
          className="h-full w-full rounded-full"
        />
      </div> */}
      <div>
        <h3 className="font-semibold">{technician.name}</h3>
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
  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{technician.name}</h2>
      <div className="h-[calc(100vh-300px)] overflow-auto">
        <ul className="space-y-2">
          {filteredWorkTimes.map((time, index) => (
            <li key={index} className="text-sm">
              {time.Year} - {thaiMonths[time.Month - 1]} : {time.Total_Hours}{" "}
              ชั่วโมง {time.Total_Minutes} นาที
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

    const thaiMonths = [
      "มกราคม",
      "กุมภาพันธ์",
      "มีนาคม",
      "เมษายน",
      "พฤษภาคม",
      "มิถุนายน",
      "กรกฎาคม",
      "สิงหาคม",
      "กันยายน",
      "ตุลาคม",
      "พฤศจิกายน",
      "ธันวาคม",
    ];

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
                <td>${time.Year + 543}</td> <!-- Convert to Buddhist Era -->
                <td>${
                  thaiMonths[time.Month - 1]
                }</td> <!-- Use Thai month names -->
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
              ? `${finalTotalHours} ชั่วโมง ${remainingMinutes} นาที`
              : `${remainingMinutes} นาที`;

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
      // Get current date
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.toLocaleString("default", { month: "long" });
      const year = currentDate.getFullYear() + 543; // Convert to Buddhist Era

      // Assuming we have only one page for this example
      const totalPages = 1; // You can change this if you have multiple pages
      const currentPage = 1; // You can change this based on the actual page number

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
                      <h1>บริษัท ทรัพย์พูลทวีเซอร์วิส</h1>
                      <p>212 หมู่ 8 ต.ดงลาน อ.เมือง จ.ร้อยเอ็ด 45000</p>
                    </div>
                    <div class="title">รายงานเวลาการทำงานของช่าง</div>
                    <div class="report-info">
                      <span id="report-date">รายงาน ณ วันที่: ${day} ${
                          thaiMonths[currentDate.getMonth()]
                          } ${year}</span>
                      <span id="report-page">หน้า: ${currentPage}/${totalPages}</span>
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
    <div className="w-full">
      <div className="grid sm:grid-cols-2 w-full h-[550px] bg-white shadow-lg ring-1 ring-black/5 rounded-xl">
        <div>
          <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">
            เวลาการทำงานของช่าง
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
              className="mt-6 mb-4 ml-28 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
            >
              ปริ้นข้อมูล
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

const Re_worktime = () => (
  <QueryClientProvider client={queryClient}>
    <Report />
  </QueryClientProvider>
);

export default Re_worktime;
