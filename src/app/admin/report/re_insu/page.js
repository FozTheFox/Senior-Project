'use client';
import React, { useState } from 'react';
import Sidebar from "../../../ui/Sidebar";
import { FaHouseUser } from "react-icons/fa";
import { FaCar } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoTime } from "react-icons/io5";
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';

// InsuranceCompanyCard Component
const InsuranceCompanyCard = ({ company, isSelected, onClick }) => (
  <div 
    className={`mb-2 cursor-pointer ${isSelected ? 'bg-blue-100' : ''}`}
    onClick={() => onClick(company)}
  >
    <div className="flex items-center p-4">
      <div>
        <h3 className="font-semibold">Company Name: {company.Name}</h3>
        <p className="text-sm text-gray-500">Address: {company.Address}</p>
      </div>
    </div>
  </div>
);

const InsuranceCompanyList = ({ companies, selectedCompany, onSelectCompany }) => {
  const filteredCompanies = companies.filter(company => company.Company_ID !== 4);

  return (
    <div className="h-[calc(100vh-200px)] overflow-y-auto">
      {filteredCompanies.map((company) => (
        <InsuranceCompanyCard 
          key={company.id} 
          company={company} 
          isSelected={selectedCompany?.id === company.id}
          onClick={onSelectCompany}
        />
      ))}
    </div>
  );
};

// InsuranceCompanyDetails Component
const InsuranceCompanyDetails = ({ company }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Company Details</h2>
      <div className="h-[calc(100vh-300px)] overflow-auto">
        <ul className="space-y-2">
          {Object.entries(company).map(([key, value]) => (
            <li key={key} className="text-sm">
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// Fetch insurance companies data
const fetchInsuranceCompaniesData = async () => {
  const response = await fetch('https://bodyworkandpaint.pantook.com/api/insurance-companies');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const queryClient = new QueryClient();

const Report = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const { data: insuranceCompaniesData, isLoading, error } = useQuery({
    queryKey: ['insuranceCompaniesData'],
    queryFn: fetchInsuranceCompaniesData,
  });

  const insuranceCompanies = React.useMemo(() => {
    if (insuranceCompaniesData?.status && Array.isArray(insuranceCompaniesData.data)) {
      return insuranceCompaniesData.data;
    }
    return [];
  }, [insuranceCompaniesData]);

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
            <div className="min-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <HiDocumentReport className="my-1 text-7xl text-gray-600 group-hover:text-white"/>
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">รายงานใบเสนอราคาทั้งหมด</strong>
            </div>
          </a>
          <a href="re_insu">
            <div className="min-h-[150px] max-w-[350px] bg-gray-500 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <FaHouseUser className="my-1 text-7xl text-white group-hover:text-white"/>
              <strong className="my-1 text-base text-white group-hover:text-white font-semibold">รายงานบริษัทประกัน</strong>
            </div>
          </a>
        </div>
        <div className='grid sm:grid-cols-2 w-full h-[550px] bg-white shadow-lg ring-1 ring-black/5 rounded-xl'>
          <div>
            <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">Insurance Companies</h1>
            <div className="p-5 pt-24 flex">
              <div className="w-full h-[300px] p-2 rounded border border-gray-700 overflow-y-auto">
                <InsuranceCompanyList 
                  companies={insuranceCompanies} 
                  selectedCompany={selectedCompany} 
                  onSelectCompany={setSelectedCompany} 
                />
              </div>
            </div>
          </div>
          <div className="p-5 pt-10 flex">
            <div className="w-full h-[430px] p-2 rounded border border-gray-700">
              {selectedCompany && (
                <InsuranceCompanyDetails company={selectedCompany} />
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