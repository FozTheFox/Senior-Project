"use client";
import React, { useState } from "react";
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

// InsuranceCompanyCard Component
const InsuranceCompanyCard = ({ company, isSelected, onClick }) => (
  <div
    className={`mb-2 cursor-pointer ${isSelected ? "bg-blue-100" : ""}`}
    onClick={() => onClick(company)}
  >
    <div className="flex items-center p-4">
      <div>
        <h3 className="font-semibold">{company.Name}</h3>
        {/* <p className="text-sm text-gray-500">Address: {company.Address}</p> */}
      </div>
    </div>
  </div>
);

const InsuranceCompanyList = ({
  companies,
  selectedCompany,
  onSelectCompany,
}) => {
  const filteredCompanies = companies.filter(
    (company) => company.Company_ID !== 4
  );

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
      <h2 className="text-xl font-bold mb-4">รายละเอียด</h2>
      <div className="h-[calc(100vh-300px)] overflow-auto">
        {/* แสดงชื่อบริษัท */}
        <h3 className="font-semibold">{company.Name}</h3>
        {/* แสดงที่อยู่ */}
        <p className="text-base text-gray-800">ที่อยู่ : {company.Address}</p>
        {/* แสดงเบอร์โทรศัพท์ */}
        <p className="text-base text-gray-800">
          เบอร์โทร : {company.PhoneNumber}
        </p>
      </div>
    </div>
  );
};

// Fetch insurance companies data
const fetchInsuranceCompaniesData = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/insurance-companies"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

const queryClient = new QueryClient();

const Report = () => {
  const [selectedCompany, setSelectedCompany] = useState(null);
  const {
    data: insuranceCompaniesData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["insuranceCompaniesData"],
    queryFn: fetchInsuranceCompaniesData,
  });

  const insuranceCompanies = React.useMemo(() => {
    if (
      insuranceCompaniesData?.status &&
      Array.isArray(insuranceCompaniesData.data)
    ) {
      return insuranceCompaniesData.data;
    }
    return [];
  }, [insuranceCompaniesData]);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error)
    return (
      <div className="text-center mt-8 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div>
      <div className="w-full">
        <div className="grid sm:grid-cols-2 w-full h-[550px] bg-white shadow-lg ring-1 ring-black/5 rounded-xl">
          <div>
            <h1 className="pl-5 pt-5 text-2xl font-bold mb-6">บริษัทประกัน</h1>
            <div className="p-5 flex">
              <div className="w-full h-[370px] p-2 rounded border border-gray-700 overflow-y-auto">
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

const Re_insu = () => (
  <QueryClientProvider client={queryClient}>
    <Report />
  </QueryClientProvider>
);

export default Re_insu;
