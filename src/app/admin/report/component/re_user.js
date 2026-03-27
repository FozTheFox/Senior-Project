"use client";
import React, { useState } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";

// Fetch roles from the API
const fetchRoles = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/roles"
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};

// TechnicianCard Component
const TechnicianCard = ({ role, onClick, isSelected }) => (
  <div
    className={`mb-2 cursor-pointer p-2 ${isSelected ? "bg-blue-100" : ""}`}
    onClick={() => onClick(role)}
  >
    <h3 className="font-normal pl-3">{role.Role_name}</h3>
  </div>
);

// TechnicianList Component
const TechnicianList = ({ roles, onSelectRole, selectedRole }) => (
  <div className="h-[calc(50vh-200px)]">
    {roles.map((role) => (
      <TechnicianCard
        key={role.Role_ID}
        role={role}
        onClick={onSelectRole}
        isSelected={selectedRole && selectedRole.Role_ID === role.Role_ID}
      />
    ))}
  </div>
);

// WorkTimeDetails Component
const WorkTimeDetails = ({ technicians }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">พนักงานในตำแหน่ง</h2>
      <div className="h-[calc(50vh-300px)] overflow-auto">
        <ul className="space-y-2">
          {technicians.map((technician) => (
            <li key={technician.User_ID} className="text-sm">
              <div className="flex items-center">
                <div>
                  <h3 className="font-semibold">{technician.name}</h3>
                  <p className="text-gray-700">อีเมล : {technician.email}</p>
                  <p className="text-gray-700">
                    เบอร์โทร : {technician.phone_number}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ฟังก์ชันสร้าง PDF
const generatePDF = (rolesData) => {
  const newWindow = window.open("", "", "width=1000,height=800");
  if (newWindow) {
    const rolesHTML = rolesData
      .map(
        (role) => `
      <div>
        <h2>ตำแหน่ง : ${role.Role_name}</h2>
        <h3>พนักงาน:</h3>
        <ul>
          ${
            role.puser.length > 0
              ? role.puser
                  .map(
                    (user) => `
            <li>
              <strong>${user.name}</strong><br>
              Email: ${user.email}<br>
              Phone: ${user.phone_number}<br>
            </li>
          `
                  )
                  .join("")
              : "<li>ไม่มีพนักงานในบทบาทนี้</li>"
          }
        </ul>
      </div>
      <hr>
    `
      )
      .join("");

    newWindow.document.write(`
      <html>
        <head>
          <title>รายงานพนักงาน</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              margin: 20px;
            }
            .container {
              width: 80%;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 20px;
            }
            .header h1 {
              font-size: 24px;
              margin: 0;
            }
            .header p {
              margin: 0;
              font-size: 14px;
            }
            h1 {
              text-align: center;
            }
            h2 {
              color: #333;
            }
            ul {
              list-style-type: none;
              padding: 0;
            }
            li {
              margin-bottom: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>บริษัท ทรัพย์พูลทวีเซอร์วิส</h1>
            <p>212 หมู่ 8 ต.ดงลาน อ.เมือง จ.ร้อยเอ็ด 45000</p>
          </div>
          <h1>รายงานพนักงานทั้งหมด</h1>
          ${rolesHTML}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
  }
};

// Report Component (Main Component)
const queryClient = new QueryClient();

const Report = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const {
    data: rolesData,
    isLoading: loadingRoles,
    error: rolesError,
  } = useQuery({
    queryKey: ["roles"],
    queryFn: fetchRoles,
  });

  if (loadingRoles) return <div className="text-center mt-8">Loading...</div>;
  if (rolesError)
    return (
      <div className="text-center mt-8 text-red-500">
        Error: {rolesError.message}
      </div>
    );

  const handleSelectRole = (role) => {
    setSelectedRole(role);
  };

  // Get technicians from the selected role
  const techniciansForSelectedRole = selectedRole ? selectedRole.puser : [];

  return (
    <div className="w-full">
      <div className="grid sm:grid-cols-2 w-full h-[450px] bg-white shadow-lg ring-1 ring-black/5 rounded-xl">
        <div>
          <h1 className="pl-5 pt-5 text-2xl font-bold">พนักงานทั้งหมด</h1>
          <div className="grid md:grid-cols-2">
            <h3 className="pl-2 mt-8 ml-6 text-xl text-left ">เลือกตำแหน่ง</h3>
            <button
              type="button"
              onClick={() => generatePDF(rolesData)}
              className="mt-2 mb-4 ml-20 mr-6 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
            >
              ปริ้นข้อมูลทั้งหมด
            </button>
          </div>
          <div className="px-6 flex">
            <div className="w-full h-[300px] p-2 rounded border border-gray-700 overflow-y-auto">
              <TechnicianList
                roles={rolesData}
                onSelectRole={handleSelectRole}
                selectedRole={selectedRole}
              />
            </div>
          </div>
        </div>
        <div className="p-5 pt-6 flex">
          <div
            className={`w-full h-[400px] p-2 rounded border border-gray-700 `}
          >
            {selectedRole && (
              <WorkTimeDetails technicians={techniciansForSelectedRole} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Report />
    </QueryClientProvider>
  );
}
