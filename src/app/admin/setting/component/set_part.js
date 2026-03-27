"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SetPart() {
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [brands, setBrands] = useState([]);
  const [models, setModels] = useState([]);
  const [years, setYears] = useState([]);
  const [parts, setParts] = useState([]);
  const [showEngineParts, setShowEngineParts] = useState(false);
  const [showBrakeParts, setShowBrakeParts] = useState(false);
  const [showElectricalParts, setShowElectricalParts] = useState(false);
  const [showBodyParts, setShowBodyParts] = useState(false);
  const [showTransmissionParts, setShowTransmissionParts] = useState(false);
  const [editPart, setEditPart] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newParts, setNewParts] = useState([]);
  const [vehicleData, setVehicleData] = useState([]);
  const [vehicleID, setVehicleID] = useState(null);
  const [categoryID, setCategoryID] = useState(null);
  const [partName, setPartName] = useState("");
  const [partDescription, setPartDescription] = useState("");
  const [partPricePerUnit, setPartPricePerUnit] = useState("");
  const [partQuantity, setPartQuantity] = useState("");

  // ฟังก์ชันสำหรับเพิ่มรายการอะไหล่
  const handleAddPart = async () => {
    try {
      const response = await axios.post(
        "https://bodyworkandpaint.pantook.com/api/parts-store",
        {
          Vehicle_ID: vehicleID,
          Category_ID: categoryID,
          Name: partName,
          Description: partDescription,
          PricePerUnit: partPricePerUnit,
          Quantity: partQuantity,
        }
      );
      console.log(response.data);
      // อัปเดตข้อมูลอะไหล่หลังจากเพิ่ม
      // setShowAddModal(false);
      fetchParts();
      setNewParts([]);
      setPartName("");
      setPartDescription("");
      setPartPricePerUnit("");
      setPartQuantity("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditPart = (part) => {
    setEditPart(part);
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `https://bodyworkandpaint.pantook.com/api/updatepart/${editPart.Part_ID}`,
        {
          // ส่งค่าอะไหล่ที่ต้องการแก้ไข
          Name: editPart.Name,
          Description: editPart.Description,
          PricePerUnit: editPart.PricePerUnit,
          Quantity: editPart.Quantity,
        }
      );
      console.log(response.data);
      // อัปเดตข้อมูลอะไหล่หลังจากแก้ไข
      fetchParts();
      setShowEditModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchParts();
  }, []);

  const fetchParts = async () => {
    const response = await axios.get(
      "https://bodyworkandpaint.pantook.com/api/parts"
    );

    // Filter distinct values for brand, model, and year
    const brands = [...new Set(response.data.data.map((part) => part.Brand))];
    setBrands(brands);

    if (brand) {
      const filteredModels = [
        ...new Set(
          response.data.data
            .filter((part) => part.Brand === brand)
            .map((part) => part.Model)
        ),
      ];
      setModels(filteredModels);
    }

    if (brand && model) {
      const filteredYears = [
        ...new Set(
          response.data.data
            .filter((part) => part.Brand === brand && part.Model === model)
            .map((part) => part.Year)
        ),
      ];
      setYears(filteredYears);
    }

    const filteredParts = response.data.data.filter(
      (part) =>
        part.Brand === brand && part.Model === model && part.Year === year
    );
    setParts(filteredParts);
  };

  // Update models and years when brand or model changes
  useEffect(() => {
    if (brand) {
      fetchParts();
    }
  }, [brand]);

  useEffect(() => {
    if (brand && model) {
      fetchParts();
    }
  }, [model, year]);

  useEffect(() => {
    axios.get("https://bodyworkandpaint.pantook.com/api/datacar")
      .then(response => {
        setVehicleData(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div className="bg-white mx-auto p-4 rounded-xl">
      {/* เลือกรถ */}
      <div className="flex flex-col md:flex-row space-x-4 mb-4">
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">แบรนด์</label>
          <select
            value={brand}
            onChange={(e) => {
              setBrand(e.target.value);
              setModel(""); // Reset model when brand changes
              setYear(""); // Reset year when brand changes
            }}
            className="w-full p-2 border rounded"
          >
            <option value="">เลือกแบรนด์</option>
            {brands.map((brandOption, index) => (
              <option key={index} value={brandOption}>
                {brandOption}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">รุ่น</label>
          <select
            value={model}
            onChange={(e) => {
              setModel(e.target.value);
              setYear(""); // Reset year when model changes
            }}
            className="w-full p-2 border rounded"
            disabled={!brand} // Disable until brand is selected
          >
            <option value="">เลือกรุ่น</option>
            {models.map((modelOption, index) => (
              <option key={index} value={modelOption}>
                {modelOption}
              </option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block mb-2 text-sm font-medium">ปี</label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full p-2 border rounded"
            disabled={!model} // Disable until model is selected
          >
            <option value="">เลือกปี</option>
            {years.map((yearOption, index) => (
              <option key={index} value={yearOption}>
                {yearOption}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Button to add parts */}
      <button
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 mb-4"
        onClick={() => setShowAddModal(true)}
      >
        เพิ่มรายการอะไหล่
      </button>

      {/* Modal to input part details */}
      {showAddModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg w-1/2">
            <h2 className="text-lg font-semibold mb-4">เพิ่มรายการอะไหล่</h2>
            <form>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  เลือกรถ
                </label>
                <select
                  value={brand}
                  onChange={(e) => {
                    setBrand(e.target.value);
                    setModel(null);
                    setYear(null);
                    setVehicleID(null);
                  }}
                  className="block w-full p-2 border rounded"
                >
                  <option value="">เลือกแบรนด์</option>
                  {vehicleData.map((brandOption, index) => (
                    <option key={index} value={brandOption.Brand}>
                      {brandOption.Brand}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">รุ่น</label>
                <select
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    setYear(null);
                    setVehicleID(null);
                  }}
                  className="block w-full p-2 border rounded"
                  disabled={!brand}
                >
                  <option value="">เลือกรุ่น</option>
                  {vehicleData
                    .find((brandOption) => brandOption.Brand === brand)
                    ?.Models.map((modelOption, index) => (
                      <option key={index} value={modelOption.Model}>
                        {modelOption.Model}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">ปี</label>
                <select
                  value={year}
                  onChange={(e) => {
                    setYear(e.target.value);
                    const vehicle = vehicleData
                      .find((brandOption) => brandOption.Brand === brand)
                      ?.Models.find(
                        (modelOption) => modelOption.Model === model
                      )
                      ?.Vehicles.find(
                        (vehicleOption) => vehicleOption.Year === e.target.value
                      );
                    setVehicleID(vehicle?.Vehicle_ID);
                  }}
                  className="block w-full p-2 border rounded"
                  disabled={!model}
                >
                  <option value="">เลือกปี</option>
                  {vehicleData
                    .find((brandOption) => brandOption.Brand === brand)
                    ?.Models.find((modelOption) => modelOption.Model === model)
                    ?.Vehicles.map((vehicleOption, index) => (
                      <option key={index} value={vehicleOption.Year}>
                        {vehicleOption.Year}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  หมวดหมู่
                </label>
                <select
                  value={categoryID}
                  onChange={(e) => setCategoryID(e.target.value)}
                  className="block w-full p-2 border rounded"
                >
                  <option value="">เลือกหมวดหมู่</option>
                  <option value="1">เครื่องยนต์</option>
                  <option value="2">ระบบเบรก</option>
                  <option value="3">ระบบไฟฟ้า</option>
                  <option value="4">ตัวถังและโครงสร้าง</option>
                  <option value="5">ระบบส่งกำลัง</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  ชื่ออะไหล่
                </label>
                <input
                  type="text"
                  value={partName}
                  onChange={(e) => setPartName(e.target.value)}
                  className="block w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  รายละเอียด
                </label>
                <input
                  type="text"
                  value={partDescription}
                  onChange={(e) => setPartDescription(e.target.value)}
                  className="block w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">
                  ราคาต่อหน่วย
                </label>
                <input
                  type="number"
                  value={partPricePerUnit}
                  onChange={(e) => setPartPricePerUnit(e.target.value)}
                  className="block w-full p-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-sm font-medium">จำนวน</label>
                <input
                  type="number"
                  value={partQuantity}
                  onChange={(e) => setPartQuantity(e.target.value)}
                  className="block w-full p-2 border rounded"
                />
              </div>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                onClick={handleAddPart}
              >
                เพิ่มรายการอะไหล่
              </button>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 ml-4"
                onClick={() => setShowAddModal(false)}
              >
                ยกเลิก
              </button>
            </form>
          </div>
        </div>
      )}

      {/* รายการอะไหล่ */}
      {/* แยกหมวดหมู่รายการอะไหล่ */}
      <div className="border p-4 rounded-xl">
        <h2 className="text-lg font-semibold mb-4">รายการอะไหล่ตามหมวดหมู่</h2>
        {/* หมวดหมู่เครื่องยนต์ */}
        <h3
          className="text-lg font-semibold mb-2 cursor-pointer"
          onClick={() => setShowEngineParts(!showEngineParts)}
        >
          เครื่องยนต์
        </h3>
        {showEngineParts &&
          (parts.filter((part) => part.Category_ID === 1).length > 0 ? (
            parts
              .filter((part) => part.Category_ID === 1)
              .map((part, index) => (
                <div key={index} className="mb-2 border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span>{part.Name}</span>
                    <span>{part.Description}</span>
                    <div className="flex items-center space-x-4">
                      <span>{part.PricePerUnit} บาท</span>
                      <span>จำนวน: {part.Quantity}</span>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => handleEditPart(part)}
                      >
                        แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>ไม่มีรายการอะไหล่ในหมวดหมู่นี้</p>
          ))}
        {/* หมวดหมู่ระบบเบรก */}
        <h3
          className="text-lg font-semibold mb-2 cursor-pointer"
          onClick={() => setShowBrakeParts(!showBrakeParts)}
        >
          ระบบเบรก
        </h3>
        {showBrakeParts &&
          (parts.filter((part) => part.Category_ID === 2).length > 0 ? (
            parts
              .filter((part) => part.Category_ID === 2)
              .map((part, index) => (
                <div key={index} className="mb-2 border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span>{part.Name}</span>
                    <span>{part.Description}</span>
                    <div className="flex items-center space-x-4">
                      <span>{part.PricePerUnit} บาท</span>
                      <span>จำนวน: {part.Quantity}</span>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => handleEditPart(part)}
                      >
                        แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>ไม่มีรายการอะไหล่ในหมวดหมู่นี้</p>
          ))}
        {/* หมวดหมู่ระบบไฟฟ้า */}
        <h3
          className="text-lg font-semibold mb-2 cursor-pointer"
          onClick={() => setShowElectricalParts(!showElectricalParts)}
        >
          ระบบไฟฟ้า
        </h3>
        {showElectricalParts &&
          (parts.filter((part) => part.Category_ID === 3).length > 0 ? (
            parts
              .filter((part) => part.Category_ID === 3)
              .map((part, index) => (
                <div key={index} className="mb-2 border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span>{part.Name}</span>
                    <span>{part.Description}</span>
                    <div className="flex items-center space-x-4">
                      <span>{part.PricePerUnit} บาท</span>
                      <span>จำนวน: {part.Quantity}</span>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => handleEditPart(part)}
                      >
                        แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>ไม่มีรายการอะไหล่ในหมวดหมู่นี้</p>
          ))}
        {/* หมวดหมู่ตัวถังและโครงสร้าง */}
        <h3
          className="text-lg font-semibold mb-2 cursor-pointer"
          onClick={() => setShowBodyParts(!showBodyParts)}
        >
          ตัวถังและโครงสร้าง
        </h3>
        {showBodyParts &&
          (parts.filter((part) => part.Category_ID === 4).length > 0 ? (
            parts
              .filter((part) => part.Category_ID === 4)
              .map((part, index) => (
                <div key={index} className="mb-2 border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span>{part.Name}</span>
                    <span>{part.Description}</span>
                    <div className="flex items-center space-x-4">
                      <span>{part.PricePerUnit} บาท</span>
                      <span>จำนวน: {part.Quantity}</span>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => handleEditPart(part)}
                      >
                        แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>ไม่มีรายการอะไหล่ในหมวดหมู่นี้</p>
          ))}
        {/* หมวดหมู่ระบบส่งกำลัง */}
        <h3
          className="text-lg font-semibold mb-2 cursor-pointer"
          onClick={() => setShowTransmissionParts(!showTransmissionParts)}
        >
          ระบบส่งกำลัง
        </h3>
        {showTransmissionParts &&
          (parts.filter((part) => part.Category_ID === 5).length > 0 ? (
            parts
              .filter((part) => part.Category_ID === 5)
              .map((part, index) => (
                <div key={index} className="mb-2 border-b pb-2">
                  <div className="flex justify-between items-center">
                    <span>{part.Name}</span>
                    <span>{part.Description}</span>
                    <div className="flex items-center space-x-4">
                      <span>{part.PricePerUnit} บาท</span>
                      <span>จำนวน: {part.Quantity}</span>
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={() => handleEditPart(part)}
                      >
                        แก้ไข
                      </button>
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <p>ไม่มีรายการอะไหล่ในหมวดหมู่นี้</p>
          ))}

        {showEditModal && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-4 rounded-lg w-1/2">
              <h2 className="text-lg font-semibold mb-4">แก้ไขอะไหล่</h2>
              <form>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    ชื่ออะไหล่
                  </label>
                  <input
                    type="text"
                    value={editPart?.Name || ""}
                    onChange={(e) =>
                      setEditPart({ ...editPart, Name: e.target.value })
                    }
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    รายละเอียด
                  </label>
                  <input
                    type="text"
                    value={editPart?.Description || ""}
                    onChange={(e) =>
                      setEditPart({ ...editPart, Description: e.target.value })
                    }
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    ราคาต่อหน่วย
                  </label>
                  <input
                    type="number"
                    value={editPart?.PricePerUnit || ""}
                    onChange={(e) =>
                      setEditPart({ ...editPart, PricePerUnit: e.target.value })
                    }
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-sm font-medium">
                    จำนวน
                  </label>
                  <input
                    type="number"
                    value={editPart?.Quantity || ""}
                    onChange={(e) =>
                      setEditPart({ ...editPart, Quantity: e.target.value })
                    }
                    className="block w-full p-2 border rounded"
                  />
                </div>
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleSaveEdit}
                >
                  บันทึก
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 ml-4"
                  onClick={() => setShowEditModal(false)}
                >
                  ยกเลิก
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
