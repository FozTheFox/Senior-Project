"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SetEmp() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [employeeData, setEmployeeData] = useState({});
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setEmployeeData({
      username: "",
      password: "",
      email: "",
      name: "",
      phone_number: "",
      Role_ID: "",
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://bodyworkandpaint.pantook.com/api/puser"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await fetch(
          "https://bodyworkandpaint.pantook.com/api/Rolesuser"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        setRoles(result);
      } catch (error) {
        setError(error);
      }
    };

    fetchRoles();
  }, []);

  const handleRowClick = (User_ID) => {
    const selected = data.find((item) => item.User_ID === User_ID);
    setSelectedUser(selected);
    setEmployeeData({
      username: selected?.username || "",
      password: "",
      email: selected?.email || "",
      name: selected?.name || "",
      phone_number: selected?.phone_number || "",
      Role_ID: selected?.Role_ID || "",
    });
    setShowForm(true); // Show form when user is selected
  };

  const handleCancel = () => {
    setSelectedUser(null);
    setEmployeeData({
      username: "",
      password: "",
      email: "",
      name: "",
      phone_number: "",
      Role_ID: "",
    });
    setShowForm(false); // Hide form when canceled
  };

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const Data = {
      username: employeeData.username,
      password: employeeData.password,
      email: employeeData.email,
      name: employeeData.name,
      phone_number: employeeData.phone_number,
      Role_ID: employeeData.Role_ID,
    };
    const upData = {
      User_ID: selectedUser.User_ID,
      username: employeeData.username,
      email: employeeData.email,
      name: employeeData.name,
      phone_number: employeeData.phone_number,
      Role_ID: employeeData.Role_ID,
    };
    // เฉพาะเมื่อมี password ที่ไม่ว่างจึงเพิ่มลงไป
    if (employeeData.password && employeeData.password.trim() !== "") {
      upData.password = employeeData.password;
    }
    try {
      let response;
      if (selectedUser) {
        console.log(upData);
        response = await axios.put(
          `https://bodyworkandpaint.pantook.com/api/puserup2`,
          upData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        console.log(response);
      } else {
        response = await axios.post(
          "https://bodyworkandpaint.pantook.com/api/registerweb",
          Data
        );
      }
      console.log("employeeData:", upData);
      if (response.data.status) {
        alert(
          selectedUser
            ? "User updated successfully"
            : "User registered successfully"
        );
        setEmployeeData({
          username: "",
          password: "",
          email: "",
          name: "",
          phone_number: "",
          Role_ID: "",
        });
        setShowForm(false); // Hide form after submission
      } else {
        alert(selectedUser ? "Error updating user" : "Error registering user");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    }
  };

  const handleAddEmployee = () => {
    setShowForm(true);
    setSelectedUser(null);
    setEmployeeData({
      username: "",
      password: "",
      email: "",
      name: "",
      phone_number: "",
      Role_ID: "",
    });
  };

  return (
    <div>
      <div className=" bg-gray-100">
        <div className="mb-6 gap-96 grid sm:grid-cols-12">
          <div className="w-80 h-[600px] overflow-y-auto bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
            <div className="my-4 border-b border-gray-100 pb-4 items-center justify-center h-[600px] overflow-y-auto">
              <table className="w-full text-left rtl:text-right text-black ">
                <thead className="text-black rounded-xl uppercase bg-white border-b border-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      ชื่อพนักงาน
                    </th>
                    <th scope="col" className="px-6 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data.map((item) => (
                      <tr
                        className="even:bg-white odd:bg-gray-100 border-b dark:border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
                        key={item.User_ID}
                        onClick={() => handleRowClick(item.User_ID)}
                      >
                        <td className="px-6 py- font-medium text-gray-900 whitespace-nowrap group-hover:text-white">
                          {item.name}
                        </td>
                        <td className="px-6 p-2 font-medium text-gray-900 whitespace-nowrap group-hover:text-white">
                          <img
                            src={`https://bodyworkandpaint.pantook.com/storage/${item.image}`}
                            alt={item.Model}
                            className="h-12 w-12 object-cover rounded-full"
                          />
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="min-h-[550px] min-w-[620px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
            <div className="m-4 gap-32 grid sm:grid-cols-3">
              <div className="relative flex flex-col my-2 h-[500px] w-[600px]">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleAddEmployee}
                >
                  เพิ่มพนักงาน
                </button>

                {showForm && (
                  <div>
                    <label className="max-h-10 w-72 mb-8 justify-center">
                      <span className="text-base font-semibold">
                        ชื่อผู้ใช้
                      </span>
                      <input
                        type="text"
                        name="username"
                        value={employeeData.username}
                        onChange={handleChange}
                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                      />
                    </label>
                    <label className="max-h-10 w-72 mb-8 justify-center">
                      <span className="text-base font-semibold">รหัสผ่าน</span>
                      <input
                        type="password"
                        name="password"
                        value={employeeData.password}
                        onChange={handleChange}
                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                      />
                    </label>
                    <label className="max-h-10 w-72 mb-8 justify-center">
                      <span className="text-base font-semibold">
                        ชื่อ-นามสกุลพนักงาน
                      </span>
                      <input
                        type="text"
                        name="name"
                        value={employeeData.name}
                        onChange={handleChange}
                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                      />
                    </label>
                    <label className="max-h-10 w-72 mb-8 justify-center">
                      <span className="text-base font-semibold">อีเมล</span>
                      <input
                        type="text"
                        name="email"
                        value={employeeData.email}
                        onChange={handleChange}
                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                      />
                    </label>
                    <label className="max-h-10 w-72 mb-8 justify-center">
                      <span className="text-base font-semibold">
                        เบอร์โทรพนักงาน
                      </span>
                      <input
                        type="text"
                        name="phone_number"
                        value={employeeData.phone_number}
                        onChange={handleChange}
                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                      />
                    </label>
                    <label className="max-h-10 w-72 mb-8 justify-center">
                      <span className="text-base font-semibold">ตำแหน่ง</span>
                      <select
                        name="Role_ID"
                        value={employeeData.Role_ID}
                        onChange={handleChange}
                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                      >
                        <option value="">เลือกตำแหน่ง</option>
                        {roles.map((role) => (
                          <option key={role.Role_ID} value={role.Role_ID}>
                            {role.Role_name}
                          </option>
                        ))}
                      </select>
                    </label>
                    {/* <label className="max-h-10 w-72 mb-8 justify-center">
                      <span className="text-base font-semibold">
                        อัปโหลดรูปภาพ
                      </span>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                      />
                    </label> */}

                    <div className="flex mt-4">
                      <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                        onClick={handleSubmit}
                      >
                        {selectedUser ? "Update User" : "Add User"}
                      </button>
                      <button
                        className="bg-gray-500 text-white px-4 py-2 ml-2 rounded-lg hover:bg-gray-700"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
