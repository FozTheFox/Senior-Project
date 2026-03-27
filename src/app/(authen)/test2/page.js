'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Sidebar from "../../ui/Sidebar";
import { FaHouseUser  , FaCar } from "react-icons/fa";
import { HiDocumentReport } from "react-icons/hi";
import { IoTime } from "react-icons/io5";

const fetchQuotationsData = async () => {
  const response = await fetch('https://bodyworkandpaint.pantook.com/api/quotationsCompleted');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const fetchQuotationInvoice = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/Quotationinvoice"
  );
  const data = await response.json();
  console.log("ข้อมูลที่ดึงมาจาก API:", data);
  return data.data;
};

// Create a QueryClient instance
const queryClient = new QueryClient();

// ใน Component ของคุณ
const Invoice = () => {
  const { data: quotations, isLoading, error } = useQuery({
    queryKey: 'quotationData',
    queryFn: fetchQuotationInvoice,
  });

  if (isLoading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error.message}</div>;

  return (
    <div>
      <h1>ข้อมูลใบเสร็จ</h1>
      <table>
        <thead>
          <tr>
            <th>ชื่ออะไหล่</th>
            <th>จำนวน</th>
            <th>ราคาต่อหน่วย</th>
            <th>รวม</th>
          </tr>
        </thead>
        <tbody>
          {quotations.repairProcesses.flatMap((rp) => rp.partUsages).map((part) => (
            <tr key={part.id}>
              <td>{part.PartName}</td>
              <td>{part.Quantity}</td>
              <td>{part.PricePerUnit} บาท</td>
              <td>{(part.Quantity * parseFloat(part.PricePerUnit)).toFixed(2)} บาท</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const Cilent = () => {
  const { data: quotations, isLoading, error } = useQuery({
    queryKey: 'quotationData',
    queryFn: fetchQuotationsData,
  });

  if (isLoading) return <div>กำลังโหลดข้อมูล...</div>;
  if (error) return <div>เกิดข้อผิดพลาด: {error.message}</div>;

  return (
    <div>
      <h1>ข้อมูลลูกค้า</h1>
      <pre>{JSON.stringify(quotations, null, 2)}</pre>
    </div>
  );
};

const generatePrintPage = () => {
  const newWindow = window.open("", "", "width=1000,height=800");
  if (newWindow) {
    newWindow.document.write(`
      <html>
        <head>
          <title>ใบเสร็จ</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .total { font-weight: bold; }
            .company-header { text-align: center; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          <div class="company-header">
            <h1>SapPhun Thawi Service</h1>
            <p>ใบเสร็จลำดับที่: </p>
          </div>

          <h2>ทะเบียนรถ: ${selectedQuotationInvoice?.LicensePlate}</h2>
          <p>เจ้าของ: ${selectedQuotationInvoice?.customer?.FullName}</p>
          <p>รุ่น: ${selectedQuotationInvoice?.Vehicle?.Brand} ${
      selectedQuotationInvoice?.Vehicle?.Model
    } ปี ${selectedQuotationInvoice?.Vehicle?.Year}</p>

          <h3>รายการอะไหล่ที่ใช้ทั้งหมด</h3>
          <table>
            <thead>
              <tr>
                <th>ชื่ออะไหล่</th>
                <th>จำนวน</th>
                <th>ราคาต่อหน่วย</th>
                <th>รวม</th>
              </tr>
            </thead>
            <tbody>
              ${selectedQuotationInvoice?.repairProcesses
                .flatMap((rp) => rp.partUsages)
                .map(
                  (part) => `
                <tr>
                  <td>${part.PartName}</td>
                  <td>${part.Quantity}</td>
                  <td>${part.PricePerUnit} บาท</td>
                  <td>${(
                    part.Quantity * parseFloat(part.PricePerUnit)
                  ).toFixed(2)} บาท</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>

          <p class="total">ค่าใช้จ่ายทั้งหมด: ${total} บาท</p>
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();

  }
};

export default function report(){
  return (
      <QueryClientProvider client={queryClient}>
        <div>
        <button
                type="button"
                onClick={generatePrintPage}
                className="mt-6 mb-4 ml-20 mr-5 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
              >
                ออกใบเสร็จ
              </button>
        </div>
      </QueryClientProvider>
  );
};