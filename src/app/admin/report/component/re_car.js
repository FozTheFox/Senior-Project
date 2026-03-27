"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { FaCar } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoTime } from "react-icons/io5";

// DateRangePicker Component
const DateRangePicker = ({
  startDate,
  endDate,
  onStartDateChange,
  onEndDateChange,
}) => {
  return (
    <div className="flex space-x-4 mb-2">
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

// QuotationCard Component
const QuotationCard = ({ quotation, isSelected, onClick }) => (
  <div
    className={`mb-2 cursor-pointer ${isSelected ? "bg-blue-100" : ""}`}
    onClick={() => onClick(quotation)}
  >
    <div className="flex items-center p-4">
      <div>
        <h3 className="font-semibold">ทะเบียนรถ: {quotation.LicensePlate}</h3>
      </div>
    </div>
  </div>
);

const QuotationList = ({
  quotations,
  selectedQuotation,
  onSelectQuotation,
}) => (
  <div className="h-[calc(100vh-200px)] overflow-y-auto">
    {quotations.map((quotation) => (
      <QuotationCard
        key={quotation.Quotation_ID}
        quotation={quotation}
        isSelected={selectedQuotation?.Quotation_ID === quotation.Quotation_ID}
        onClick={onSelectQuotation}
      />
    ))}
  </div>
);

// QuotationDetails Component
const QuotationDetails = ({ quotation }) => {
  const { customer, Vehicle, ...otherDetails } = quotation;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">รายละเอียด</h2>
      <div className="h-[calc(50vh-100px)] overflow-auto">
        <ul className="space-y-2">
          {Object.entries(otherDetails).map(([key, value]) => (
            <li key={key} className="text-sm">
              <strong>{key}:</strong>{" "}
              {typeof value === "object" ? JSON.stringify(value) : value}
            </li>
          ))}
          {customer && (
            <li className="text-sm">
              <strong>Customer Details : </strong>
              <ul className="ml-4">
                {Object.entries(customer).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </li>
          )}
          {Vehicle && (
            <li className="text-sm">
              <strong>Vehicle Details : </strong>
              <ul className="ml-4">
                {Object.entries(Vehicle).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

const fetchQuotationsData = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/quotationsCompleted"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const fetchQuotationInvoice = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/Quotationinvoice"
  );
  const data = await response.json();
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return data.data;
};

const queryClient = new QueryClient();

const ReportComponent = () => {
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [repairProcesses, setRepairProcesses] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [laborCost, setLaborCost] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [vat, setVat] = useState(0);
  const [total, setTotal] = useState(0);
  const [sumPrice, setSumPrice] = useState(0);

  const {
    data: quotationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotationsData"],
    queryFn: fetchQuotationsData,
  });

  const fetchRepairProcesses = async (quotationId) => {
    try {
      const response = await fetch(
        "https://bodyworkandpaint.pantook.com/api/Quotationinvoice"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const selectedData = data.data.find(
        (item) => item.Quotation_ID === quotationId
      );
      setRepairProcesses(selectedData?.repairProcesses || null);
    } catch (error) {
      console.error("Failed to fetch repair processes:", error);
    }
  };

  useEffect(() => {
    if (selectedQuotation) {
      fetchRepairProcesses(selectedQuotation.Quotation_ID);
    }
  }, [selectedQuotation]);

  useEffect(() => {
    if (repairProcesses) {
      const partCost = repairProcesses
        .flatMap((rp) => rp.partUsages)
        .reduce(
          (acc, part) => acc + part.Quantity * parseFloat(part.PricePerUnit),
          0
        );

      const subtotal = parseFloat(laborCost) + partCost;
      const discountAmount = (subtotal * parseFloat(discount)) / 100;
      const vatAmount = (subtotal - discountAmount) * (parseFloat(vat) / 100);
      const grandTotal = subtotal - discountAmount + vatAmount;

      setTotal(grandTotal.toFixed(2));
    }
  }, [laborCost, discount, vat, repairProcesses]);

  const filteredQuotations = useMemo(() => {
    if (quotationsData && Array.isArray(quotationsData.data)) {
      return quotationsData.data.filter((quotation) => {
        const quotationDate = new Date(quotation.QuotationDate);
        return (
          (!startDate || quotationDate >= startDate) &&
          (!endDate || quotationDate <= endDate)
        );
      });
    }
    return [];
  }, [quotationsData, startDate, endDate]);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-8 text-red-500">
        Error: {error.message}
      </div>
    );

  const generatePrintPage = async () => {
    if (!selectedQuotation) {
      alert("Please select a technician to print the report.");
      return;
    }

    const customerRows = Object.entries(selectedQuotation)
      .map(([key, value]) => {
        if (key === "customer") {
          return `
            <td>ชื่อลูกค้า : ${value.FullName}<br />
                เบอร์โทร : ${value.CustomerPhone}</td>
        `;
        }
      })
      .join("");

    const carRows = Object.entries(selectedQuotation)
      .map(([key, value]) => {
        if (key === "Vehicle") {
          return `
          <td>${value.Brand}</td>
          <td>${value.Model}</td>
          <td>${value.Year}</td>
        `;
        } else if (key === "LicensePlate") {
          return `
          <td>${value}</td>
        `;
        } else if (key === "Color") {
          return `
          <td>${value}</td>
        `;
        }
      })
      .join("");

    const QuotationRows = Object.entries(selectedQuotation)
      .map(([key, value]) => {
        if (key === "QuotationDate") {
          return `
            <td>วันที่ : ${new Date(value).toLocaleString()}</td>
        `;
        }
      })
      .join("");

    const additionalData = await fetchQuotationInvoice();
    const selectedAdditionalData = additionalData.find(
      (item) => item.Quotation_ID === selectedQuotation.Quotation_ID
    );

    const partUsageRows =
      selectedAdditionalData?.repairProcesses
        ?.flatMap((process) =>
          process.partUsages.map(
            (part) => `
        <tr class="no-border">
          <td>${part.PartName}</td>
          <td>${part.Quantity}</td>
          <td>${part.PricePerUnit}</td>
        </tr>
      `
          )
        )
        .join("") || "";

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
              .no-border td, th, tr{
                border: none;
              }
              .LR td, th ,tr{
                border-top : none;
                border-bottem : none;
              }
              .wrapper table {
                border: none;
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
              <div>
                <table style="border: none;" class="wrapper">
                  <tr>
                    <td style="width: 70%; vertical-align: top;">
                      <table>
                        <tr class="no-border">
                            ${customerRows}
                        </tr>
                      </table>
                    </td>
                    <td style="width: 20px; vertical-align: top; border: none;">
                    </td>
                    <td style="width: 30%; vertical-align: top;">
                      <table>
                        <tr class="no-border">
                          ${QuotationRows}
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table>
                  <tr class="no-border">
                    <th>ทะเบียนรถ</th>
                    <th>แบรนด์</th>
                    <th>รุ่น</th>
                    <th>ปี</th>
                    <th>สี</th>
                  </tr>
                  <tr class="no-border">
                    ${carRows}
                  </tr>
                </table>
                <table>
                  <thead>
                    < tr>
                      <th>รายการ</th>
                      <th>จำนวน</th>
                      <th>ราคาต่อชิ้น</th>
                    </tr>
                  </thead>
                  <tbody>
                      ${partUsageRows}
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colspan="3">รวม</th>
                      <th>${total}</th>
                    </tr>
                  </tfoot>
                </table>
              </div>
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
    <div>
      <div className="w-full">
        <div className="grid sm:grid-cols-2 w-full h-[650px] bg-white shadow-lg ring-1 ring-black/5 rounded-xl">
          <div>
            <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">
              รายการรถซ่อมเสร็จสิ้น
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
                className="mt-6 mb-4 ml-28 bg-indigo-600 text-white px-2 py-2 rounded-md shadow hover:bg-indigo-700"
              >
                ปริ้น PDF
              </button>
            </div>
            <div className="p-5 flex">
              <div className="w-full h-[400px] p-2 rounded border border-gray-700 overflow-y-auto">
                <QuotationList
                  quotations={filteredQuotations}
                  selectedQuotation={selectedQuotation}
                  onSelectQuotation={setSelectedQuotation}
                />
              </div>
            </div>
          </div>
          <div className="p-5  flex">
            <div className="w-full h-[ุ430px] rounded border border-gray-700">
              {selectedQuotation && (
                <QuotationDetails quotation={selectedQuotation} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const re_car = () => (
  <QueryClientProvider client={queryClient}>
    <ReportComponent />
  </QueryClientProvider>
);

export default re_car;
