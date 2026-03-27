"use client";
import Sidebar from "../../ui/Sidebar";
import React, { useState, useEffect } from "react";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import Image from "next/image";
import QRPic from "../../../../public/IMG_7329.png";

// Create a QueryClient instance
const queryClient = new QueryClient();

// Fetch Quotation Data
const fetchQuotationData = async () => {
  const response = await fetch(
    "https://bodyworkandpaint.pantook.com/api/Quotationinvoice"
  );
  const data = await response.json();
  return data.data;
};

// Payment Component
const PaymentComponent = ({ total }) => {
  const [qrUrl, setQrUrl] = useState("");
  const [error, setError] = useState("");
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const response = await fetch("/create-charge", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ total }),
        });

        if (!response.ok) {
          throw new Error("Failed to generate QR code");
        }

        const data = await response.json();
        console.log(response);
        // setQrUrl(data.qrCodeUrl);
        if (data.success) {
          setQrUrl(data.qrCodeUrl); // ถ้าสำเร็จ ให้แสดง QR Code
          setError(""); // ล้างข้อความ error
        } else {
          setError(data.error || "เกิดข้อผิดพลาดในการสร้าง QR Code");
        }
      } catch (error) {
        console.error("Error generating QR code:", error);
        setError("Error fetching QR Code: " + error.message);
      }
    };

    generateQRCode();
  }, [total]);

  return (
    <div>
      {qrUrl && (
        <div className="mt-4">
          <img
            src={qrUrl}
            alt="QR Code for Payment"
            width={500}
            height={500}
            className="mb-4"
          />
        </div>
      )}
    </div>
  );
};

function QuotationComponent() {
  const [selectedLicensePlate, setSelectedLicensePlate] = useState("");
  const [laborCost, setLaborCost] = useState(0); // ค่าบริการแรงงาน
  const [discount, setDiscount] = useState(0); // ส่วนลด
  const [vat, setVat] = useState(7); // ภาษีมูลค่าเพิ่ม (ค่าเริ่มต้น 7%)
  const [total, setTotal] = useState(0); // ยอดรวม
  const [paymentMethod, setPaymentMethod] = useState(""); // วิธีการชำระเงิน
  const [showQR, setShowQR] = useState(false); // แสดง QR code
  const [paymentConfirmed, setPaymentConfirmed] = useState(false); // สถานะการชำระเงินสำเร็จ
  const [receiptNumber, setReceiptNumber] = useState(1001); // เริ่มต้นลำดับใบเสร็จ

  const router = useRouter();

  // ฟังก์ชันแปลรายละเอียดปัญหา
  const translateProblemDetails = (problem) => {
    switch (problem) {
      case "Scratch on door":
        return "รอยขีดข่วนที่ประตู";
      case "Broken window":
        return "กระจกแตก";
      case "Engine issue":
        return "ปัญหาเครื่องยนต์";
      default:
        return problem; // ถ้าไม่พบข้อความที่ต้องการแปล ให้คืนค่าเดิม
    }
  };

  useEffect(() => {
    // ตรวจสอบข้อมูลจาก sessionStorage
    const role = sessionStorage.getItem("role");

    if (!role || role !== "รับรถ") {
      router.push("/Loginmain"); // ถ้าไม่ใช่ รับรถ ให้ไปหน้า login
    }
  }, [router]);

  const {
    data: quotations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["quotationData"],
    queryFn: fetchQuotationData,
  });

  const selectedQuotation = quotations?.find(
    (q) => q.LicensePlate === selectedLicensePlate
  );

  useEffect(() => {
    if (selectedQuotation) {
      const partCost = selectedQuotation.repairProcesses
        .flatMap((rp) => rp.partUsages)
        .reduce(
          (acc, part) => acc + part.Quantity * parseFloat(part.PricePerUnit),
          0
        ); // คำนวณค่าอะไหล่
      const subtotal = parseFloat(laborCost) + partCost;
      const discountAmount = (subtotal * parseFloat(discount)) / 100;
      const vatAmount = (subtotal - discountAmount) * (vat / 100);
      const grandTotal = subtotal - discountAmount + vatAmount;
      setTotal(grandTotal.toFixed(2)); // คำนวณยอดรวมทั้งหมด
    }
  }, [laborCost, discount, vat, selectedQuotation]);

  const handlePaymentMethodChange = (e) => {
    const method = e.target.value;
    setPaymentMethod(method);
    setShowQR(method === "qr");
  };

  const handleConfirmPayment = async () => {
    if (!selectedQuotation) return;

    const paymentData = {
      quotationId: selectedQuotation.Quotation_ID,
      total,
      paymentMethod,
      paymentDate: new Date().toISOString(), // วันที่/เวลา การชำระเงินปัจจุบัน
    };
    try {
      console.log(paymentData);
      // ส่งข้อมูลการชำระเงินไปที่ backend ผ่าน API
      await axios.post(
        "https://bodyworkandpaint.pantook.com/api/Payment",
        paymentData
      );

      setPaymentConfirmed(true);
      console.log("การชำระเงินสำเร็จ:", paymentData);
      router.push("/employee/quota");
    } catch (error) {
      console.error("เกิดข้อผิดพลาด:", error);
      // แสดงข้อความผิดพลาดให้กับผู้ใช้
      alert("เกิดข้อผิดพลาดในการชำระเงิน");
    }
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
              .flex { display: flex; justify-content: space-between; }
            </style>
          </head>
          <body>
            <div class="company-header">
              <h1>SapPhun Thawi Service</h1>
              <p>ใบเสร็จลำดับที่: ${receiptNumber}</p>
            </div>
            
            <!-- Customer Info -->
            <div class="flex">
              <div>
                <p><strong>ลูกค้า:</strong> ${
                  selectedQuotation?.customer?.FullName
                }</p>
              </div>
              <div style="text-align: right;">
                <p><strong>เลขที่:</strong> RT-2019100005</p>
                <p><strong>วันที่:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>อ้างอิง:</strong> IVT-201910001</p>
              </div>
            </div>
            
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
                ${selectedQuotation?.repairProcesses
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
            
            <!-- Summary -->
            <div class="flex">
              <div>
                <p><strong>หมายเหตุ:</strong> ใบเสร็จฉบับนี้ยังไม่สมบูรณ์หากไม่ได้รับชำระเงิน</p>
              </div>
              <div style="text-align: right;">
                <p><strong>ยอดไม่รวมภาษี:</strong> ${total} บาท</p>
                <p><strong>ภาษีมูลค่าเพิ่ม (7%):</strong> ${(
                  total * 0.07
                ).toFixed(2)} บาท</p>
                <p class="total"><strong>ยอดรวมทั้งหมด:</strong> ${(
                  total * 1.07
                ).toFixed(2)} บาท</p>
              </div>
            </div>
            
            <div class="flex">
              <div>
                <p><strong>การชำระเงิน:</strong> เช็คธนาคาร / เงินสด / QR</p>
                <p><strong>ลงชื่อ:</strong> ______________________</p>
              </div>
              <div style="text-align: right;">
                <p>วันที่: ______________________</p>
              </div>
            </div>
          </body>
        </html>
      `);
      newWindow.document.close();
      newWindow.focus();
      newWindow.print();

      // เพิ่มลำดับใบเสร็จหลังจากพิมพ์เสร็จ
      setReceiptNumber((prevNumber) => prevNumber + 1);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("ส่งข้อมูลใบเสร็จ", {
      selectedLicensePlate,
      selectedQuotation,
    });
    // ส่งข้อมูลไปที่ backend
  };

  return (
    <div className="flex min-h-screen bg-gray-100 ">
      {/* Sidebar */}
      {/* <Sidebar className="w-80 bg-gray-100 p-4 h-full" /> */}
      <div className="w-44 bg-gray-100 p-4 h-full flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 pt-10 md:pl-20 lg:pl-20 xl:pl-20 md:pr-10 lg:pr-10 xl:pr-10">
        {/* Main Content */}
        <div className="md:max-w-[520px] lg:max-w-[740px] xl:max-w-[980px] 2xl:max-w-[1540px]">
          <h1 className="text-3xl font-bold mb-4">ออกใบเสร็จ</h1>

          <form onSubmit={handleSubmit}>
            {/* เลือกทะเบียนรถ */}
            {/* <div className="mb-4">
              <label
                htmlFor="licensePlate"
                className="block text-sm font-medium text-gray-700"
              >
                เลือกทะเบียนรถ
              </label>
              <select
                className="block w-full p-2 border rounded-md"
                value={selectedLicensePlate}
                onChange={(e) => setSelectedLicensePlate(e.target.value)}
              >
                <option value="">-- เลือกทะเบียนรถ --</option>
                {quotations?.map((q) => (
                  <option key={q.Quotation_ID} value={q.LicensePlate}>
                    {q.LicensePlate}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="mb-4">
              <label
                htmlFor="licensePlate"
                className="block text-sm font-medium text-gray-700"
              >
                เลือกทะเบียนรถ
              </label>
              <input
                type="text"
                // list="licensePlates"
                className="block w-full p-2 border rounded-md"
                value={selectedLicensePlate}
                onChange={(e) => setSelectedLicensePlate(e.target.value)}
                placeholder="พิมพ์เพื่อค้นหาทะเบียนรถ"
              />
              <datalist id="licensePlates">
                {quotations?.map((q) => (
                  <option key={q.Quotation_ID} value={q.LicensePlate}>
                    {q.LicensePlate}
                  </option>
                ))}
              </datalist>
            </div>

            {selectedQuotation && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                {/* Vehicle Info */}
                <h2 className="text-xl font-semibold mb-2">ข้อมูลรถ</h2>
                <p>เจ้าของ: {selectedQuotation.customer.FullName}</p>
                <p>
                  {selectedQuotation.Vehicle.Brand}{" "}
                  {selectedQuotation.Vehicle.Model} ปี{" "}
                  {selectedQuotation.Vehicle.Year}
                </p>
                <p>
                  รายละเอียดการซ่อม:{" "}
                  {translateProblemDetails(selectedQuotation.ProblemDetails)}
                </p>

                {/* Part Table */}
                <h3 className="text-lg font-semibold mt-4 mb-2">
                  รายการอะไหล่และค่าบริการ
                </h3>
                <div className="overflow-x-auto">
                  <div style={{ minWidth: "600px" }}>
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ชื่ออะไหล่
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            จำนวน
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            ราคาต่อหน่วย
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            รวม
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {selectedQuotation.repairProcesses
                          .flatMap((rp) => rp.partUsages)
                          .map((part, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {part.PartName}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {part.Quantity}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {part.PricePerUnit} บาท
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {(
                                  part.Quantity * parseFloat(part.PricePerUnit)
                                ).toFixed(2)}{" "}
                                บาท
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pricing Info */}
                <p className="mt-4 font-semibold">
                  ค่าใช้จ่ายทั้งหมด+Vat 7% : {total} บาท{" "}
                </p>
                {/* Payment Options */}
                <div className="mt-4">
                  <label
                    htmlFor="paymentMethod"
                    className="block text-sm font-medium text-gray-700"
                  >
                    เลือกวิธีการชำระเงิน
                  </label>
                  <select
                    className="block w-full p-2 border rounded-md"
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    <option value="">-- เลือกวิธีการชำระเงิน --</option>
                    <option value="qr">QR Code</option>
                    <option value="cash">เงินสด</option>
                    <option value="credit">บัตรเครดิต/เดบิต</option>
                  </select>
                </div>

                {/* Show QR Code for Payment */}
                {showQR && (
                  <div className="mt-4">
                    {/* Payment Component */}
                    <PaymentComponent total={total} />
                    <h4 className="text-center text-5xl font-bold pb-8">
                      {total} บาท
                    </h4>
                    <button
                      type="button"
                      onClick={handleConfirmPayment}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
                    >
                      ยืนยันการชำระเงิน
                    </button>
                  </div>
                )}

                {/* Confirmation Button for Cash or Credit */}
                {paymentMethod && !showQR && (
                  <button
                    type="button"
                    onClick={handleConfirmPayment}
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
                  >
                    ยืนยันการชำระเงิน
                  </button>
                )}

                {/* Payment Confirmation */}
                {paymentConfirmed && (
                  <div className="mt-4 text-green-500">
                    การชำระเงินสำเร็จแล้ว!
                  </div>
                )}
              </div>
            )}

            {/* Submit Button */}
            {selectedLicensePlate && (
              <button
                type="button"
                onClick={generatePrintPage}
                className="mt-4 mb-4 bg-indigo-600 text-white px-4 py-2 rounded-md shadow hover:bg-indigo-700"
              >
                ออกใบเสร็จ
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default function Quotation() {
  return (
    <QueryClientProvider client={queryClient}>
      <QuotationComponent />
    </QueryClientProvider>
  );
}
