"use client";
import React, { useState } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Fetch parts from the API
const fetchParts = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/partsAdmin"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// Main Report Component
const queryClient = new QueryClient();

const Report = () => {
  const {
    data: partsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["parts"],
    queryFn: fetchParts,
  });

  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-8 text-red-500">
        Error: {error.message}
      </div>
    );

  // Get unique brands
  const uniqueBrands = [...new Set(partsData.data.map((part) => part.Brand))];

  // Get models based on selected brand
  const modelsForSelectedBrand = selectedBrand
    ? [
        ...new Set(
          partsData.data
            .filter((part) => part.Brand === selectedBrand)
            .map((part) => part.Model)
        ),
      ]
    : [...new Set(partsData.data.map((part) => part.Model))];

  // Get years based on selected model
  const yearsForSelectedModel = selectedModel
    ? [
        ...new Set(
          partsData.data
            .filter((part) => part.Model === selectedModel)
            .map((part) => part.Year)
        ),
      ]
    : [...new Set(partsData.data.map((part) => part.Year))];

  // Filter parts based on selected Brand, Model, and Year
  const filteredParts = partsData.data.filter(
    (part) =>
      (selectedBrand ? part.Brand === selectedBrand : true) &&
      (selectedModel ? part.Model === selectedModel : true) &&
      (selectedYear ? part.Year === selectedYear : true)
  );

  // Group parts by Brand, Model, Year, and then by CategoryName
  const groupedParts = filteredParts.reduce((acc, part) => {
    const brandModelYearKey = `${part.Brand}  ${part.Model}  ${part.Year}`;
    const categoryKey = part.CategoryName;

    // Initialize brand-model-year key if it doesn't exist
    if (!acc[brandModelYearKey]) {
      acc[brandModelYearKey] = {};
    }

    // Initialize category if it doesn't exist
    if (!acc[brandModelYearKey][categoryKey]) {
      acc[brandModelYearKey][categoryKey] = [];
    }

    acc[brandModelYearKey][categoryKey].push(part);
    return acc;
  }, {});

  // ฟังก์ชันสร้าง PDF
  const generatePDF = () => {
    const newWindow = window.open("", "", "width=1000,height=800");
    if (newWindow) {
      const partsHTML = Object.keys(groupedParts)
        .map((brandModelYearKey) => {
          return `
            <div>
              <h3>${brandModelYearKey}</h3>
              ${Object.keys(groupedParts[brandModelYearKey])
                .map((categoryKey) => {
                  return `
                    <h4>${categoryKey}</h4>
                    <table style="width: 100%; border-collapse: collapse;">
                      <thead>
                        <tr>
                          <th style="border: 1px solid #ddd; padding: 8px;">ชื่ออะไหล่</th>
                          <th style="border: 1px solid #ddd; padding: 8px;">รายละเอียด</th>
                          <th style="border: 1px solid #ddd; padding: 8px;">จำนวน</th>
                          <th style="border: 1px solid #ddd; padding: 8px;">ราคา (บาท)</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${groupedParts[brandModelYearKey][categoryKey]
                          .map(
                            (part) => `
                            <tr>
                              <td style="border: 1px solid #ddd; padding: 8px;">${part.Name}</td>
                              <td style="border: 1px solid #ddd; padding: 8px;">${part.Description}</td>
                              <td style="border: 1px solid #ddd; padding: 8px;">${part.Quantity}</td>
                              <td style="border: 1px solid #ddd; padding: 8px;">${part.PricePerUnit}</td>
                            </tr>
                          `
                          )
                          .join("")}
                      </tbody>
                    </table>
                  `;
                })
                .join("")}
            </div>
          `;
        })
        .join("");

      newWindow.document.write(`
        <html>
          <head>
            <title>รายงานรายการอะไหล่</title>
            <style>
              body {
                font-family: Arial, sans-serif;
                margin: 20px;
              }
              .header {
                text-align: center;
                margin-bottom: 20px;
              }
              h1 {
                text-align: center;
              }
              h2 {
                color: #333;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin-bottom: 20px;
              }
              th, td {
                border: 1px solid #ddd;
                padding: 8px;
                text-align: left;
              }
              th {
                background-color: #f2f2f2;
              }
            </style>
          </head>
          <body>
           <div class="header">
              <h1>บริษัท ทรัพย์พูลทวีเซอร์วิส</h1>
               <p>212 หมู่ 8 ต.ดงลาน อ.เมือง จ.ร้อยเอ็ด 45000</p>
            </div>
            <h1>รายงานรายการอะไหล่</h1>
            ${partsHTML}
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();
    }
  };

  return (
    <div className="w-full p-4 border  rounded-xl bg-white">
      <h1 className="text-2xl font-bold mb-4 ">รายงานรายการอะไหล่</h1>

      <div className="mb-4 flex space-x-4">
        {/* ใช้ flex และ space-x-4 เพื่อจัดเรียงแนวนอน */}
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">เลือก แบรนด์:</label>
          <select
            onChange={(e) => {
              setSelectedBrand(e.target.value);
              setSelectedModel(""); // Reset model and year when brand changes
              setSelectedYear("");
            }}
            value={selectedBrand}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทั้งหมด</option>
            {uniqueBrands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">เลือก รุ่น:</label>
          <select
            onChange={(e) => {
              setSelectedModel(e.target.value);
              setSelectedYear(""); // Reset year when model changes
            }}
            value={selectedModel}
            disabled={!selectedBrand}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทั้งหมด</option>
            {modelsForSelectedBrand.map((model) => (
              <option key={model} value={model}>
                {model}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col">
          <label className="mb-1 font-semibold">เลือก ปี:</label>
          <select
            onChange={(e) => setSelectedYear(e.target.value)}
            value={selectedYear}
            disabled={!selectedModel}
            className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">ทั้งหมด</option>
            {yearsForSelectedModel.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
        <div className="ml-auto">
          {" "}
          {/* เพิ่ม div เพื่อจัดให้ปุ่มอยู่ทางขวา */}
          <button
            onClick={generatePDF}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            ปริ้นข้อมูลทั้งหมด
          </button>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4 mt-4 text-center border p-2 rounded-xl bg-gray-50">
        รายการอะไหล่
      </h2>
      {Object.keys(groupedParts).map((brandModelYearKey, index) => (
        <div key={index} className="border rounded-xl p-4 mb-4 bg-gray-100">
          <h3 className="font-bold pb-2 ">{brandModelYearKey}</h3>
          {Object.keys(groupedParts[brandModelYearKey]).map(
            (categoryKey, categoryIndex) => (
              <div key={categoryIndex} className="mb-2">
                <h4 className="font-semibold pb-2">{categoryKey}</h4>
                <ul className="grid grid-cols-2 gap-4">
                  {" "}
                  {/* ใช้ grid layout สำหรับ 2 คอลัมน์ */}
                  {groupedParts[brandModelYearKey][categoryKey].map((part) => (
                    <li
                      key={part.Part_ID}
                      className="border p-2 rounded-xl bg-gray-50"
                    >
                      <h3 className="font-semibold">{part.Name}</h3>
                      <p>รายละเอียด: {part.Description}</p>
                      <p>จำนวน: {part.Quantity}</p>
                      <p>ราคา: {part.PricePerUnit} บาท</p>
                    </li>
                  ))}
                </ul>
              </div>
            )
          )}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Report />
    </QueryClientProvider>
  );
}
