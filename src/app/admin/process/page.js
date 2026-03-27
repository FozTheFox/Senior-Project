"use client";
import { useState, useEffect } from "react";
import Sidebar from "../../ui/Sidebar";
import {
  FaPenToSquare,
  FaCar,
  FaUser,
  FaPhone,
  FaCalendarAlt,
  FaShieldAlt,
  FaWrench,
} from "react-icons/fa"; // เพิ่มไอคอน
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Car() {
  const [carData, setCarData] = useState({}); // เก็บข้อมูลของรถที่ดึงมาและกำลังแก้ไข
  const [progress, setProgress] = useState(0); // เก็บค่าเปอร์เซ็นต์ของความคืบหน้า
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // เพิ่ม state สำหรับข้อมูลที่กรองแล้ว
  const [searchTerm, setSearchTerm] = useState(""); // เพิ่ม state สำหรับเก็บคำค้นหา
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null); // สร้าง state สำหรับเก็บข้อมูลของรถที่เลือก
  const [isOpen, setIsOpen] = useState(false); // ควบคุมการเปิด/ปิด popup
  const [isAdding, setIsAdding] = useState(false); // ควบคุมสถานะการเพิ่มกระบวนการซ่อม
  const [selectedQuotation, setSelectedQuotation] = useState("");

  const router = useRouter();

  useEffect(() => {
    // ตรวจสอบข้อมูลจาก sessionStorage
    const role = sessionStorage.getItem("role");

    if (!role || role !== "Admin") {
      router.push("/Loginmain"); // ถ้าไม่ใช่ Admin ให้ไปหน้า login
    }
  }, [router]);

  // ดึงข้อมูลจาก API `quotationsInProgress`
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/quotationsInProweb"
        );
        const allCars = response.data.data;
        const car = allCars[0]; // เอารถคันแรกมาใช้ในตัวอย่าง

        setCarData({
          registration: car.licenseplate || "",
          province: car.province || "",
          brand: car.Brand || "",
          model: car.Model || "",
          year: car.Year || "",
          customerName: car.customer.FullName || "",
          phoneNumber: car.customer.CustomerPhone || "",
          insuranceCompany: car.company.Name || "",
          repairDate: car.QuotationDate || "",
          completionDate: car.completionDate || "",
          damageDetails: car.problemdetails || "",
        });

        // ตั้งค่า data สำหรับแสดงรถทั้งหมดในตาราง
        setData(allCars);
        setFilteredData(allCars); // ตั้งค่า filteredData ให้เท่ากับ data ทั้งหมดในตอนเริ่มต้น
      } catch (error) {
        setError("Error fetching data");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ฟังก์ชันสำหรับจัดการการเปลี่ยนแปลงในช่องค้นหา
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value === "") {
      setFilteredData(data); // ถ้าไม่มีข้อความค้นหา ให้แสดงข้อมูลทั้งหมด
    } else {
      // กรองข้อมูลที่ตรงกับคำค้นหา
      const filtered = data.filter(
        (car) =>
          car.licenseplate.includes(value) ||
          car.customer.FullName.includes(value)
      );
      setFilteredData(filtered);
    }
  };

  // เปิดหรือปิด popup
  const togglePopup = () => {
    setIsOpen(!isOpen);
  };

  // popup หน้าเพิ่มข้อมูลกระซ่อม
  const handleAddButtonClick = () => {
    setIsAdding(true);
  };

  // popup กลับไปหน้ารวมขั้นตอนซ่อม
  const handleBackButtonClick = () => {
    setIsAdding(false);
  };

  // หลอดเปอร์เซ็น
  const calculateProgress = (repairProcesses) => {
    const totalSteps = repairProcesses.length;
    const completedSteps = repairProcesses.filter(
      (process) => process.Status === "Completed"
    ).length;
    const progressPercent = (completedSteps / totalSteps) * 100;
    setProgress(progressPercent.toFixed(0)); // เปลี่ยนเป็นเลขจำนวนเต็ม
  };

  useEffect(() => {
    if (selectedCar && selectedCar.repair_processes) {
      calculateProgress(selectedCar.repair_processes);
    }
  }, [selectedCar]);

  //เลือกข้อมูลข้างแถบด้านข้าง
  const handleRowClick = (licenseplate) => {
    // กรองข้อมูลจากชุดข้อมูลที่ดึงมาแล้วแทนที่จะเรียก API ใหม่
    const selected = data.find((item) => item.licenseplate === licenseplate);
    setSelectedCar(selected);
  };

  // กล่องเปลี่ยนสี
  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-200";
      case "In Progress":
        return "bg-yellow-200";
      case "verification":
        return "bg-red-200";
      default:
        return "bg-gray-200";
    }
  };

  // จัดการการเปลี่ยนแปลงใน input field
  const handleInputChange = (e) => {
    setCarData({ ...carData, [e.target.name]: e.target.value });
  };

  // Handle Quotation change
  const handleQuotationChange = (event) => {
    setSelectedQuotation(event.target.value);
  };

  return (
    <div>
      <Sidebar />
      <div className="p-5 md:p-10 pl-0 md:pl-72">
        <div>
          <label className="text-2xl md:text-4xl font-semibold mb-2 flex items-center">
            กระบวนการซ่อม
          </label>
        </div>
        {/* เลือกทะเบียนรถ */}
        <div className="my-2 border-b border-gray-100 pb-4">
          <label className=" text-lg font-semibold mb-2 flex items-center">
            <FaCar className="mr-2 text-blue-500" /> {/* เพิ่มไอคอน */}
            เลือกทะเบียนรถ
          </label>
          {/* ช่องค้นหา */}
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="ค้นหาทะเบียนรถหรือชื่อลูกค้า"
            className="block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 mb-4"
          />
          <select
            className="block w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
            value={selectedCar?.Quotation_ID}
            onChange={(e) => handleRowClick(e.target.value)}
          >
            <option value="">เลือกทะเบียนรถ</option>
            {filteredData.map((item) => (
              <option key={item.Quotation_ID} value={item.licenseplate}>
                {item.licenseplate}
              </option>
            ))}
          </select>
        </div>

        {/* รถที่กำลังซ่อม */}
        <div className="mb-6 gap-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1">
          {/* รายละเอียดรถและกระบวนการซ่อม */}
          {selectedCar ? (
            <div className="min-h-[550px] flex flex-col">
              <div className="bg-gray-200 border rounded-lg shadow-lg ring-1 ring-black/5 p-2">
                <div className="text-base text-black font-semibold flex items-center">
                  <h1 className="text-base text-black font-semibold flex items-center">
                    <FaCar className="mr-2 text-blue-500" /> {/* เพิ่มไอคอน */}
                    รายละเอียดการซ่อมสำหรับ {selectedCar.Model} ( ทะเบียน{" "}
                    {selectedCar.licenseplate})
                  </h1>
                </div>
              </div>

              <div className="min-h-[200px] bg-white shadow-lg ring-1 ring-black/5 flex flex-col p-3 border rounded-lg">
                <div className="grid md:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaUser className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      ชื่อ-สกุล ลูกค้า
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.customer.FullName}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaPhone className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      เบอร์โทรลูกค้า
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.customer.CustomerPhone}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      วันที่รับรถเข้าซ่อม
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.QuotationDate}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaCar className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      แบรนด์รถ
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.Brand}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaCar className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      รุ่นรถ
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.Model}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaShieldAlt className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      บริษัทประกัน
                    </strong>
                    <span className="md:text-sm mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.company.Name}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaCar className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      สีรถ
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.color}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaCar className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      ความเสียหาย
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.damageassessment}
                    </span>
                  </div>
                  <div>
                    <strong className="text-base text-black font-semibold flex items-center">
                      <FaCalendarAlt className="mr-2 text-blue-500" />{" "}
                      {/* เพิ่มไอคอน */}
                      ประมาณการวันเสร็จสิ้น
                    </strong>
                    <span className="mb-4 px-6 text-base text-gray-700 font-semibold">
                      {selectedCar.completionDate}
                    </span>
                  </div>
                </div>
              </div>

              {/* เส้นแสดงความคืบหน้า */}
              <div className="my-4">
                <div className="w-full bg-gray-300 rounded-full h-4">
                  <div
                    className="bg-green-500 h-4 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-600 mt-1">
                  {progress}% ดำเนินการแล้ว
                </p>
              </div>

              <div className="bg-gray-100 shadow-lg ring-1 ring-black/5 mt-2 border rounded-lg p-5">
                <div className="flex justify-start items-center gap-4 px-5 p-5">
                  <h1 className="text-base text-black font-semibold flex items-center">
                    <FaWrench className="mr-2 text-blue-500" />{" "}
                    {/* เพิ่มไอคอน */}
                    รายละเอียดกระบวนการซ่อม
                  </h1>
                </div>

                <div className="px-5 py-5 space-x-10 flex overflow-x-auto whitespace-nowrap">
                  {selectedCar.repair_processes.map((process) => (
                    <div
                      key={process.Process_ID}
                      className={`w-full max-w-[250px] shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col px-5 p-2 ${getStatusColor(
                        process.Status
                      )}`}
                    >
                      <strong className="my-1 text-base text-black font-semibold">
                        ขั้นตอน : {process.StepName}
                      </strong>
                      <strong className="my-1 text-base text-black font-semibold">
                        สถานะ : {process.Status}
                      </strong>
                      <strong className="my-1 text-base text-black font-semibold">
                        รายละเอียด :
                      </strong>
                      <div className="text-gray-700 mt-2">
                        {process.Description &&
                        process.Description.length > 10 ? (
                          <>
                            <span className="block whitespace-pre-wrap">
                              {process.Description.substring(0, 100)}...
                            </span>
                            <button
                              className="text-blue-500"
                              onClick={() => alert(process.Description)}
                            >
                              แสดงทั้งหมด
                            </button>
                          </>
                        ) : (
                          <span className="block whitespace-pre-wrap">
                            {process.Description || "ไม่มีรายละเอียด"}
                          </span>
                        )}
                      </div>
                      
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center items-center h-screen">
              <p className="text-lg text-gray-600">
                เลือกทะเบียนรถเพื่อดูรายละเอียด
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
