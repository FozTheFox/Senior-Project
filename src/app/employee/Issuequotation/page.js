// pages/quotation.js
"use client";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../../ui/Sidebar";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

const PartsPopup = ({ onClose, onSelect, parts, selectedParts }) => {
  const handleSelect = (part) => {
    onSelect(part);
  };

  const isPartSelected = useCallback(
    (partId) => {
      const selected = selectedParts?.some((part) => part.Part_ID === partId);
      return selected;
    },
    [selectedParts]
  );
  return (
    <div className="py-8 fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-start z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg  h-full w-[560px]  pb-28">
        <h2 className="text-lg font-bold mb-4">เลือกอะไหล่</h2>
        <div className="pb-8 h-full overflow-y-auto">
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
                    {part.PricePerUnit}
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

const QuotationPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [selectedLicensePlate, setSelectedLicensePlate] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // สำหรับการค้นหา
  const [printableHTML, setPrintableHTML] = useState("");
  const [selectedQuotation, setSelectedQuotation] = useState(null);

  const [isEditing, setIsEditing] = useState(false); // State สำหรับการแสดงฟอร์มแก้ไข
  const [carData, setCarData] = useState({}); // State สำหรับข้อมูลรถที่จะแก้ไข
  const [dropdownData, setDropdownData] = useState([]); // State สำหรับข้อมูล dropdown ยี่ห้อรถ
  const [selectedBrand, setSelectedBrand] = useState(""); // State สำหรับยี่ห้อรถที่เลือก
  const [selectedModel, setSelectedModel] = useState(""); // State สำหรับรุ่นรถที่เลือก
  const [availableModels, setAvailableModels] = useState([]); // State สำหรับรุ่นรถที่มีให้เลือก
  const [availableYears, setAvailableYears] = useState([]); // State สำหรับปีรถที่มีให้เลือก
  const [insuranceCompanies, setInsuranceCompanies] = useState([]); // State สำหรับข้อมูลบริษัทประกันภัย

  const router = useRouter();

  const [showPopup, setShowPopup] = useState(false); // State to show/hide parts popup
  const [selectedParts, setSelectedParts] = useState([]); // State to store selected parts
  const [parts, setParts] = useState([]);

  useEffect(() => {
    // ตรวจสอบข้อมูลจาก sessionStorage
    const role = sessionStorage.getItem("role");

    if (!role || role !== "รับรถ") {
      router.push("/Loginmain"); // ถ้าไม่ใช่ Admin ให้ไปหน้า login
    }
  }, [router]);

  const fetchQuotations = async () => {
    try {
      const response = await axios.get(
        "https://bodyworkandpaint.pantook.com/api/LatestQuotations"
      );

      // ตรวจสอบว่า response.data.data เป็น array หรือไม่
      if (Array.isArray(response.data.data)) {
        setQuotations(response.data.data);
      } else {
        console.error("Expected an array from the API:", response.data);
        setQuotations([]); // ตั้งค่าเป็น array ว่างในกรณีที่ไม่ใช่ array
      }
    } catch (error) {
      console.error("Error fetching quotations:", error);
      setQuotations([]); // ตั้งค่าเป็น array ว่างเมื่อเกิดข้อผิดพลาด
    }
  };

  useEffect(() => {
    fetchQuotations();
  }, []);

  useEffect(() => {
    if (quotations.length > 0 && selectedLicensePlate) {
      const selected = quotations.find(
        (q) => q.licenseplate === selectedLicensePlate
      );
      console.log("Selected Quotation:", selected); // Debug log
      setSelectedQuotation(selected);
    }
  }, [selectedLicensePlate, quotations]);

  const handleSelectLicensePlate = (licensePlate) => {
    console.log("Selected License Plate:", licensePlate);
    setSelectedLicensePlate(licensePlate);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredQuotations = quotations.filter((quotation) =>
    quotation.licenseplate.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePrintClick = () => {
    const html = `
      <html>
      <head>
        <title>Quotation</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 20px;
          }
          .quotation-header {
            text-align: center;
          }
          .quotation-header h1 {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 0;
          }
          .quotation-header h2 {
            font-size: 22px;
            font-weight: normal;
            margin-top: 5px;
          }
          .customer-info, .car-info, .repair-info {
            margin-top: 20px;
            width: 100%;
            border-collapse: collapse;
          }
          .customer-info td, .car-info td, .repair-info td {
            padding: 8px;
            border-bottom: 1px solid #ccc;
          }
          .customer-info th, .car-info th, .repair-info th {
            text-align: left;
            padding: 8px;
            background-color: #f8f8f8;
            border-bottom: 2px solid #ccc;
          }
          .quotation-summary {
            margin-top: 20px;
            width: 100%;
            text-align: right;
          }
          .quotation-summary p {
            font-size: 16px;
          }
          .footer {
            margin-top: 40px;
            display: flex;
            justify-content: space-between;
          }
          .footer .left, .footer .right {
            width: 45%;
          }
          .left-summary {
            margin-top: 40px;
            text-align: left;
          }
          .left-summary p {
            margin-bottom: 5px;
            font-size: 16px;
          }
          .signature {
            margin-top: 40px;
            text-align: center;
          }
          .licenseplate {
          font-size: 24px;
          }
        </style>
      </head>
      <body>
        <div class="quotation-header">
          <h1>SapPhun Thawi Service</h1>
          <h2>ใบเสนอราคา</h2>
        </div>
        
        <!-- ข้อมูลลูกค้า -->
        <table class="customer-info">
          <tr>
            <th colspan="2">ข้อมูลลูกค้า</th>
          </tr>
          <tr>
            <td><strong>ชื่อลูกค้า:</strong></td>
            <td>${selectedQuotation.customer.FullName}</td>
          </tr>
          <tr>
            <td><strong>เบอร์โทร:</strong></td>
            <td>${selectedQuotation.customer.CustomerPhone}</td>
          </tr>
        </table>
  
        <!-- ข้อมูลรถยนต์ -->
        <table class="car-info">
          <tr>
            <th>ข้อมูลรถยนต์</th>
            <th class="licenseplate">${selectedQuotation.licenseplate}</th>
          </tr>
          <tr>
            <td><strong>ยี่ห้อ:</strong></td>
            <td>${selectedQuotation.Brand}</td>
          </tr>
          <tr>
            <td><strong>รุ่น:</strong></td>
            <td>${selectedQuotation.Model}</td>
          </tr>
          <tr>
            <td><strong>ปี:</strong></td>
            <td>${selectedQuotation.Year}</td>
          </tr>
          <tr>
            <td><strong>ประเมินความเสียหาย:</strong></td>
            <td>${selectedQuotation.damageassessment}</td>
          </tr>
          <tr>
            <td><strong>รายละเอียดปัญหา:</strong></td>
            <td>${selectedQuotation.problemdetails}</td>
          </tr>
        </table>
        
        <!-- ข้อมูลที่ย้ายมาทางด้านซ้ายล่าง -->
        <div class="left-summary">
          <p><strong>ประมาณการค่าซ่อม:</strong> ${
            selectedQuotation.RepairCost
          } บาท</p>
          <p><strong>วันที่เสนอราคา:</strong> ${new Date(
            selectedQuotation.QuotationDate
          ).toLocaleDateString("th-TH")}</p>
          <p><strong>วันที่คาดว่าจะเสร็จ:</strong> ${
            selectedQuotation.completionDate
              ? new Date(selectedQuotation.completionDate).toLocaleDateString(
                  "th-TH"
                )
              : "N/A"
          }</p>
        </div>
  
        <!-- ลายเซ็น -->
        <div class="signature">
          <p><strong>ลายเซ็น:</strong> ________________________</p>
        </div>
      </body>
      </html>
    `;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
  };

  const handleEditClick = async () => {
    if (isEditing) {
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
    try {
      const response = await axios.get(
        `https://bodyworkandpaint.pantook.com/api/quotationsS?LicensePlate=${selectedLicensePlate}`
      );
      if (response.data && response.data.length > 0) {
        const car = response.data[0];
        setCarData({
          licensePlate: car.LicensePlate,
          Customer_IDS: car.Customer.Customer_ID,
          vehicleIdS: car.Vehicle.Vehicle_ID,
          year: car.Vehicle.Year,
          damageAssessment: car.DamageAssessment,
          problemDetails: car.ProblemDetails,
          color: car.color,
          customerName: `${car.Customer.FirstName} ${car.Customer.LastName}`,
          phoneNumber: car.Customer.PhoneNumber,
          insuranceCompany: car.InsuranceCompany.InsuranceCompany || "",
          insuranceCompanyIdS: car.InsuranceCompany.Company_ID,
          completionDate: car.completionDate,
          RepairCost: car.RepairCost,
        });

        // Set dropdown values based on the search results
        setSelectedBrand(car.Vehicle.Brand.Brand);
        setSelectedModel(car.Vehicle.Model);
        setAvailableModels(
          dropdownData.find((item) => item.Brand === car.Vehicle.Brand.Brand)
            ?.Models || []
        );
        setAvailableYears(
          availableModels.find((item) => item.Model === car.Vehicle.Model)
            ?.Vehicles || []
        );
      } else {
        alert("ไม่พบข้อมูล");
      }
    } catch (error) {
      console.error("Error fetching car data:", error);
    }
  };

  const handleSaveCar = async () => {
    console.log("Car Data:", carData);
    try {
      const response = await axios.put(
        `https://bodyworkandpaint.pantook.com/api/quotations/${selectedQuotation.Quotation_ID}`,
        carData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        console.log("Car data updated successfully!");
        setIsEditing(false);
        await fetchQuotations();
      } else {
        console.error("Error updating car data:", response);
      }
    } catch (error) {
      console.error("Error updating car data:", error);
    }
  };

  const handleDeleteQuotation = async (id) => {
    if (window.confirm("คุณแน่ใจหรือไม่ว่าต้องการลบข้อมูลนี้")) {
      try {
        const response = await axios.delete(
          `https://bodyworkandpaint.pantook.com/api/quotations/${id}`
        );
        if (response.status === 200) {
          console.log("Quotation deleted successfully!");
          await fetchQuotations();
        } else {
          console.error("Error deleting quotation:", response);
        }
      } catch (error) {
        console.error("Error deleting quotation:", error);
      }
    }
  };

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

    fetchDropdownData();
  }, []);

  const handleBrandChange = (e) => {
    const brand = e.target.value;
    setSelectedBrand(brand);
    setAvailableModels([]);

    const selectedBrandData = dropdownData.find((item) => item.Brand === brand);
    if (selectedBrandData) {
      setAvailableModels(selectedBrandData.Models);
    }

    setSelectedModel("");
    setAvailableYears([]);
  };

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);

    const selectedModelData = availableModels.find(
      (item) => item.Model === model
    );
    if (selectedModelData) {
      setAvailableYears(selectedModelData.Vehicles);
    }

    setCarData({ ...carData, year: "", vehicleId: "" });
  };

  const handleYearChange = (e) => {
    const year = e.target.value;
    const selectedVehicle = availableYears.find(
      (vehicle) => vehicle.Year === year
    );

    if (selectedVehicle) {
      setCarData({
        ...carData,
        year: year,
        vehicleId: selectedVehicle.Vehicle_ID,
      });
    }
  };

  useEffect(() => {
    const fetchInsuranceCompanies = async () => {
      try {
        const response = await axios.get(
          "https://bodyworkandpaint.pantook.com/api/insurance-companies"
        );
        if (response.data && Array.isArray(response.data.data)) {
          setInsuranceCompanies(response.data.data);
        } else {
          console.error("Expected array but received:", response.data);
          setInsuranceCompanies([]);
        }
      } catch (error) {
        console.error("Error fetching insurance companies:", error);
        setInsuranceCompanies([]);
      }
    };

    fetchInsuranceCompanies();
  }, []);

  const handleInsuranceChange = (e) => {
    const selectedCompanyId = e.target.value;

    const selectedCompany = insuranceCompanies.find(
      (company) => company.Company_ID === parseInt(selectedCompanyId)
    );

    if (selectedCompany) {
      setCarData({
        ...carData,
        insuranceCompany: selectedCompany.Name,
        insuranceCompanyId: selectedCompany.Company_ID,
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCarData({ ...carData, [name]: value });
  };

  const fetchParts = async () => {
    try {
      const response = await axios.get(
        "https://bodyworkandpaint.pantook.com/api/parts"
      );
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
      <Sidebar className="w-80 bg-gray-100 p-4 h-full" />
      <div className="flex-1 pt-10 md:px-20 lg:px-20 xl:px-20">
        <div className="p-2 pl-52">
          <h1 className="text-3xl font-bold mb-4">ใบเสนอราคา</h1>

          <div className="mb-4">
            <input
              type="text"
              placeholder="ค้นหาทะเบียนรถ..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full mb-4 p-2 border rounded-lg"
            />
            <p className="font-light text-gray-600 pb-2">
              *รายการล่าสุดอยู่ด้านบนสุด*
            </p>
            <table className="min-w-full bg-white divide-y divide-gray-200 rounded-lg shadow-md ">
              <thead>
                <tr>
                  <th className="py-2 text-center">เลขทะเบียน</th>
                  <th className="py-2 text-center">ชื่อลูกค้า</th>
                </tr>
              </thead>
              <tbody>
                {filteredQuotations.map((q) => (
                  <tr
                    key={q.Quotation_ID}
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSelectLicensePlate(q.licenseplate)}
                  >
                    <td className="py-2 text-center">{q.licenseplate}</td>
                    <td className="py-2 text-center">{q.customer.FullName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedQuotation && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h2 className="text-2xl font-bold mb-4">ข้อมูลใบเสนอราคา</h2>
              <p>
                <strong>ชื่อลูกค้า:</strong>{" "}
                {selectedQuotation.customer.FullName}
              </p>
              <p>
                <strong>เบอร์โทร:</strong>{" "}
                {selectedQuotation.customer.CustomerPhone}
              </p>
              <p>
                <strong>ยี่ห้อ:</strong> {selectedQuotation.Brand}
              </p>
              <p>
                <strong>รุ่น:</strong> {selectedQuotation.Model}
              </p>
              <p>
                <strong>ปี:</strong> {selectedQuotation.Year}
              </p>
              <p>
                <strong>ประเมินความเสียหาย:</strong>{" "}
                {selectedQuotation.damageassessment}
              </p>
              <p>
                <strong>รายละเอียดปัญหา:</strong>{" "}
                {selectedQuotation.problemdetails}
              </p>
              <p>
                <strong>ประมาณการค่าซ่อม:</strong>{" "}
                {selectedQuotation.RepairCost} บาท
              </p>

              <p>
                <strong>วันที่เสนอราคา:</strong>{" "}
                {new Date(selectedQuotation.QuotationDate).toLocaleDateString(
                  "th-TH"
                )}
              </p>
              {selectedQuotation.completionDate && (
                <p>
                  <strong>วันที่คาดว่าจะเสร็จ:</strong>{" "}
                  {new Date(
                    selectedQuotation.completionDate
                  ).toLocaleDateString("th-TH")}
                </p>
              )}
              <div className="mt-6">
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  onClick={handlePrintClick}
                >
                  Print Click
                </button>
                <button
                  className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={handleEditClick}
                >
                  แก้ไขข้อมูล
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  onClick={() =>
                    handleDeleteQuotation(selectedQuotation.Quotation_ID)
                  }
                >
                  ลบข้อมูล
                </button>
              </div>
            </div>
          )}
          {isEditing && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 ">
              <h1 className="text-2xl font-bold mb-2">แก้ไขข้อมูล</h1>

              {/* ฟอร์มสำหรับกรอกข้อมูลรถ */}
              <div className="grid grid-cols-2 gap-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block">
                      <span className="text-gray-700">เลขทะเบียน</span>
                      <input
                        type="text"
                        name="licensePlate"
                        value={carData.licensePlate || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        placeholder="กรอกเลขทะเบียน"
                      />
                    </label>
                  </div>
                  <div>
                    <label className="block">
                      <span className="text-gray-700">ยี่ห้อรถ</span>
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
                      <span className="text-gray-700">รุ่นรถ</span>
                      <select
                        value={selectedModel}
                        onChange={handleModelChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        disabled={!selectedBrand}
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
                      <span className="text-gray-700">ปีรถ</span>
                      <select
                        value={carData.year || ""}
                        onChange={handleYearChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                        disabled={!selectedModel}
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
                      <span className="text-gray-700">ชื่อลูกค้า</span>
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
                      <span className="text-gray-700">เบอร์โทรลูกค้า</span>
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
                      <span className="text-gray-700">บริษัทประกันภัย</span>
                      <select
                        name="insuranceCompany"
                        value={
                          carData.insuranceCompanyIdS ||
                          carData.insuranceCompanyId
                        }
                        onChange={handleInsuranceChange}
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
                      <span className="text-gray-700">สีของตัวรถ</span>
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
                    <span className="text-gray-700">การประเมินความเสียหาย</span>
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
                    <span className="text-gray-700">รายละเอียดความเสียหาย</span>
                    <textarea
                      name="problemDetails"
                      value={carData.problemDetails || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                      placeholder="กรอกรายละเอียดความเสียหาย"
                    />
                  </label>
                </div>
                <div className="pt-4">
                  <label className="block">
                    <span className="text-gray-700">
                      วันที่ประมาณการซ่อมเสร็จ
                    </span>
                    <input
                      type="date"
                      name="completionDate"
                      value={carData.completionDate || ""}
                      onChange={handleInputChange}
                      className="mt-1 block w-full p-2 border border-gray-300 rounded-lg"
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="pt-4">
                    <label className="block">
                      <span className="text-gray-700 pl-2">
                        ประเมินราคาค่าซ่อม
                      </span>
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

              {showPopup && (
                <PartsPopup
                  onClose={() => setShowPopup(false)}
                  selectedParts={selectedParts}
                  onSelect={handleSelect}
                  parts={parts}
                />
              )}

              {/* ปุ่มบันทึกข้อมูล */}
              <div className="flex justify-center mt-6">
                <button
                  onClick={handleSaveCar}
                  className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
                >
                  แก้ไขข้อมูล
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuotationPage;
