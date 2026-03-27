'use client'
import { useState } from "react";
import Topbar from "../../ui/Topbar";

export default function RepairTracking() {
  const [steps, setSteps] = useState([
    { name: "ถอด", status: "เสร็จสิ้น", images: [], completed: true },
    { name: "เคาะ", status: "เสร็จสิ้น", images: [], completed: true },
    { name: "โป้ว", status: "เสร็จสิ้น", images: [], completed: true },
    { name: "ขัดโป้ว", status: "เสร็จสิ้น", images: [], completed: true },
    { name: "พ่นสี", status: "เสร็จสิ้น", images: [], completed: true },
    { name: "ขัดสี", status: "รอดำเนินการ", images: [], completed: false },
    { name: "ประกอบ", status: "รอดำเนินการ", images: [], completed: false },
    { name: "ขัดเงา", status: "รอดำเนินการ", images: [], completed: false },
    { name: "ล้าง", status: "รอดำเนินการ", images: [], completed: false },
  ]);

  const handleImageUpload = (index, files) => {
    const newSteps = [...steps];
    newSteps[index].images = Array.from(files);
    newSteps[index].completed = true;
    setSteps(newSteps);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between">
      <Topbar />
      <div className="bg-white   p-10 pt-10 flex-grow">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-base font-bold">ติดตามกระบวนการซ่อม</h1>
          <div className="flex space-x-2">
            <input
              type="text"
              className="p-1 border rounded-lg text-sm"
              placeholder="กค-2355"
            />
            <button className="bg-black text-white px-3 py-1 rounded-lg text-sm">
              ติดตาม
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between bg-black text-white p-3 rounded-lg">
          <div>
            <h2 className="text-base">D-MAX</h2>
            <p className="text-sm">กค-2355</p>
          </div>
          <div className="text-sm">15 เม.ย. 67</div>
        </div>

        <div className="mt-4">
          <h3 className="text-sm font-semibold mb-2">สถานะ: กำลังดำเนินการ</h3>
          <div className="grid grid-cols-4 gap-2">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg shadow-md ${
                  step.completed ? "bg-green-100" : "bg-red-100"
                }`}
              >
                <h4 className="font-semibold text-center text-sm">{step.name}</h4>
                <p className="text-xs text-center">{step.status}</p>
                <div className="mt-2 grid grid-cols-3 gap-1">
                  {step.completed ? (
                    step.images.length > 0 ? (
                      step.images.map((image, idx) => (
                        <img
                          key={idx}
                          src={URL.createObjectURL(image)}
                          alt={`Step ${step.name} - ${idx}`}
                          className="w-full h-12 object-cover"
                        />
                      ))
                    ) : (
                      <p className="text-center text-xs">ยังไม่มีรูป</p>
                    )
                  ) : (
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(index, e.target.files)}
                      className="col-span-3"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <div className="relative pt-1">
            <div className="overflow-hidden h-1 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: "45%" }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
            <span className="text-xs">45%</span>
          </div>
        </div>
      </div>
      <footer className="bg-gray-200 p-3 text-center">
        <p className="text-xs">Footer content</p>
      </footer>
    </div>
  );
}
