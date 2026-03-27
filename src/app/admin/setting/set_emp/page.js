// 'use client';
// import Sidebar from "../../../ui/Sidebar";
// import { CgProfile } from "react-icons/cg";
// import { FaHouseUser } from "react-icons/fa";
// import {
//     FaCar,
//     FaShieldAlt
// } from "react-icons/fa";
// import { FaScrewdriverWrench } from "react-icons/fa6";
// import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // Import axios

// export default function set_emp() {

//     const [data, setData] = useState([]); // สร้าง state สำหรับเก็บข้อมูล
//     const [loading, setLoading] = useState(true); // สถานะการโหลดข้อมูล
//     const [error, setError] = useState(null); // สถานะการเกิดข้อผิดพลาด
//     const [selectedUser, setSelectedUser] = useState(null);
//     const [employeeData, setEmployeeData] = useState({
//         employeeId: '',
//         employeeName: '',
//         phoneNumber: '',
//         taxId: '',
//         bankAccount: '',
//         position: ''
//       });

//       useEffect(() => {
//         // ดึงข้อมูลจาก API
//         const fetchData = async () => {
//           try {
//             const response = await fetch('https://bodyworkandpaint.pantook.com/api/puser');
//             if (!response.ok) {
//               throw new Error('Network response was not ok');
//             }
//             const result = await response.json();
//             setData(result);
//             setLoading(false);
//           } catch (error) {
//             setError(error);
//             setLoading(false);
//           }
//         };

//         fetchData();
//       }, []); // เรียกใช้เมื่อ Component นี้ Mount ครั้งแรกเท่านั้น

//     //เลือกข้อมูลข้างแถบด้านข้าง
//     const handleRowClick = (User_ID) => {
//         // กรองข้อมูลจากชุดข้อมูลที่ดึงมาแล้ว
//         const selected = data.find(item => item.User_ID === User_ID);
//         setSelectedUser(selected); // ตั้งค่าข้อมูลผู้ใช้ที่ถูกเลือก
//         console.log(selected); // แสดงข้อมูลที่ถูกเลือกใน console
//       };

//       const handleCancel = () => {
//         // เมื่อกดปุ่มยกเลิก ให้ตั้ง isPartSelected เป็น false เพื่อซ่อนปุ่ม
//         setSelectedUser(false);
//         // รีเซ็ตค่าหรือทำการยกเลิกการเลือก Part ที่นี่
//         setEmployeeData({
//             employeeId: '',
//             employeeName: '',
//             phoneNumber: '',
//             taxId: '',
//             bankAccount: '',
//             position: ''
//         });
//     };

//       const handleChange = (e) => {
//         setEmployeeData({
//           ...employeeData,
//           [e.target.name]: e.target.value
//         });
//       };

//     const uniqueData = data.filter((item, index, self) =>
//         index === self.findIndex((t) => t.User_ID === item.User_ID)
//       );

//      // ฟังก์ชันจัดการการเปลี่ยนรูป
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       // สร้าง URL ของรูปภาพใหม่เพื่อแสดงทันที (ถ้าเป็นรูปที่ยังไม่ได้อัปโหลด)
//       const newImageUrl = URL.createObjectURL(file);
//       setImage(newImageUrl);

//       // ถ้าคุณต้องการส่งไฟล์ไปยังเซิร์ฟเวอร์
//       const formData = new FormData();
//       formData.append('image', file);

//       // โค้ดการอัปโหลดไปยังเซิร์ฟเวอร์
//       // fetch('your-api-url-to-upload', {
//       //   method: 'POST',
//       //   body: formData,
//       // }).then(response => {
//       //   // จัดการ response
//       // });
//     }
//   };

//     // ตรวจสอบการโหลดข้อมูล
//     if (loading) return <div>Loading...</div>;
//     if (error) return <div>{error}</div>;

//     return (
//         <div>
//             <Sidebar/>
//             <div className="p-10 px-72 bg-gray-100">
//                 <div className="mb-6 gap-5 grid sm:grid-cols-5">
//                     <a href="set_emp">
//                     <div className="max-h-[150px] max-w-[350px] bg-gray-600 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
//                        <CgProfile className="my-1 text-9xl text-white group-hover:text-white"/>
//                         <strong className="my-1 text-base text-white group-hover:text-white font-semibold">ตั้งค่าพนักงาน</strong>
//                     </div>
//                     </a>
//                     <a href="set_car">

//                     <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
//                         <FaCar className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
//                         <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่ารถ</strong>

//                     </div>
//                     </a>

//                     <a href="set_insu">

//                     <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
//                         <FaShieldAlt className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
//                         <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าบริษัทประกัน</strong>

//                     </div>
//                     </a>

//                     <a href="set_part">

//                     <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
//                         <FaScrewdriverWrench className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
//                         <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าอะไหล่</strong>

//                     </div>
//                     </a>

//                 </div>
//                 <div className="mb-6 gap-80 grid sm:grid-cols-12">
//                     <div className="w-72 h-96 overflow-y-auto bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
//                         <div className="my-4 border-b border-gray-100 pb-4 items-center justify-center">
//                         <table className="w-full text-left rtl:text-right text-black">
//                                 <thead className="text-black rounded-xl uppercase bg-white border-b border-gray-200">
//                                     <tr>
//                                         <th scope="col" className="px-6 py-3">ชื่อพนักงาน</th>
//                                         <th scope="col" className="px-6 py-3"></th>
//                                     </tr>
//                                 </thead>
//                                 <tbody>
//                                     {data && data.map((item) => (
//                                         <tr
//                                             className='even:bg-white odd:bg-gray-100 border-b dark:border-gray-200 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg'
//                                             key={item.User_ID}
//                                             onClick={() => handleRowClick(item.User_ID)} // เมื่อคลิกที่แถว จะดึงข้อมูลตาม User_ID
//                                         >
//                                             <td className="px-6 py- font-medium text-gray-900 whitespace-nowrap group-hover:text-white">{item.name}</td>
//                                             <td className="px-6 p-2 font-medium text-gray-900 whitespace-nowrap group-hover:text-white">
//                                                 <img src={`https://bodyworkandpaint.pantook.com/storage/${item.image}`} alt={item.Model} className="h-12 w-12 object-cover rounded-full" />
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                     <div className="min-h-[550px] min-w-[620px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
//                         <div className="m-4 gap-32 grid sm:grid-cols-3">
//                             {selectedUser ? (
//                                 <div className="relative flex flex-col my-2 h-[500px] w-[600px]">
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">รหัสพนักงาน</span>
//                                         <input
//                                         type="text"
//                                         name="User_ID"
//                                         value={selectedUser?.User_ID || " "}
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">ชื่อผู้ใช้</span>
//                                         <input
//                                         type="text"
//                                         name="username"
//                                         value={selectedUser?.username || " "}
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">ชื่อ-นามสกุลพนักงาน</span>
//                                         <input
//                                         type="text"
//                                         name="name"
//                                         value={selectedUser?.name || " "}
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">อีเมล</span>
//                                         <input
//                                         type="text"
//                                         name="email"
//                                         value={selectedUser?.email || " "}
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">เบอร์โทรพนักงาน</span>
//                                         <input
//                                         type="text"
//                                         name="phone_number"
//                                         value={selectedUser?.phone_number || " "}
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">รูปภาพ</span>
//                                         <img src={`https://bodyworkandpaint.pantook.com/storage/${selectedUser.image}`} alt={selectedUser.image} className="h-12 w-12 object-cover rounded-full" />
//                                         <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
//                                     />
//                                     </label>
//                                     <button className="absolute right-5 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
//                                     ยืนยัน
//                                 </button>

//                                 {/* ปุ่มยกเลิก แสดงก็ต่อเมื่อ isPartSelected เป็น true */}
//                                 {selectedUser && (
//                                     <button
//                                         className="absolute right-[100px] bottom-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
//                                         onClick={handleCancel}
//                                     >
//                                         ยกเลิก
//                                     </button>
//                                 )}
//                                 </div>
//                             ) : (
//                                 <div className="relative flex flex-col my-2 h-[500px] w-[600px]">
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">รหัสพนักงาน</span>
//                                         <input
//                                         type="text"
//                                         name="User_ID"
//                                         value=""
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">ชื่อผู้ใช้</span>
//                                         <input
//                                         type="text"
//                                         name="username"
//                                         value=""
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">ชื่อ-นามสกุลพนักงาน</span>
//                                         <input
//                                         type="text"
//                                         name="name"
//                                         value=""
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">อีเมล</span>
//                                         <input
//                                         type="text"
//                                         name="email"
//                                         value=""
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">เบอร์โทรพนักงาน</span>
//                                         <input
//                                         type="text"
//                                         name="phone_number"
//                                         value=""
//                                         onChange={handleChange}
//                                         className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
//                                         placeholder=""/>
//                                     </label>
//                                     <label className="max-h-10 w-72 mb-8 justify-center">
//                                         <span className="text-base font-semibold">รูปภาพ</span>

//                                         <input
//                                         type="file"
//                                         accept="image/*"
//                                         onChange={handleImageChange}
//                                         className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
//                                     />
//                                         <button className="absolute right-5 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//                                          >ยืนยัน</button>
//                                     </label>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );

// }
"use client";
import Sidebar from "../../../ui/Sidebar";
import { CgProfile } from "react-icons/cg";
import { FaCar, FaShieldAlt } from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";
import React, { useEffect, useState } from "react";
import axios from "axios"; // Import axios

export default function set_emp() {
  const [data, setData] = useState([]); // State to store data
  const [roles, setRoles] = useState([]); // State to store roles

  const [selectedUser, setSelectedUser] = useState(null);
  const [employeeData, setEmployeeData] = useState({
    username: "",
    password: "", // Add password field
    email: "",
    name: "",
    phone_number: "",
    Role_ID: "", // Add Role_ID field
  });

  useEffect(() => {
    // Fetch data from API
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
  }, []); // Fetch data only once when component mounts

  useEffect(() => {
    // Fetch roles from API
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
  }, []); // Fetch roles only once when component mounts

  // Handle row click
  const handleRowClick = (User_ID) => {
    const selected = data.find((item) => item.User_ID === User_ID);
    setSelectedUser(selected); // Set selected user data
    setEmployeeData({
      username: selected?.username || "",
      password: "", // Reset password field
      email: selected?.email || "",
      name: selected?.name || "",
      phone_number: selected?.phone_number || "",
      Role_ID: selected?.Role_ID || "", // Reset Role_ID field
    });
    console.log(selected); // Log selected data
  };

  const handleCancel = () => {
    setSelectedUser(null); // Reset selected user
    setEmployeeData({
      username: "",
      password: "", // Reset password field
      email: "",
      name: "",
      phone_number: "",
      Role_ID: "", // Reset Role_ID field
    });
  };

  const handleChange = (e) => {
    setEmployeeData({
      ...employeeData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        // Update existing user
        const response = await axios.put(
          `https://bodyworkandpaint.pantook.com/api/puser/${selectedUser.User_ID}`,
          employeeData
        );
        if (response.data.status) {
          alert("User updated successfully");
        } else {
          alert("Error updating user");
        }
      } else {
        // Create new user
        const response = await axios.post(
          "https://bodyworkandpaint.pantook.com/api/register",
          employeeData
        );
        if (response.data.status) {
          alert("User registered successfully");
          setEmployeeData({
            username: "",
            password: "", // Reset password field
            email: "",
            name: "",
            phone_number: "",
            Role_ID: "", // Reset Role_ID field
          });
        } else {
          alert("Error registering user");
        }
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const newImageUrl = URL.createObjectURL(file);
      setImage(newImageUrl);

      const formData = new FormData();
      formData.append("image", file);
    }
  };

  return (
    <div>
      <Sidebar />
      <div className="p-10 px-72 bg-gray-100">
        <div className="mb-6 gap-5 grid sm:grid-cols-5">
          <a href="set_emp">
            <div className="max-h-[150px] max-w-[350px] bg-gray-600 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <CgProfile className="my-1 text-9xl text-white group-hover:text-white" />
              <strong className="my-1 text-base text-white group-hover:text-white font-semibold">
                {" "}
                ตั้งค่าพนักงาน
              </strong>
            </div>
          </a>
          <a href="set_car">
            <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <FaCar className="my-1 text-9xl text-gray-600 group-hover:text-white" />
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
                ตั้งค่ารถ
              </strong>
            </div>
          </a>

          <a href="set_insu">
            <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <FaShieldAlt className="my-1 text-9xl text-gray-600 group-hover:text-white" />
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
                ตั้งค่าบริษัทประกัน
              </strong>
            </div>
          </a>

          <a href="set_part">
            <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
              <FaScrewdriverWrench className="my-1 text-9xl text-gray-600 group-hover:text-white" />
              <strong className="my-1 text-base text-black group-hover:text-white font-semibold">
                ตั้งค่าอะไหล่
              </strong>
            </div>
          </a>
        </div>
        <div className="mb-6 gap-80 grid sm:grid-cols-12">
          <div className="w-72 h-96 overflow-y-auto bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
            <div className="my-4 border-b border-gray-100 pb-4 items-center justify-center">
              <table className="w-full text-left rtl:text-right text-black">
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
                        onClick={() => handleRowClick(item.User_ID)} // Handle row click
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
                <label className="max-h-10 w-72 mb-8 justify-center">
                  <span className="text-base font-semibold">ชื่อผู้ใช้</span>
                  <input
                    type="text"
                    name="username"
                    value={employeeData.username}
                    onChange={handleChange}
                    className="block w-[580px] p-2 text-sm border border-gray-800 rounded-xl text-black"
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                    placeholder=""
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
                <label className="max-h-10 w-72 mb-8 justify-center">
                  <span className="text-base font-semibold">รูปภาพ</span>
                  {selectedUser && (
                    <img
                      src={`https://bodyworkandpaint.pantook.com/storage/${selectedUser.image}`}
                      alt={selectedUser.image}
                      className="h-12 w-12 object-cover rounded-full"
                    />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
                  />
                </label>
                <button
                  className="absolute right-5 bottom-0 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  onClick={handleSubmit} // Handle form submission
                >
                  ยืนยัน
                </button>

                {/* Cancel button */}
                {selectedUser && (
                  <button
                    className="absolute right-[100px] bottom-0 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700"
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
