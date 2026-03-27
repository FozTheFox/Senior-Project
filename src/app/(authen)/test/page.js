'use client';
import React, { useState, useMemo } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from "../../ui/Sidebar";
import { FaHouseUser  , FaCar } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoTime } from "react-icons/io5";

// Assuming QuotationCard, QuotationList, and QuotationDetails are defined above or imported

// DateRangePicker Component
const DateRangePicker = ({ startDate, endDate, onStartDateChange, onEndDateChange }) => {
  return (
    <div className="flex space-x-4 mb-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input 
          type="date" 
          value={startDate ? startDate.toISOString().substr(0, 10) : ''} 
          onChange={e => onStartDateChange(new Date(e.target.value))} 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">End Date</label>
        <input 
          type="date" 
          value={endDate ? endDate.toISOString().substr(0, 10) : ''} 
          onChange={e => onEndDateChange(new Date(e.target.value))} 
          className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
    </div>
  );
};

// QuotationCard Component
const QuotationCard = ({ quotation, isSelected, onClick }) => (
  <div 
    className={`mb-2 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
    onClick={() => onClick(quotation)}
  >
    <div className="flex items-center p-4">
      <div className="h-10 w-10 mr-4 bg-gray-300 rounded-full">
        <img src={`https://bodyworkandpaint.pantook.com/storage/${quotation.ImageSlie}`} alt={quotation.Quotation_ID} className="h-full w-full rounded-full" />
      </div>
      <div>
        <h3 className="font-semibold">Quotation ID: {quotation.Quotation_ID}</h3>
        <p className="text-sm text-gray-500">Total Amount: {quotation.TotalAmount}</p>
      </div>
    </div>
  </div>
);

const QuotationList = ({ quotations, selectedQuotation, onSelectQuotation }) => (
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
      <h2 className="text-xl font-bold mb-4">Cars Details</h2>
      <div className="h-[calc(100vh-300px)] overflow-auto">
        <ul className="space-y-2">
          {/* Render other details */}
          {Object.entries(otherDetails).map(([key, value]) => (
            <li key={key} className="text-sm">
              <strong>{key}:</strong> {typeof value === 'object' ? JSON.stringify(value) : value}
            </li>
          ))}

          {/* Render customer details if available */}
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

          {/* Render vehicle details if available */}
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
  const [quotationsResponse, invoiceResponse] = await Promise.all([
    fetch('https://bodyworkandpaint.pantook.com/api/quotationsCompleted'),
    fetch('https://bodyworkandpaint.pantook.com/api/Quotationinvoice'),
  ]);

  if (!quotationsResponse.ok || !invoiceResponse.ok) {
    throw new Error('Network response was not ok');
  }

  const quotationsData = await quotationsResponse.json();
  const invoiceData = await invoiceResponse.json();

  return { quotationsData: quotationsData.data, invoiceData: invoiceData.data };
};

const queryClient = new QueryClient();

const Report = () => {
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [quotationsData, setQuotationsData] = useState([]);
  const [invoiceData, setInvoiceData] = useState([]);

  const { isLoading, error } = useQuery({
    queryKey: ['quotationInvoiceData'],
    queryFn: fetchQuotationsData,
    onSuccess: (data) => {
      setQuotationsData(data.quotationsData);
      setInvoiceData(data.invoiceData);
    },
  });

  const filteredQuotations = useMemo(() => {
    if (quotationsData && Array.isArray(quotationsData)) {
      return quotationsData.filter(quotation => {
        const quotationDate = new Date(quotation.QuotationDate);
        return (!startDate || quotationDate >= startDate) && (!endDate || quotationDate <= endDate);
      });
    }
    return [];
  }, [quotationsData, startDate, endDate]);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;

  const generatePrintPage = () => {
    if (!selectedQuotation) {
      alert("Please select a technician to print the report.");
      return;
    }
  
    const customerRows = Object.entries(selectedQuotation).map(([key, value]) => {
      if (key === 'customer') {
        return `
            <td>ชื่อลูกค้า : ${value.FullName}<br />
                เบอร์โทร : ${value.CustomerPhone}</td>
        `;
      }
    }).join('');

    const carRows = Object.entries(selectedQuotation).map(([key, value]) => {
      if (key === 'Vehicle') {
        return `
          <td>${value.Brand}</td>
          <td>${value.Model}</td>
          <td>${value.Year}</td>
        `;
      } else if (key === 'LicensePlate') {
        return `
          <td>${value}</td>
        `;
      } else if (key === 'Color') {
        return `
          <td>${value}</td>
        `;
      }
    }).join('');

    const QuotationRows = Object.entries(selectedQuotation).map(([key, value]) => {
      if (key === 'QuotationDate') {
        return `
            <td>วันที่ : ${new Date(value).toLocaleString()}</td>
        `;
      }
    }).join('');

    const selectedAdditionalData = invoiceData.find(item => item.Quotation_ID === selectedQuotation.Quotation_ID);
    const partUsageRows = selectedAdditionalData?.repairProcesses?.flatMap(process => 
      process.partUsages.map(part => `
        <tr>
          <td>${part.PartName}</td>
          <td>${part.Quantity}</td>
          <td>${part.PricePerUnit}</td>
        </tr>
      `)
    ).join('') || '';

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
                    <tr>
                      <th>ชื่อลูกค้า</th>
                      <th>เบอร์โทร</th>
                      <th>เดือน</th>
                      <th>ชั่วโมง</th>
                      <th>นาที</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      ${partUsageRows}
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <th colspan="3">รวม</th>
                      <th></th>
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
      <Sidebar/>
      <div className="p-10 px-72 mx-auto w-full">
        <div className="mb-6 gap-5 grid sm:grid-cols-4">
          <a href="re_worktime">
            <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <IoTime className="my-1 text-7xl text-gray-600 group-hover:text-white"/>
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">รายงานเวลาทำงานช่าง</strong>
            </div>
          </a>
          <a href="re_car">
            <div className="min-h-[150px] max-w-[350px] bg-gray-500 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <FaCar className="my-1 text-7xl text-white group-hover:text-white"/>
              <strong className="my-1 text-base text-white group-hover:text-white font-semibold">รายงานรถซ่อมสำเร็จ</strong>
            </div>
          </a>
          <a href="re_quota">
          <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <HiDocumentReport className="my-1 text-7xl text-gray-600 group-hover:text-white"/>
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">รายงานใบเสนอราคาทั้งหมด</strong>
            </div>
          </a>
          <a href="re_insu">
            <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <FaHouseUser className="my-1 text-7xl text-gray-600 group-hover:text-white"/>
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">รายงานบริษัทประกัน</strong>
            </div>
          </a>
        </div>
        <div className='grid sm:grid-cols-2 w-full h-[550px] bg-white shadow-lg ring-1 ring-black/5 rounded-xl'>
          <div>
            <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">Cars Report</h1>
            <div className='grid sm:grid-cols-2 pl-5'>
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
                <QuotationList 
                  quotations={filteredQuotations} 
                  selectedQuotation={selectedQuotation}
                  onSelectQuotation={setSelectedQuotation}
                />
              </div>
            </div>
          </div>
          <div className="p-5 pt-10 flex">
            <div className="w-full h-[430px] p-2 rounded border border-gray-700">
              {selectedQuotation && (
                <QuotationDetails 
                  quotation={selectedQuotation} 
                />
              )}
            </div>
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