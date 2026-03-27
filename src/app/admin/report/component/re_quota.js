"use client";
import React, { useState, useMemo } from "react";
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

const getStatusLabel = (status) => {
  switch (status) {
    case "Pending":
      return "รอดำเนินการ";
    case "In Progress":
      return "กำลังดำเนินการ";
    case "Completed":
      return "เสร็จสิ้น";
    case "PaymentCompleted":
      return "ชำระเงินแล้ว";
    default:
      return status; // ถ้าไม่มีการแปลง ให้คืนค่าตามเดิม
  }
};

// QuotationCard Component
const QuotationCard = ({ quotation, isSelected, onClick }) => (
  <div
    className={`mb-2 cursor-pointer ${isSelected ? "bg-blue-100" : ""}`}
    onClick={() => onClick(quotation)}
  >
    <div className="flex items-center p-4">
      <div>
        <h3 className="font-semibold">
          ใบเสนอราคาที่: {quotation.Quotation_ID}
        </h3>
        <p className="text-sm text-gray-500">
          ทะเบียนรถ: {quotation.LicensePlate}
        </p>
        <p className="text-sm text-gray-500">
          สถานะ: {getStatusLabel(quotation.Status)}
        </p>
      </div>
    </div>
  </div>
);

const QuotationList = ({
  quotations,
  selectedQuotation,
  onSelectQuotation,
}) => (
  <div className="h-[calc(100vh-200px)]">
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
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">รายละเอียด</h2>
      <div className="h-[800px] overflow-auto">
        <ul className="space-y-2 grid sm:grid-cols-2 items-center pb-2">
          <li className="text-sm">
            <strong>ใบเสนอราคาที่:</strong> {quotation.Quotation_ID}
          </li>
          <li className="text-sm">
            <strong>วันที่รับเข้า:</strong> {quotation.QuotationDate}
          </li>
          <li className="text-sm">
            <strong>พนักงาน:</strong> {quotation.SAuser}
          </li>
          <li className="text-sm">
            <strong>สถานะ:</strong> {getStatusLabel(quotation.Status)}
          </li>
        </ul>
        <ul className="space-y-2 grid sm:grid-cols-1 items-center">
          <li className="text-sm">
            <strong>ชื่อลูกค้า:</strong> {quotation.FullName}
          </li>
          <li className="text-sm">
            <strong>เบอร์โทร:</strong> {quotation.CustomerPhone}
          </li>
          <li className="text-sm">
            <strong>ทะเบียนรถ:</strong> {quotation.LicensePlate}
          </li>
        </ul>
        <ul className="space-y-2 grid sm:grid-cols-3 items-center pb-2">
          <li className="text-sm">
            <strong>แบรนด์:</strong> {quotation.Brand}
          </li>
          <li className="text-sm">
            <strong>รุ่น:</strong> {quotation.Model}
          </li>
          <li className="text-sm">
            <strong>ปี:</strong> {quotation.Year}
          </li>
          <li className="text-sm">
            <strong>สี:</strong> {quotation.color}
          </li>
        </ul>
        <ul className="space-y-2 grid sm:grid-cols-1 items-center">
          <li className="text-sm">
            <strong>ประเมินความเสียหาย:</strong> {quotation.DamageAssessment}
          </li>
          <li className="text-sm">
            <strong>รายละเอียดความเสียหาย:</strong> {quotation.ProblemDetails}
          </li>

          <li className="text-sm">
            <strong>บริษัทประกัน:</strong> {quotation.InsuranceCompany}
          </li>

          <li className="text-sm">
            <strong>ประเมินค่าใช้จ่าย:</strong> {quotation.RepairCost}
          </li>
          <li className="text-sm">
            <strong>วันที่เสร็จสิ้น:</strong> {quotation.completionDate}
          </li>
        </ul>
        <ul className="space-y-2 grid sm:grid-cols-2 items-center">
          <li className="text-sm">
            <strong>ค่าใช้จ่ายสุทธิ:</strong> {quotation.TotalAmount}
          </li>
          <li className="text-sm">
            <strong>ประเภทการชำระเงิน:</strong> {quotation.PaymentMethod}
          </li>
          <li className="text-sm">
            <strong>วันที่ชำระเงิน:</strong> {quotation.PaymentDate}
          </li>
        </ul>

        <h3 className="text-lg font-bold mt-4">ขั้นตอนการซ่อม</h3>
        {quotation.repair_processes.map((process, index) => (
          <div key={index} className="mb-4">
            <p>
              <strong>ขั้นตอน:</strong> {process.StepName}
            </p>
            <p>
              <strong>รายละเอียด:</strong> {process.Description}
            </p>
            <p>
              <strong>สถานะ:</strong> {process.Status}
            </p>

            <h4 className="text-md font-bold">อะไหล่ที่ใช้</h4>
            <ul className="ml-4 list-disc">
              {process.partusage.map((part, i) => (
                <li key={i} className="text-sm">
                  {part.partname} - {part.Quantity} x ฿{part.PricePerUnit}
                </li>
              ))}
            </ul>

            <h4 className="text-md font-bold">สถานะการซ่อมแซม</h4>
            {process.repair_status.map((status, i) => (
              <div key={i} className="ml-4">
                <p>
                  <strong>ช่าง:</strong> {status.technician}
                </p>
                <p>
                  <strong>สถานะ:</strong> {status.StatusType}
                </p>
                <div className="flex space-x-2 pb-4">
                  {status.Image1 && (
                    <img
                      src={`https://bodyworkandpaint.pantook.com/storage/${status.Image1}`}
                      alt="Before Repair"
                      className="h-24 w-24 object-cover"
                    />
                  )}
                  {status.Image2 && (
                    <img
                      src={`https://bodyworkandpaint.pantook.com/storage/${status.Image2}`}
                      alt="During Repair"
                      className="h-24 w-24 object-cover"
                    />
                  )}
                  {status.Image3 && (
                    <img
                      src={`https://bodyworkandpaint.pantook.com/storage/${status.Image3}`}
                      alt="After Repair"
                      className="h-24 w-24 object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const generatePrintPage = (quotation) => {
  if (!quotation) return; // ตรวจสอบว่ามีข้อมูล quotation หรือไม่

  // Thai month names
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

  const allProcessWorkTimeRows = (quotation.repair_processes || [])
    .map((process) => {
      const partRows = (process.partusage || [])
        .map(
          (part, partIndex) => `
          <tr class="no-border">
            ${
              partIndex === 0
                ? `<td rowspan="${process.partusage.length}">${process.StepName}</td>`
                : ""
            }
            <td>${part.partname}</td>
            <td>${part.Quantity}</td>
            <td>${part.PricePerUnit}</td>
            <td>฿${(part.Quantity * part.PricePerUnit).toFixed(2)}</td>
          </tr>
        `
        )
        .join("");

      const totalPartsCost = process.partusage.reduce(
        (total, part) => total + part.Quantity * part.PricePerUnit,
        0
      );

      const totalCostRow = `
        <tr>
          <td colspan="4" class="total">รวมค่าใช้จ่ายสำหรับขั้นตอน</td>
          <td>฿${totalPartsCost.toFixed(2)}</td>
        </tr>
      `;

      return partRows + totalCostRow;
    })
    .join("");

  const newWindow = window.open("", "", "width=1000,height=800");
  if (newWindow) {
    // Get current date
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = thaiMonths[currentDate.getMonth()]; // Get Thai month name
    const year = currentDate.getFullYear() + 543; // Convert to Buddhist Era
    newWindow.document.write(`
      <html>
        <head>
          <title>ใบเสนอราคาที่: ${quotation.Quotation_ID}</title>
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
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>บริษัท ทรัพย์พูลทวีเซอร์วิส</h1>
              <p>212 หมู่ 8 ต.ดงลาน อ.เมือง จ.ร้อยเอ็ด 45000</p>
            </div>
            <div class="title">รายงานประวัติรถเข้าซ่อม</div>
            <div class="title">ใบเสนอราคา: ${quotation.Quotation_ID}</div>
            <div class="report-info">
                      <span id="report-date">รายงาน ณ วันที่: ${day} ${month} ${year}</span>
                    </div>
            <ul>
              <li><strong>วันที่รับเข้า:</strong> ${
                quotation.QuotationDate
              }</li>
              <li><strong>พนักงาน:</strong> ${quotation.SAuser}</li>
              <li><strong>สถานะ:</strong> ${getStatusLabel(
                quotation.Status
              )}</li>
              <li><strong>ชื่อลูกค้า:</strong> ${quotation.FullName}</li>
              <li><strong>เบอร์โทร:</strong> ${quotation.CustomerPhone}</li>
              <li><strong>ทะเบียนรถ:</strong> ${quotation.LicensePlate}</li>
              <li><strong>แบรนด์:</strong> ${quotation.Brand}</li>
              <li><strong>รุ่น:</strong> ${quotation.Model}</li>
              <li><strong>ปี:</strong> ${quotation.Year}</li>
            </ul>
            <h2>รายการซ่อมแซม</h2>
            <table>
              <thead>
                <tr>
                  <th>ขั้นตอน</th>
                  <th>อะไหล่</th>
                  <th>จำนวน</th>
                  <th>ราคาต่อหน่วย (บาท)</th>
                  <th>รวม (บาท)</th>
                </tr>
              </thead>
              <tbody>
                ${allProcessWorkTimeRows}
              </tbody>
            </table>
            <div>
              <p><strong>รวมค่าใช้จ่ายทั้งหมด:</strong> ฿${
                !isNaN(parseFloat(quotation.TotalAmount)) // ตรวจสอบว่าเป็นตัวเลขหรือไม่
                  ? parseFloat(quotation.TotalAmount).toFixed(2) // แปลงเป็น number และใช้ toFixed
                  : "0.00"
              }</p>
            </div>
          </div>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.print();
  }
};

// Report Component (Main Component)
const fetchQuotationsData = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/ShowAlldataReport"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const queryClient = new QueryClient();

const Report = () => {
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const {
    data: quotationsData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotationsData"],
    queryFn: fetchQuotationsData,
  });

  const quotations = useMemo(() => {
    if (quotationsData?.status && Array.isArray(quotationsData.data)) {
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

  return (
    <div>
      <div className="w-full pb-2">
        <div className="grid sm:grid-cols-2 w-full h-auto bg-white shadow-lg ring-1 ring-black/5 rounded-xl">
          <div>
            <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">
              ประวัติรถเข้าซ่อมทั้งหมด
            </h1>
            <div className="grid sm:grid-cols-1 pl-5">
              <DateRangePicker
                startDate={startDate}
                endDate={endDate}
                onStartDateChange={setStartDate}
                onEndDateChange={setEndDate}
              />
              <button
                type="button"
                onClick={() => generatePrintPage(selectedQuotation)} // ส่ง selectedQuotation ไปยังฟังก์ชัน
                className="mt-2 mb-2 mr-5 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
              >
                ปริ้นข้อมูล
              </button>
            </div>
            <div className="p-5 flex">
              <div className="w-full h-[700px] p-2 rounded border border-gray-700 overflow-y-auto">
                <QuotationList
                  quotations={quotations}
                  selectedQuotation={selectedQuotation}
                  onSelectQuotation={setSelectedQuotation}
                />
              </div>
            </div>
          </div>
          <div className="p-5 pt-10 flex">
            <div className="w-full h-[ุ400px] p-2 rounded border border-gray-700">
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

const Re_quota = () => (
  <QueryClientProvider client={queryClient}>
    <Report />
  </QueryClientProvider>
);

export default Re_quota;
