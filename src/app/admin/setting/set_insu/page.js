'use client';
import Sidebar from "../../../ui/Sidebar";
import { CgProfile } from "react-icons/cg";
import { FaHouseUser } from "react-icons/fa";
import { 
    FaCar,
    FaShieldAlt
} from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function set_insu(){
    const [insuranceCompanies, setInsuranceCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState({
        Company_ID: '',
        Name: '',
        PhoneNumber: '',
        Email: '',
        Address: ''
    });

  useEffect(() => {
    async function fetchInsuranceCompanies() {
      try {
        const response = await axios.get('https://bodyworkandpaint.pantook.com/api/insurance-companies');
        const filteredCompanies = response.data.data.filter(company => company.Company_ID !== 4);
        setInsuranceCompanies(filteredCompanies);
      } catch (err) {
        setError('Error fetching data');
      }
    }

    fetchInsuranceCompanies(); // ดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  // ฟังก์ชันเพื่อจัดการการเปลี่ยนแปลงใน input fields
  const handleChange = (e) => {
    setSelectedCompany({
        ...selectedCompany,
        [e.target.name]: e.target.value
    });
};

  const handleRowClick = (company) => {
    // อัปเดตข้อมูลบริษัทที่ถูกเลือก
    setSelectedCompany({
        Company_ID: company.Company_ID,
        Name: company.Name,
        PhoneNumber: company.PhoneNumber,
        Email: company.Email,
        Address: company.Address
    });
};

  const handleCancel = () => {
    // เมื่อกดปุ่มยกเลิก ให้ตั้ง isPartSelected เป็น false เพื่อซ่อนปุ่ม
    setSelectedCompany(false);
};

    return (
        <div>
            <Sidebar/>
            <div className="p-10 px-72 bg-gray-100">
                <div className="mb-6 gap-5 grid sm:grid-cols-5">
                    <a href="set_emp">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                       <CgProfile className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าพนักงาน</strong>
                    </div>
                    </a>
                    
                    <a href="set_car">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaCar className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่ารถ</strong>
                        
                    </div>
                    </a>
                    <a href="set_insu">
                    <div className="max-h-[150px] max-w-[350px] bg-gray-600 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaShieldAlt className="my-1 text-9xl text-white group-hover:text-white"/>
                        <strong className="my-1 text-base text-white group-hover:text-white font-semibold">ตั้งค่าบริษัทประกัน</strong>
                        
                    </div>
                    </a>
                    <a href="set_part">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaScrewdriverWrench className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าอะไหล่</strong>
                        
                    </div>
                    </a>
                </div>
                <div className="mb-6 gap-80 grid sm:grid-cols-12">
                    <div className="w-72 h-96 overflow-y-auto bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
                        <div className="my-4 border-b border-gray-100 pb-4 items-center justify-center">
                        <table className="w-full text-left rtl:text-right text-black">
                                <thead className="text-black rounded-xl uppercase bg-white border-b border-gray-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-3">ชื่อบริษัทประกัน</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {insuranceCompanies.map((company) => (
                                    <tr
                                        key={company.Company_ID}
                                        className="even:bg-white odd:bg-gray-100 border-b dark:border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
                                        onClick={() => handleRowClick(company)}
                                    >
                                    <td className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap group-hover:text-white">
                                        {company.Name}
                                    </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="max-h-[460px] min-w-[620px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
                        <div className="m-4 gap-32 grid sm:grid-cols-3">
                            {selectedCompany ? (
                                <div className="relative flex flex-col my-2 h-[340px] w-[600px]">
                                    <label className="max-h-10 w-72 mb-8 justify-center">
                                        <span className="text-base font-semibold">รหัสบริษัทประกัน</span>
                                        <input 
                                            type="text" 
                                            className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                            value={selectedCompany.Company_ID} 
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label className="max-h-10 w-72 mb-8 justify-center">
                                        <span className="text-base font-semibold">ชื่อบริษัทประกัน</span>
                                        <input 
                                            type="text" 
                                            className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                            value={selectedCompany.Name} 
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label className="max-h-10 w-72 mb-8 justify-center">
                                        <span className="text-base font-semibold">เบอร์โทรบริษัทประกัน</span>
                                        <input 
                                            type="text" 
                                            className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                            value={selectedCompany.PhoneNumber} 
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <label className="max-h-10 w-72 mb-8 justify-center">
                                        <span className="text-base font-semibold">ที่อยู่บริษัทประกัน</span>
                                        <input 
                                            type="text" 
                                            className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                            value={selectedCompany.Address} 
                                            onChange={handleChange}
                                        />
                                    </label>
                                    <div className="gap-24 grid sm:grid-cols-6">
                                        <label className="max-h-10 w-72 mb-8 justify-center">
                                            <span className="text-base font-semibold"></span>
                                            <input className=" p-2" placeholder=""/>
                                        </label>
                                        <button className="absolute right-5 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                            ยืนยัน
                                        </button>

                                        {/* ปุ่มยกเลิก แสดงก็ต่อเมื่อ isPartSelected เป็น true */}
                                        {selectedCompany && (
                                        <button
                                            className="absolute right-[100px] bottom-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                            onClick={handleCancel}
                                        >
                                            ยกเลิก
                                        </button>
                                        )}
                                    </div>
                                </div>
                            ):(
                                <div className="relative flex flex-col my-2 h-[340px] w-[600px]">
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">รหัสบริษัทประกัน</span>
                                    <input 
                                        type="text" 
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                        value={""}  
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">ชื่อบริษัทประกัน</span>
                                    <input 
                                        type="text" 
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                        value={""} 
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">เบอร์โทรบริษัทประกัน</span>
                                    <input 
                                        type="text" 
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                        value={""}  
                                        onChange={handleChange}
                                    />
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">ที่อยู่บริษัทประกัน</span>
                                    <input 
                                        type="text" 
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700" 
                                        value={""}  
                                        onChange={handleChange}
                                    />
                                </label>
                                <button className="absolute right-5 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                >ยืนยัน</button>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}