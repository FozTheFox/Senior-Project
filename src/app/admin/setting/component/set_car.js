"use client";

import React, { useState, useEffect } from "react";

function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg">{children}</div>
    </div>
  );
}

export default function SetCar() {
  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddNewBrand, setIsAddNewBrand] = useState(true);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({ brand: "", model: "", year: "" });
  const [newCarData, setNewCarData] = useState({
    brand: "",
    model: "",
    year: "",
    existingBrandId: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    fetch("https://bodyworkandpaint.pantook.com/api/datacar")
      .then((response) => response.json())
      .then((data) => {
        setData(data);
      });
  };

  const handleEditClick = (brand, brandId, model, vehicle) => {
    console.log("Editing:", { brand, brandId, model, vehicle });
    setSelectedCar({ brand, brandId, model, vehicle });
    setFormData({ brand, model, year: vehicle.Year });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleNewCarInputChange = (e) => {
    const { name, value } = e.target;
    setNewCarData({ ...newCarData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Make an API request to update the car details
    fetch(`https://bodyworkandpaint.pantook.com/api/updatecar`, {
      method: "PUT", // or 'POST' depending on your API
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        brand: formData.brand,
        model: formData.model,
        year: formData.year,
        brandIds: selectedCar.brandId,
        vehicleIds: selectedCar.vehicle.Vehicle_ID,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Optionally update the local state with the new data
        fetchData();
        setIsModalOpen(false);
        // Refresh the data or update the state if necessary
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleAddNewCarSubmit = (e) => {
    e.preventDefault();

    if (isAddNewBrand) {
      // API สำหรับการเพิ่มแบรนด์ใหม่
      fetch("https://bodyworkandpaint.pantook.com/api/addnewcar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: newCarData.brand,
          model: newCarData.model,
          year: newCarData.year,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          fetchData();
          setIsAddModalOpen(false);
          setNewCarData({
            brand: "",
            model: "",
            year: "",
            existingBrandId: "",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      // API สำหรับการเพิ่มรุ่น/ปีสำหรับแบรนด์ที่มีอยู่
      fetch("https://bodyworkandpaint.pantook.com/api/addnewmodel", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brandId: newCarData.existingBrandId,
          model: newCarData.model,
          year: newCarData.year,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          fetchData();
          setIsAddModalOpen(false);
          setNewCarData({
            brand: "",
            model: "",
            year: "",
            existingBrandId: "",
          });
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  };

  const handleOpenModal = () => {
    setIsAddModalOpen(true);
  };

  return (
    <div>
      <div className="h-screen bg-gray-100">
        <div className="mb-6 gap-5 grid grid-cols-1">
          <button
            className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700 mb-4"
            onClick={handleOpenModal}
          >
            เพิ่มข้อมูลรถ
          </button>
          <div className="w-full overflow-y-auto bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
            <div className="m-4 border-b border-gray-100 pb-4 items-center justify-center">
              <table className="w-full text-left rtl:text-center text-black">
                <thead className="text-black rounded-xl uppercase bg-white border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      แบรนด์
                    </th>
                    <th scope="col" className="px-6 py-3">
                      รุ่น
                    </th>
                    <th scope="col" className="px-6 py-3">
                      ปี
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((brand, brandIndex) => (
                    <React.Fragment key={brand.Brand_ID}>
                      {brandIndex > 0 && (
                        <tr>
                          <td colSpan="4" className="bg-gray-300 h-1"></td>
                        </tr>
                      )}
                      {brand.Models.map((model, modelIndex) => (
                        <React.Fragment key={modelIndex}>
                          {model.Vehicles.map((vehicle, vehicleIndex) => (
                            <tr key={vehicle.Vehicle_ID}>
                              {vehicleIndex === 0 && modelIndex === 0 && (
                                <td
                                  rowSpan={brand.Models.reduce(
                                    (acc, m) => acc + m.Vehicles.length,
                                    0
                                  )}
                                  className="px-6 pt-2 font-medium text-gray-900 whitespace-nowrap"
                                >
                                  {brand.Brand}
                                </td>
                              )}
                              {vehicleIndex === 0 && (
                                <td
                                  rowSpan={model.Vehicles.length}
                                  className="px-6 pt-2 font-medium text-gray-900 whitespace-nowrap"
                                >
                                  {model.Model}
                                </td>
                              )}
                              <td className="px-6 pt-2 font-medium text-gray-900 whitespace-nowrap">
                                {vehicle.Year}
                              </td>
                              <td className="px-6 pt-2">
                                <button
                                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                                  onClick={() =>
                                    handleEditClick(
                                      brand.Brand,
                                      brand.Brand_ID,
                                      model.Model,
                                      vehicle
                                    )
                                  }
                                >
                                  แก้ไข
                                </button>
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {isModalOpen && (
          <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
            <h2>แก้ไขข้อมูลรถยนต์</h2>
            <form onSubmit={handleSubmit}>
              <label className="block mb-2">
                <span className="text-gray-700">แบรนด์</span>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">รุ่น</span>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">ปี</span>
                <input
                  type="text"
                  name="year"
                  value={formData.year}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                />
              </label>
              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  บันทึก
                </button>
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </Modal>
        )}
        {isAddModalOpen && (
          <Modal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
          >
            <h2>เพิ่มข้อมูลรถใหม่</h2>

            {/* ปุ่มสำหรับเลือกว่าเพิ่มแบรนด์ใหม่หรือเพิ่มรุ่น/ปี */}
            <div className="mb-4">
              <button
                onClick={() => setIsAddNewBrand(true)}
                className={`${
                  isAddNewBrand ? "bg-green-500" : "bg-gray-300"
                } text-white px-4 py-2 rounded-lg`}
              >
                เพิ่มแบรนด์ใหม่
              </button>
              <button
                onClick={() => setIsAddNewBrand(false)}
                className={`ml-2 ${
                  !isAddNewBrand ? "bg-green-500" : "bg-gray-300"
                } text-white px-4 py-2 rounded-lg`}
              >
                เพิ่มรุ่น/ปี
              </button>
            </div>

            <form onSubmit={handleAddNewCarSubmit}>
              {/* ถ้าเลือกเพิ่มแบรนด์ใหม่ */}
              {isAddNewBrand ? (
                <label className="block mb-2">
                  <span className="text-gray-700">เพิ่มแบรนด์ใหม่</span>
                  <input
                    type="text"
                    name="brand"
                    value={newCarData.brand}
                    onChange={handleNewCarInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    placeholder="ชื่อแบรนด์ใหม่"
                  />
                </label>
              ) : (
                // ถ้าเลือกเพิ่มรุ่นและปี
                <label className="block mb-2">
                  <span className="text-gray-700">เลือกแบรนด์ที่มีอยู่</span>
                  <select
                    name="existingBrandId"
                    value={newCarData.existingBrandId}
                    onChange={handleNewCarInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  >
                    <option value="">-- เลือกแบรนด์ --</option>
                    {data.map((brand) => (
                      <option key={brand.Brand_ID} value={brand.Brand_ID}>
                        {brand.Brand}
                      </option>
                    ))}
                  </select>
                </label>
              )}

              {/* ช่องกรอกข้อมูลรุ่นและปี (ใช้ร่วมกันทั้งสองแบบ) */}
              <label className="block mb-2">
                <span className="text-gray-700">รุ่น</span>
                <input
                  type="text"
                  name="model"
                  value={newCarData.model}
                  onChange={handleNewCarInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="ชื่อรุ่น"
                />
              </label>
              <label className="block mb-2">
                <span className="text-gray-700">ปี</span>
                <input
                  type="text"
                  name="year"
                  value={newCarData.year}
                  onChange={handleNewCarInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                  placeholder="ปี"
                />
              </label>

              <div className="mt-4">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  เพิ่ม
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="ml-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                  ยกเลิก
                </button>
              </div>
            </form>
          </Modal>
        )}
      </div>
    </div>
  );
}
