"use client";
import Sidebar from "../../../ui/Sidebar";
import { CgProfile } from "react-icons/cg";
import { FaHouseUser } from "react-icons/fa";
import { FaCar, FaShieldAlt } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { useEffect, useState } from "react";
import axios from "axios";

export default function SetInsu() {
  const [insuranceCompanies, setInsuranceCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  useEffect(() => {
    async function fetchInsuranceCompanies() {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/insurance-companies"
        );
        const filteredCompanies = response.data.data.filter(
          (company) => company.Company_ID !== 4
        );
        setInsuranceCompanies(filteredCompanies);
      } catch (err) {
        setError("Error fetching data");
      }
    }

    fetchInsuranceCompanies(); // Fetch data when component is mounted
  }, []);

  // Function to handle input field changes
  const handleChange = (e) => {
    setSelectedCompany({
      ...selectedCompany,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditClick = (company) => {
    // Update the selected company and show the popup
    setSelectedCompany(company);
    setIsPopupVisible(true);
  };

  const handleCancel = () => {
    // Hide the popup without saving changes
    setIsPopupVisible(false);
    setSelectedCompany(null);
  };

  const handleSave = async () => {
    if (selectedCompany.Company_ID) {
      // API สำหรับการแก้ไขข้อมูลบริษัทประกัน
      try {
        const response = await axios.put(
          `https://bodyworkandpaint.pantook.com/api/insurance-companies/${selectedCompany.Company_ID}`,
          {
            Name: selectedCompany.Name,
            PhoneNumber: selectedCompany.PhoneNumber,
            Address: selectedCompany.Address,
          }
        );
        console.log("Updated successfully:", response.data);
        setSelectedCompany(null);
      } catch (error) {
        console.error("Error updating company:", error);
      }
    } else {
      // API สำหรับการเพิ่มข้อมูลบริษัทประกันใหม่
      try {
        const response = await axios.post(
          "https://bodyworkandpaint.pantook.com/api/insurance-companies",
          {
            Name: selectedCompany.Name,
            PhoneNumber: selectedCompany.PhoneNumber,
            Address: selectedCompany.Address,
          }
        );
        setSelectedCompany(null);
        console.log("Added successfully:", response.data);
      } catch (error) {
        console.error("Error adding company:", error);
      }
    }
    setIsPopupVisible(false); // ปิด popup หลังจาก save
  };

  const handleAddNew = () => {
    // Logic to add a new company
    setSelectedCompany({
      Company_ID: "",
      Name: "",
      PhoneNumber: "",
      Email: "",
      Address: "",
    });
    setIsPopupVisible(true);
  };

  return (
    <div>
      <div className="bg-gray-100 h-full flex justify-center items-center">
        <div className="max-w-fullxl w-full bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl p-8">
          <div className="flex justify-between mb-4">
            <h1 className="text-lg font-bold">ตั้งค่าบริษัทประกัน</h1>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              onClick={handleAddNew}
            >
              เพิ่มบริษัท
            </button>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <table className="w-full text-left rtl:text-right text-black">
                <thead className="text-black rounded-xl uppercase bg-white border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ชื่อบริษัทประกัน
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {insuranceCompanies.map((company) => (
                    <tr
                      key={company.Company_ID}
                      className="even:bg-white odd:bg-gray-100 border-b dark:border-gray-200 hover:bg-gray-900 p-2 rounded-md group"
                    >
                      <td className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap group-hover:text-white">
                        {company.Name}
                      </td>
                      <td className="px-6 py-5">
                        <button
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                          onClick={() => handleEditClick(company)}
                        >
                          แก้ไข
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {isPopupVisible && (
              <div className="bg-white rounded-xl shadow-lg p-4">
                <div className="relative flex flex-col my-2 h-[340px] w-[550px]">
                  <label className="max-h-10 w-72 mb-8 justify-center">
                    <span className="text-base font-semibold">
                      ชื่อบริษัทประกัน
                    </span>
                    <input
                      type="text"
                      name="Name"
                      className="block w-[560px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                      value={selectedCompany?.Name || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="max-h-10 w-72 mb-8 justify-center">
                    <span className="text-base font-semibold">
                      เบอร์โทรบริษัทประกัน
                    </span>
                    <input
                      type="text"
                      name="PhoneNumber"
                      className="block w-[560px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                      value={selectedCompany?.PhoneNumber || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <label className="max-h-10 w-72 mb-8 justify-center">
                    <span className="text-base font-semibold">
                      ที่อยู่บริษัทประกัน
                    </span>
                    <input
                      type="text"
                      name="Address"
                      className="block w-[560px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                      value={selectedCompany?.Address || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <div className="flex justify-end gap-4">
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                      onClick={handleSave}
                    >
                      Save
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                      onClick={handleCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
