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

export default function set_part(){
    const [categories, setCategories] = useState([]);
    const [openCategoryId, setOpenCategoryId] = useState(null); // เก็บสถานะการเปิดของแต่ละ Category_ID
    const [isPartSelected, setIsPartSelected] = useState(false); // เก็บสถานะการเลือก Part
    const [selectedPart, setSelectedPart] = useState({
        Category_ID: '',
        Vehicle_ID: '',
        Brand: '',
        Model: '',
        Year: '',
        Name: '',
        Description: '',
        Quantity: '',
        PricePerUnit: ''
    });


    useEffect(() => {
        async function fetchParts() {
            try {
                const response = await axios.get('https://bodyworkandpaint.pantook.com/api/parts');
                const data = response.data.data;

                // จัดกลุ่มข้อมูลตาม Category_ID
                const groupedByCategory = data.reduce((acc, part) => {
                    const categoryExists = acc.find(item => item.Category_ID === part.Category_ID);
                    if (categoryExists) {
                        categoryExists.parts.push(part);
                    } else {
                        acc.push({
                            Category_ID: part.Category_ID,
                            Category_Name: part.Category_Name,
                            parts: [part]
                        });
                    }
                    return acc;
                }, []);

                setCategories(groupedByCategory);
            } catch (err) {
                console.error('Error fetching parts data:', err);
            }
        }

        fetchParts(); // ดึงข้อมูลเมื่อ component ถูก mount
    }, []);

    const toggleCategory = (categoryId) => {
        // เปิดหรือปิดกล่องของ Category_ID ที่คลิก
        if (openCategoryId === categoryId) {
            setOpenCategoryId(null); // ปิดถ้าเปิดอยู่
        } else {
            setOpenCategoryId(categoryId); // เปิดถ้าปิดอยู่
        }
    };

    const handlePartSelect = (part) => {
        setSelectedPart(part); // เก็บข้อมูล Part ที่ถูกเลือก
        setOpenCategoryId(null); // ปิดกล่อง Part_ID เมื่อเลือกแล้ว
        setIsPartSelected(true); // เมื่อเลือก Part ให้ตั้ง isPartSelected เป็น true เพื่อแสดงปุ่มยกเลิก
    };

    const handleCancel = () => {
        // เมื่อกดปุ่มยกเลิก ให้ตั้ง isPartSelected เป็น false เพื่อซ่อนปุ่ม
        setIsPartSelected(false);
        // รีเซ็ตค่าหรือทำการยกเลิกการเลือก Part ที่นี่
        setSelectedPart({
            Category_ID: '',
            Vehicle_ID: '',
            Brand: '',
            Model: '',
            Year: '',
            Name: '',
            Description: '',
            Quantity: '',
            PricePerUnit: ''
        });
    };

    const handlePartChange = (e) => {
        const part = parts.find(p => p.Part_ID === parseInt(e.target.value));
        if (part) {
            setSelectedPart({
                Category_ID: part.Category_ID,
                Vehicle_ID: part.Vehicle_ID,
                Brand: part.Brand,
                Model: part.Model,
                Year: part.Year,
                Name: part.Name,
                Description: part.Description,
                Quantity: part.Quantity,
                PricePerUnit: part.PricePerUnit
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSelectedPart({
            ...selectedPart,
            [name]: value, // อัปเดต field ที่แก้ไข
        });
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
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaShieldAlt className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าบริษัทประกัน</strong>
                        
                    </div>
                    </a>
                    <a href="set_part">
                    <div className="max-h-[150px] max-w-[350px] bg-gray-600 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaScrewdriverWrench className="my-1 text-9xl text-white group-hover:text-white"/>
                        <strong className="my-1 text-base text-white group-hover:text-white font-semibold">ตั้งค่าอะไหล่</strong>
                        
                    </div>
                    </a>
                </div>
                <div className="mb-6 gap-80 grid sm:grid-cols-12">
                    <div className="w-72 h-[680px] overflow-y-scroll bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
                        <div className="my-4 border-b border-gray-100 pb-4 items-center justify-center">
                            <h1 className="text-black rounded-xl uppercase bg-white border-b border-gray-200 pl-5 pb-3 font-bold">อะไหล่</h1>
                            {categories.map((category) => (
                                <div key={category.Category_ID} className="">
                                    {/* กล่อง Category_ID */}
                                    <div
                                        className="sticky top-0 bg-white border-b dark:border-gray-200 hover:text-white hover:bg-gray-900 p-5 rounded-md group cursor-pointer hover:shadow-lg"
                                        onClick={() => toggleCategory(category.Category_ID)}
                                    >
                                        {category.Category_Name} (หมวดหมู่อะไหล่ที่ : {category.Category_ID})
                                    </div>

                                    {/* ถ้า Category_ID นี้เปิดอยู่ ให้แสดงกล่อง Part_ID */}
                                    {openCategoryId === category.Category_ID && (
                                        <div>
                                            {category.parts.map((part) => (
                                                <div
                                                    key={part.Part_ID}
                                                    className="even:bg-white odd:bg-gray-100 border-b dark:border-gray-200 hover:text-white hover:bg-gray-900 p-3 rounded-md group cursor-pointer hover:shadow-lg text-end justify-end"
                                                    onClick={() => handlePartSelect(part)}
                                                >
                                                    {part.Name} (Part_ID: {part.Part_ID})
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="h-[720px] w-[620px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
                        <div className="m-4 gap-32 grid sm:grid-cols-3">
                            <div className="relative flex flex-col my-2 h-[680px] w-[600px]">
                                <label className="block mb-2">
                                    <span className="text-base font-semibold">รหัส Category (Category_ID)</span>
                                    <input
                                        type="text"
                                        name="Category_ID" // ชื่อต้องตรงกับฟิลด์ใน state
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Category_ID || ''}
                                        onChange={handleChange} // อัปเดตเมื่อมีการเปลี่ยนแปลง
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">รหัส Vehicle (Vehicle_ID)</span>
                                    <input
                                        type="text"
                                        name="Vehicle_ID"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Vehicle_ID || ''}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">ยี่ห้อ (Brand)</span>
                                    <input
                                        type="text"
                                        name="Brand"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Brand || ''}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">รุ่น (Model)</span>
                                    <input
                                        type="text"
                                        name="Model"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Model || ''}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">ปี (Year)</span>
                                    <input
                                        type="text"
                                        name="Year"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Year || ''}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">ชื่ออะไหล่ (Name)</span>
                                    <input
                                        type="text"
                                        name="Name"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Name || ''}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">คำอธิบาย (Description)</span>
                                    <input
                                        type="text"
                                        name="Description"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Description || ''}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">จำนวน (Quantity)</span>
                                    <input
                                        type="text"
                                        name="Quantity"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.Quantity || ''}
                                        onChange={handleChange}
                                    />
                                </label>

                                <label className="block mb-2">
                                    <span className="text-base font-semibold">ราคาต่อหน่วย (PricePerUnit)</span>
                                    <input
                                        type="text"
                                        name="PricePerUnit"
                                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-gray-700"
                                        value={selectedPart?.PricePerUnit || ''}
                                        onChange={handleChange}
                                    />
                                </label>
                                <button className="absolute right-5 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                                    ยืนยัน
                                </button>

                                {/* ปุ่มยกเลิก แสดงก็ต่อเมื่อ isPartSelected เป็น true */}
                                {isPartSelected && (
                                    <button
                                        className="absolute right-[100px] bottom-0   bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                        onClick={handleCancel}
                                    >
                                        ยกเลิก
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}