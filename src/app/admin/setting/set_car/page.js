'use client';
import Sidebar from "../../../ui/Sidebar";
import { CgProfile } from "react-icons/cg";
import { FaHouseUser } from "react-icons/fa";
import { 
    FaCar,
    FaShieldAlt
} from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import { useState, useEffect } from 'react';

export default function set_car(){

    const [data, setData] = useState([]);
    const [selectedCar, setSelectedCar] = useState(null); // สร้าง state สำหรับเก็บข้อมูลของรถที่เลือก


    useEffect(() => {
        fetch('https://bodyworkandpaint.pantook.com/api/datacar')
          .then((response) => response.json())
          .then((data) => {
            setData(data);
          });
      }, []);

    //เลือกข้อมูลข้างแถบด้านข้าง
    const handleRowClick = (Brand, Model, Year) => {
        setSelectedCar({ Brand, Model, Year });
      };

    const handleCancel = () => {
        // เมื่อกดปุ่มยกเลิก ให้ตั้ง isPartSelected เป็น false เพื่อซ่อนปุ่ม
        setSelectedCar(false);
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
                    <div className="max-h-[150px] max-w-[350px] bg-gray-600 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaCar className="my-1 text-9xl text-white group-hover:text-white"/>
                        <strong className="my-1 text-base text-white group-hover:text-white font-semibold">ตั้งค่ารถ</strong>
                        
                    </div>
                    </a>
                    <a href="set_insu">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaShieldAlt className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าบริษัทประกัน</strong>
                        
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
                                        <th scope="col" className="px-6 py-3">รุ่นรถ</th>
                                        <th scope="col" className="px-6 py-3">ปี</th>
                                    </tr>
                                </thead>
                                <tbody>
                                {data.map((car, index) => (
                                    car.Models.map((model, modelIndex) => (
                                         model.Vehicles.map((vehicle, vehicleIndex) => (
                                            <tr 
                                                className='even:bg-white odd:bg-gray-100 border-b dark:border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg'
                                                key={`${index}-${modelIndex}-${vehicleIndex}`}
                                                onClick={() => handleRowClick(car.Brand, model.Model, vehicle.Year)}>
                                                <td className="px-6 pt-2 font-medium text-gray-900 whitespace-nowrap group-hover:text-white">{model.Model}</td>
                                                <td className="px-6 py-5 font-medium text-gray-900 whitespace-nowrap group-hover:text-white">{vehicle.Year}</td>
                                            </tr>
                                        ))
                                    ))
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="max-h-[450px] min-w-[620px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
                        <div className="m-4 gap-32 grid sm:grid-cols-3">
                        {selectedCar ? (
                            <div className="relative flex flex-col my-2 h-[270px] w-[600px]">
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">แบรนด์</span>
                                    <input 
                                    type="text" 
                                    name="Brand" 
                                    value={selectedCar.Brand} 
                                    className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black" 
                                    placeholder=""/>
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">รุ่น</span>
                                    <input 
                                    type="text" 
                                    name="Model" 
                                    value={selectedCar.Model} 
                                    className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black" 
                                    placeholder=""/>
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">ปี</span>
                                    <input 
                                    type="text" 
                                    name="Year" 
                                    value={selectedCar.Year} 
                                    className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black" 
                                    placeholder=""/>
                                </label>
                                <button className="absolute right-5 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    ยืนยัน
                                </button>

                                {/* ปุ่มยกเลิก แสดงก็ต่อเมื่อ isPartSelected เป็น true */}
                                {selectedCar && (
                                    <button
                                        className="absolute right-[100px] bottom-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                        onClick={handleCancel}
                                    >
                                        ยกเลิก
                                    </button>
                                )}
                            </div>
                                ) : (
                                    <div className="relative flex flex-col my-2 h-[270px] w-[600px]">
                                        <label className="max-h-10 w-72 mb-8 justify-center">
                                            <span className="text-base font-semibold">แบรนด์</span>
                                            <input 
                                            type="text" 
                                            name="Brand" 
                                            value={""} 
                                            className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black" 
                                            placeholder=""/>
                                        </label>
                                        <label className="max-h-10 w-72 mb-8 justify-center">
                                            <span className="text-base font-semibold">รุ่น</span>
                                            <input 
                                            type="text" 
                                            name="Model" 
                                            value={""} 
                                            className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black" 
                                            placeholder=""/>
                                        </label>
                                        <label className="max-h-10 w-72 mb-8 justify-center">
                                            <span className="text-base font-semibold">ปี</span>
                                            <input 
                                            type="text" 
                                            name="Year" 
                                            value={""} 
                                            className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black" 
                                            placeholder=""/>
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