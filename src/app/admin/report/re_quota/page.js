'use client';
import React, { useState, useMemo } from 'react';
import Sidebar from "../../../ui/Sidebar";
import { FaHouseUser } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoTime } from "react-icons/io5";
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

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
      <h2 className="text-xl font-bold mb-4">Quotation Details</h2>
      <div className="h-[calc(100vh-300px)] overflow-auto">
        <ul className="space-y-2 grid sm:grid-cols-2">
          {Object.entries(quotation).map(([key, value]) => (
            <li key={key} className="text-sm">
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Report Component (Main Component)
const fetchQuotationsData = async () => {
  const response = await fetch('https://bodyworkandpaint.pantook.com/api/quotationsshowAlldata');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const queryClient = new QueryClient();

const Report = () => {
    const [selectedQuotation, setSelectedQuotation] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const { data: quotationsData, isLoading, error } = useQuery({
      queryKey: ['quotationsData'],
      queryFn: fetchQuotationsData,
    });

  const quotations = useMemo(() => {
    if (quotationsData?.status && Array.isArray(quotationsData.data)) {
      return quotationsData.data.filter(quotation => {
        const quotationDate = new Date(quotation.QuotationDate);
        return (!startDate || quotationDate >= startDate) && (!endDate || quotationDate <= endDate);
      });
    }
    return [];
  }, [quotationsData, startDate, endDate]);


  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">Error: {error.message}</div>;

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
            <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <FaCar className="my-1 text-7xl text-gray-600 group-hover:text-white"/>
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">รายงานรถซ่อมสำเร็จ</strong>
            </div>
          </a>
          <a href="re_quota">
            <div className="min-h-[150px] max-w-[350px] bg-gray-500 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <HiDocumentReport className="my-1 text-7xl text-white group-hover:text-white"/>
              <strong className="my-1 text-base text-white group-hover:text-white font-semibold">รายงานใบเสนอราคาทั้งหมด</strong>
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
          <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">Quotation Report</h1>
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
                quotations={quotations} 
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