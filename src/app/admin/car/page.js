"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../../ui/Sidebar";
import axios from "axios"; // ใช้ axios เพื่อเรียก API
import { useCallback } from "react";

const PartsPopup = ({ onClose, onSelect, parts, selectedParts }) => {
  const handleSelect = (part) => {
    onSelect(part);
    // onClose();
  };

  const isPartSelected = useCallback(
    (partId) => {
      const selected = selectedParts?.some((part) => part.Part_ID === partId);
      return selected;
    },
    [selectedParts]
  );

  // จัดกลุ่มอะไหล่ตาม CategoryName
  const groupedParts = parts.reduce((acc, part) => {
    if (!acc[part.CategoryName]) {
      acc[part.CategoryName] = [];
    }
    acc[part.CategoryName].push(part);
    return acc;
  }, {});

  return (
    <div className="py-8 fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg h-full w-[560px] pb-28">
        <h2 className="text-lg font-bold mb-4">เลือกอะไหล่</h2>
        <div className="pb-8 h-full overflow-y-auto">
          {Object.entries(groupedParts).map(([categoryName, parts]) => (
            <div key={categoryName} className="mb-4">
              <h3 className="text-md font-semibold mb-2">{categoryName}</h3>
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">ชื่ออะไหล่</th>
                    <th className="py-2 px-4 border-b text-xs">
                      ราคาต่อหน่วย (บาท)
                    </th>
                    <th className="py-2 px-4 border-b">เลือก</th>
                  </tr>
                </thead>
                <tbody>
                  {parts.map((part) => (
                    <tr key={part.Part_ID}>
                      <td className="py-2 px-4 border-b text-center">
                        {part.Name}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        {part.Quantity}
                      </td>
                      <td className="py-2 px-4 border-b text-center">
                        <button
                          onClick={() => handleSelect(part)}
                          className={`px-4 py-2 rounded-lg fixed-width-button ${
                            isPartSelected(part.Part_ID)
                              ? "bg-green-500 text-white"
                              : "bg-blue-500 text-white"
                          }`}
                        >
                          {isPartSelected(part.Part_ID) ? "เลือกแล้ว" : "เลือก"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
        <div className="items-end pb-2">
          <button
            onClick={onClose}
            className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
};

const SelectedParts = ({ selectedParts, onDelete }) => {
  const totalCost = selectedParts.reduce(
    (sum, part) => sum + parseFloat(part.PricePerUnit),
    0
  );

  return (
    <div>
      {selectedParts.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-4">รายการอะไหล่ที่เลือก</h2>

          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">ชื่ออะไหล่</th>
                <th className="py-2 px-4 border-b">ราคาต่อหน่วย (บาท)</th>
                <th className="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {selectedParts.map((part) => (
                <tr key={part.Part_ID} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b text-center">
                    {part.Name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    {part.PricePerUnit}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => onDelete(part.Part_ID)}
                      className="bg-red-500 text-white px-2 py-1 rounded-lg"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default function Car() {
  const [cars, setCars] = useState([]); // เก็บข้อมูลรถทั้งหมด
  const [carData, setCarData] = useState({}); // เก็บข้อมูลของรถที่กำลังเพิ่มหรือแก้ไข
  const [isEditing, setIsEditing] = useState(false); // ตรวจสอบว่ากำลังแก้ไขหรือไม่
  const [searchQuery, setSearchQuery] = useState(""); // สำหรับเก็บค่าการค้นหา
  const [filteredCars, setFilteredCars] = useState([]); // เก็บข้อมูลรถที่ผ่านการกรองสำหรับการค้นหา
  const [repairHistory, setRepairHistory] = useState([]); // เก็บข้อมูลประวัติการซ่อม
  const [selectedCar, setSelectedCar] = useState(null); // รถที่เลือกเพื่อดูประวัติการซ่อม
  const [insuranceCompanies, setInsuranceCompanies] = useState([]); // เก็บข้อมูลบริษัทประกันภัยทั้งหมด
  const [user, setUser] = useState(null);

  const [dropdownData, setDropdownData] = useState([]); // Stores the fetched dropdown data
  const [selectedBrand, setSelectedBrand] = useState(""); // Selected brand
  const [selectedModel, setSelectedModel] = useState(""); // Selected model
  const [availableModels, setAvailableModels] = useState([]); // Models for the selected brand
  const [availableYears, setAvailableYears] = useState([]); // Years for the selected model

  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false); // State to show/hide parts popup
  const [selectedParts, setSelectedParts] = useState([]); // State to store selected parts
  const [parts, setParts] = useState([]);
  useEffect(() => {
    // ตรวจสอบข้อมูลจาก sessionStorage
    const userData = JSON.parse(sessionStorage.getItem("user")); // สมมติว่าข้อมูลผู้ใช้ถูกเก็บใน sessionStorage
    setUser(userData);

    const role = sessionStorage.getItem("role");

    if (!role || role !== "Admin") {
      router.push("/Loginmain"); // ถ้าไม่ใช่ Admin ให้ไปหน้า login
    }
  }, [router]);

  // Fetch car data for dropdowns from external API
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/datacar"
        );
        if (response.data) {
          setDropdownData(response.data);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData(); // Fetch data on component mount
  }, []);

  // Handle brand change
  const handleBrandChange = (e) => {
    const brand = e.target.value;

    setSelectedBrand(brand);
    setAvailableModels([]);

    // Find models for the selected brand
    const selectedBrandData = dropdownData.find((item) => item.Brand === brand);
    if (selectedBrandData) {
      setAvailableModels(selectedBrandData.Models);
    }

    // Reset model and year when brand is changed
    setSelectedModel("");
    setAvailableYears([]);
  };

  // Handle model change
  const handleModelChange = (e) => {
    const model = e.target.value;

    setSelectedModel(model);

    // Find years for the selected model
    const selectedModelData = availableModels.find(
      (item) => item.Model === model
    );
    if (selectedModelData) {
      setAvailableYears(selectedModelData.Vehicles);
    }

    // Reset year when model is changed
    setCarData({ ...carData, year: "", vehicleId: "" }); // Reset year and Vehicle_ID
  };

  // Handle year change
  const handleYearChange = (e) => {
    const year = e.target.value;
    const selectedVehicle = availableYears.find(
      (vehicle) => vehicle.Year === year
    );

    // Update carData with year and Vehicle_ID
    if (selectedVehicle) {
      setCarData({
        ...carData,
        year: year,
        vehicleId: selectedVehicle.Vehicle_ID,
      });
    }
  };

  // ดึงข้อมูลบริษัทประกันภัยจาก API เมื่อ component ถูก mount
  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/insurance-companies"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setInsuranceCompanies(response.data.data); // เข้าถึงข้อมูลภายใน data
        } else {
          console.error("Expected array but received:", response.data);
          setInsuranceCompanies([]); // ตั้งค่าเป็น array ว่างถ้าข้อมูลไม่ใช่ array
        }
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
        setInsuranceCompanies([]); // ตั้งค่าเป็น array ว่างถ้ามี error
      }
    };

    fetchInsuranceCompanies(); // ดึงข้อมูลเมื่อ component ถูก mount
  }, []);

  // ฟังก์ชันสำหรับจัดการเมื่อผู้ใช้เลือกบริษัทประกันภัย
  const handleInsuranceChange = (e) => {
    const selectedCompanyId = e.target.value;

    // ค้นหาบริษัทประกันที่เลือกตาม Company_ID
    const selectedCompany = insuranceCompanies.find(
      (company) => company.Company_ID === parseInt(selectedCompanyId)
    );

    // เก็บค่า Company_ID และชื่อบริษัทใน carData
    if (selectedCompany) {
      setCarData({
        ...carData,
        insuranceCompany: selectedCompany.Name, // เก็บชื่อบริษัท (สำหรับการแสดงผล)
        insuranceCompanyId: selectedCompany.Company_ID, // เก็บ Company_ID สำหรับบันทึก
      });
    }
  };

  // ฟังก์ชันสำหรับจัดการเมื่อมีการเปลี่ยนแปลงข้อมูลในฟอร์ม
  const handleInputChange = (e) => {
    // setCarData({ ...carData, [e.target.name]: e.target.value });
    const { name, value } = e.target; // ดึงชื่อและค่าจาก input field
    setCarData({ ...carData, [name]: value }); // อัปเดตค่า carData ด้วยค่าใหม่
  };

  // ฟังก์ชันสำหรับจัดการเมื่อเปลี่ยนแปลงช่องค้นหา
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // ฟังก์ชันค้นหาข้อมูลรถจาก LicensePlate
  const handleSearch = async () => {
    try {
      // ล้างค่าฟอร์มก่อนใส่ค่าข้อมูลใหม่
      setCarData({
        licensePlate: "",
        vehicleId: "",
        brand: "",
        model: "",
        year: "",
        // damageAssessment: "",
        color: "",
        problemDetails: "",
        customerName: "",
        phoneNumber: "",
        insuranceCompany: "",
        insuranceCompanyId: "",
      });
      const response = await axios.get(
        `https://bodyworkandpaint.pantook.com/api/quotationsS?LicensePlate=${searchQuery}`
      );
      if (response.data && response.data.length > 0) {
        setFilteredCars(response.data);

        const car = response.data[0];

        // Set dropdown values based on the search results
        setSelectedBrand(car.Vehicle.Brand.Brand);
        console.log(car.Vehicle.Brand.Brand);
        setSelectedModel(car.Vehicle.Model);
        console.log(car.Vehicle.Model);
        setCarData({
          licensePlate: car.LicensePlate,
          Customer_IDS: car.Customer.Customer_ID,
          vehicleIdS: car.Vehicle.Vehicle_ID,
          year: car.Vehicle.Year,
          // damageAssessment: car.DamageAssessment,
          problemDetails: car.ProblemDetails,
          color: car.color,
          customerName: `${car.Customer.FirstName} ${car.Customer.LastName}`,
          phoneNumber: car.Customer.PhoneNumber,
          insuranceCompany: car.InsuranceCompany.InsuranceCompany || "",
          insuranceCompanyIdS: car.InsuranceCompany.Company_ID, // เก็บ ID ของบริษัทประกันภัยS
        });

        // Set available models and years based on the brand and model
        const selectedBrandData = dropdownData.find(
          (item) => item.Brand === car.Vehicle.Brand.Brand
        );
        if (selectedBrandData) {
          setAvailableModels(selectedBrandData.Models);
          const selectedModelData = selectedBrandData.Models.find(
            (item) => item.Model === car.Vehicle.Model
          );
          if (selectedModelData) {
            setAvailableYears(selectedModelData.Vehicles);
          }
        }

        setIsEditing(true);
        fetchParts();
      } else {
        alert("ไม่พบข้อมูล");
        setFilteredCars([]); // ล้างตารางถ้าไม่พบข้อมูล
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
      setFilteredCars([]); // ล้างตารางถ้ามีข้อผิดพลาด
    }
  };

  // ฟังก์ชันเพิ่ม/อัปเดตรถใหม่
  const handleSaveCar = async () => {
    try {
      // แยก FirstName และ LastName จาก customerName
      const [firstName, lastName] = carData.customerName.split(" ");

      // ตรวจสอบว่าข้อมูล customerName ถูกต้อง (มีทั้ง FirstName และ LastName)
      if (!firstName || !lastName) {
        alert("กรุณากรอกชื่อและนามสกุลให้ถูกต้อง");
        return;
      }

      const repairDateFormatted = carData.repairDate; // ส่งรูปแบบ YYYY-MM-DD โดยตรง

      // ถ้ามี Customer_ID จากการค้นหาอยู่แล้ว ให้ข้ามการสร้างใหม่
      let customerId;
      if (carData.Customer_IDS) {
        customerId = carData.Customer_IDS;
      } else {
        // ข้อมูลชุดแรก: ส่งข้อมูลลูกค้าไปที่ API เส้นแรกเพื่อบันทึก FirstName, LastName, และ PhoneNumber
        const customerData = {
          FirstName: firstName,
          Lastname: lastName,
          PhoneNumber: carData.phoneNumber,
        };

        // แสดงข้อมูล customerData ใน console
        console.log("Customer Data:", customerData);

        const customerResponse = await axios.post(
          "https://bodyworkandpaint.pantook.com/api/customersstore",
          customerData
        );

        // รับค่า Customer_ID จากการตอบกลับ
        customerId = customerResponse.data.Customer_ID;
      }

      // ข้อมูลชุดที่สอง: ส่งข้อมูลการซ่อมไปที่ API เส้นที่สองพร้อม Customer_ID
      const quotationData = {
        Customer_ID: customerId,
        User_ID: user.User_ID, // ใส่ User_ID จาก carData (ถ้ามี)
        Company_ID: carData.insuranceCompanyIdS || carData.insuranceCompanyId, // ใส่ Company_ID จากการเลือกบริษัทประกัน
        Vehicle_ID: carData.vehicleIdS || carData.vehicleId, // ใส่ Vehicle_ID จากการเลือกปีรถ
        completionDate: repairDateFormatted, // ใส่วันที่
        color: carData.color, // ใส่สี (ถ้าจำเป็น)
        damageassessment: carData.damageAssessment,
        licenseplate: carData.licensePlate, // ใส่เลขทะเบียน
        problemdetails: carData.damageDetails, // ใส่รายละเอียดปัญหา
        RepairCost: carData.RepairCost.toString(),
      };

      // แสดงข้อมูล quotationData ใน console
      console.log("Quotation Data:", quotationData);

      const quotationResponse = await axios.post(
        "https://bodyworkandpaint.pantook.com/api/quotations-insert",
        quotationData
      );

      // บันทึกสำเร็จ อัปเดต state และล้างข้อมูลฟอร์ม
      setCars([...cars, quotationResponse.data]);
      setCarData({});
      setSelectedParts([]);
      setSelectedBrand("");
      setSelectedModel("");
      setInsuranceCompanies([]);
      setIsEditing(false);

      alert("บันทึกข้อมูลสำเร็จ");
    } catch (error) {
      console.error("Error saving car:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  // ฟังก์ชันสำหรับดูประวัติการซ่อมของรถ
  const handleShowRepairHistory = async (registration) => {
    try {
      const response = await axios.get(
        `/api/cars/${registration}/repair-history`
      ); // เรียก API ดึงประวัติการซ่อม
      setRepairHistory(response.data); // เก็บข้อมูลประวัติการซ่อม
      setSelectedCar(registration); // ตั้งค่าให้รู้ว่ากำลังดูประวัติการซ่อมของรถคันไหน
    } catch (error) {
      console.error("Error fetching repair history:", error);
    }
  };

  // ฟังก์ชันสำหรับแก้ไขข้อมูลรถ
  const handleEditCar = (registration) => {
    const carToEdit = cars.find((car) => car.registration === registration);
    setCarData(carToEdit); // กรอกข้อมูลรถที่เลือกลงในฟอร์ม
    setIsEditing(true); // เปลี่ยนสถานะเป็นการแก้ไข
  };

  // ฟังก์ชันสำหรับแสดงข้อมูลรถทั้งหมดหรือรถที่ค้นหา
  const renderCarsTable = () => {
    if (filteredCars.length === 0) {
      return <p>ไม่พบข้อมูลที่ค้นหา</p>;
    }

    return (
      <div>
        <p className="text-gray-600 mb-4">
          หมายเหตุ: รายการล่าสุดอยู่ด้านบนสุด
        </p>
        <table className="table-auto w-full mt-6">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-2 py-2">เลขทะเบียน</th>
              <th className="px-2 py-2">ยี่ห้อ</th>
              <th className="px-2 py-2">รุ่น</th>
              <th className="px-2 py-2">ปีรถ</th>
              <th className="px-2 py-2">วันที่รับซ่อม</th>
              <th className="px-2 py-2">สถานะการซ่อม</th>
            </tr>
          </thead>
          <tbody>
            {filteredCars.map((car, index) => (
              <>
                <tr key={index}>
                  <td className="px-2 py-2 text-center">{car.LicensePlate}</td>
                  <td className="px-2 py-2 text-center">
                    {car.Vehicle.Brand.Brand}
                  </td>
                  <td className="px-2 py-2 text-center">{car.Vehicle.Model}</td>
                  <td className="px-2 py-2 text-center">{car.Vehicle.Year}</td>
                  <td className="px-2 py-2 text-center">{car.QuotationDate}</td>
                  <td className="px-2 py-2 text-center">
                    {car.Status === "In Progress" && "อยู่ระหว่างการซ่อม"}
                    {car.Status === "Completed" && "ซ่อมเสร็จแล้ว"}
                    {car.Status === "Pending" && "รอดำเนินการ"}
                    {car.Status === "PaymentCompleted" && "ซ่อมเสร็จแล้ว"}
                    {!["In Progress", "Completed", "Pending", "PaymentCompleted"].includes(
                      car.Status
                    ) && "สถานะไม่ทราบ"}
                  </td>
                </tr>
                <tr>
                  <td colSpan="6" className=" pb-2  bg-gray-100 border-b">
                    <p>รายละเอียดปัญหา: {car.ProblemDetails}</p>
                  </td>
                </tr>
              </>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const fetchParts = async () => {
    try {
      const response = await axios.get(
        "https://bodyworkandpaint.pantook.com/api/partsAdmin"
      );
      //   setParts(response.data.data);
      const filteredParts = response.data.data.filter((part) => {
        return (
          part.Brand === selectedBrand &&
          part.Model === selectedModel &&
          part.Year === carData.year
        );
      });
      setParts(filteredParts);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSelect = (part) => {
    const newSelectedParts = [...selectedParts];
    const totalCost = [...selectedParts, part].reduce(
      (sum, part) => sum + parseFloat(part.PricePerUnit),
      0
    );
    setCarData((prevCarData) => ({ ...prevCarData, RepairCost: totalCost }));
    const index = newSelectedParts.findIndex((p) => p.Part_ID === part.Part_ID);
    if (index !== -1) {
      newSelectedParts.splice(index, 1);
    } else {
      newSelectedParts.push(part);
    }
    setSelectedParts(newSelectedParts);
    // setCarData((prevCarData) => ({ ...prevCarData, RepairCost: totalCost }));
  };

  const handleDeletePart = (partId) => {
    setSelectedParts(selectedParts.filter((part) => part.Part_ID !== partId));

    const totalCost = selectedParts
      .filter((part) => part.Part_ID !== partId)
      .reduce((sum, part) => sum + parseFloat(part.PricePerUnit), 0);
    setCarData((prevCarData) => ({ ...prevCarData, RepairCost: totalCost }));
  };

  const handleShowPopup = () => {
    if (selectedBrand && selectedModel && carData.year) {
      fetchParts();
    }
    setShowPopup(true);
  };

  return (
    <div className="flex h-screen">
      {showPopup && (
        <PartsPopup
          onClose={() => setShowPopup(false)}
          selectedParts={selectedParts}
          onSelect={handleSelect}
          parts={parts}
        />
      )}
      <Sidebar className="w-80 bg-gray-100 p-4 h-full" />
      <div className="flex-1 pt-10 md:px-20 lg:px-20 xl:px-20">
        <div className="pl-52 pb-10">
          <h1 className="text-3xl font-bold mb-4">รับรถเข้าซ่อม</h1>

          {/* ช่องค้นหาด้วยเลขทะเบียน */}
          <div className="mb-4 flex items-center">
            <input
              type="text"
              name="searchQuery"
              value={searchQuery}
              // onChange={handleSearchChange}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาด้วยเลขทะเบียน (เช่น กด6199ยโสธร)"
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
            <button
              onClick={handleSearch}
              className="ml-2 bg-blue-600 text-white p-2 rounded-lg"
            >
              ค้นหา
            </button>
          </div>

          {/* ฟอร์มสำหรับกรอกข้อมูลรถ */}
          <div className="grid grid-cols-2 gap-6">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">เลขทะเบียน</span>
                  <input
                    type="text"
                    name="licensePlate"
                    value={carData.licensePlate || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="กรอกเลขทะเบียน"
                    // disabled={false}
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">ยี่ห้อรถ</span>
                  <select
                    value={selectedBrand}
                    onChange={handleBrandChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">เลือกยี่ห้อรถ</option>
                    {dropdownData.map((brand) => (
                      <option key={brand.Brand_ID} value={brand.Brand}>
                        {brand.Brand}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              {/* Dropdown for car model */}
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">รุ่นรถ</span>
                  <select
                    value={selectedModel}
                    onChange={handleModelChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    disabled={!selectedBrand} // Disable if no brand is selected
                  >
                    <option value="">เลือกรุ่นรถ</option>
                    {availableModels.map((model) => (
                      <option key={model.Model} value={model.Model}>
                        {model.Model}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* Dropdown for car year */}
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">ปีรถ</span>
                  <select
                    value={carData.year || ""}
                    onChange={handleYearChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    disabled={!selectedModel} // Disable if no model is selected
                  >
                    <option value="">เลือกปีรถ</option>
                    {availableYears.map((vehicle) => (
                      <option key={vehicle.Vehicle_ID} value={vehicle.Year}>
                        {vehicle.Year}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">ชื่อลูกค้า</span>
                  <input
                    type="text"
                    name="customerName"
                    value={carData.customerName || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="กรอกชื่อลูกค้า"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">เบอร์โทรลูกค้า</span>
                  <input
                    type="text"
                    name="phoneNumber"
                    value={carData.phoneNumber || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="กรอกเบอร์โทรลูกค้า"
                  />
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">บริษัทประกันภัย</span>
                  <select
                    name="insuranceCompany"
                    value={
                      carData.insuranceCompanyIdS || carData.insuranceCompanyId
                    } // ใช้ insuranceCompanyId สำหรับการเลือก
                    onChange={handleInsuranceChange} // ใช้ฟังก์ชัน handleInsuranceChange
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="">เลือกบริษัทประกันภัย</option>
                    {insuranceCompanies.length > 0 ? (
                      insuranceCompanies.map((company) => (
                        <option
                          key={company.Company_ID}
                          value={company.Company_ID}
                        >
                          {company.Name}
                        </option>
                      ))
                    ) : (
                      <option value="">ไม่มีข้อมูลบริษัทประกันภัย</option>
                    )}
                  </select>
                </label>
              </div>
              <div>
                <label className="block">
                  <span className="text-gray-700 pl-2">สีของตัวรถ</span>
                  <input
                    type="text"
                    name="color"
                    value={carData.color || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="สีของตัวรถ"
                  />
                </label>
              </div>
            </div>
          </div>
          <div>
            <div className="pt-4">
              <label className="block">
                <span className="text-gray-700 pl-2">
                  การประเมินความเสียหาย
                </span>
                <select
                  name="damageAssessment"
                  value={carData.damageAssessment || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="">เลือกการประเมินความเสียหาย</option>
                  <option value="ต่ำ">ต่ำ</option>
                  <option value="ปานกลาง">ปานกลาง</option>
                  <option value="สูง">สูง</option>
                </select>
              </label>
            </div>

            <div className="col-span-2 pt-4">
              <label className="block">
                <span className="text-gray-700 pl-2">
                  รายละเอียดความเสียหาย
                </span>
                <textarea
                  name="damageDetails"
                  value={carData.damageDetails || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="กรอกรายละเอียดความเสียหาย"
                />
              </label>
            </div>
            <div className="pt-4">
              <label className="block">
                <span className="text-gray-700 pl-2">
                  วันที่ประมาณการซ่อมเสร็จ
                </span>
                <input
                  type="date"
                  name="repairDate"
                  value={carData.repairDate || ""}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                />
              </label>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="pt-4">
                <label className="block">
                  <span className="text-gray-700 pl-2">ประเมินราคาค่าซ่อม</span>
                  <input
                    type="number"
                    name="RepairCost"
                    value={carData.RepairCost || ""}
                    onChange={handleInputChange}
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="กรอกค่าซ่อมโดยประมาณ (บาท)"
                  />
                </label>
              </div>
              <div className="pt-11">
                <button
                  onClick={handleShowPopup}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg"
                >
                  เลือกอะไหล่
                </button>
              </div>
            </div>

            <div className="pt-4">
              <SelectedParts
                selectedParts={selectedParts}
                onDelete={handleDeletePart}
              />
            </div>
          </div>
          {/* {showPopup && (
              <PartsPopup
                onClose={() => setShowPopup(false)}
                onSelect={handleSelectPart}
                parts={parts}
              />
            )} */}

          {/* ปุ่มบันทึกข้อมูล */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSaveCar}
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
            >
              บันทึกข้อมูล
            </button>
          </div>

          {/* ตารางแสดงข้อมูลรถ */}
          <div className="mt-10 mb-10">
            <h2 className="text-xl font-semibold">ประวัติการซ่อม</h2>
            {renderCarsTable()}
          </div>
        </div>
      </div>
    </div>
  );
}
