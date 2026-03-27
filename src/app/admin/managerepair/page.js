"use client";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Sidebar from "../../ui/Sidebar";
import { useRouter } from "next/navigation";

const PartsPopup = ({ onClose, onSelect, parts, selectedParts, stepId }) => {
  const handleSelect = (part) => {
    onSelect(stepId, part); // ส่ง stepId เพื่อแยกการเลือกอะไหล่ตามขั้นตอน
  };

  const isPartSelected = useCallback(
    (partId) => {
      const selected = selectedParts?.[stepId]?.some(
        (part) => part.Part_ID === partId
      );
      return selected;
    },
    [selectedParts, stepId]
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

const SelectedParts = ({
  selectedParts,
  stepId,
  onDelete,
  onQuantityChange,
}) => {
  const partsForStep = selectedParts[stepId] || [];

  return (
    <div>
      {partsForStep.length > 0 && (
        <>
          <h2 className="text-lg font-bold mb-4">รายการอะไหล่ที่เลือก</h2>
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border-b">ชื่ออะไหล่</th>
                <th className="py-2 px-4 border-b">เลือกจำนวน</th>
                <th className="py-2 px-4 border-b"></th>
              </tr>
            </thead>
            <tbody>
              {partsForStep.map((part) => (
                <tr key={part.Part_ID} className="hover:bg-gray-100">
                  <td className="py-2 px-4 border-b text-center">
                    {part.Name}
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <input
                      type="number"
                      min="1"
                      value={part.quantity || 1} // กำหนดค่าเริ่มต้นเป็น 1
                      onChange={(e) =>
                        onQuantityChange(stepId, part.Part_ID, e.target.value)
                      }
                      className="border rounded p-1 w-20 text-center"
                    />
                  </td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      onClick={() => onDelete(stepId, part.Part_ID)}
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

function RepairManagement() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [repairSteps, setRepairSteps] = useState([]);
  const [selectedSteps, setSelectedSteps] = useState([]);
  const [selectedParts, setSelectedParts] = useState({});
  const [parts, setParts] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupStepId, setPopupStepId] = useState(null); // เก็บค่า stepId สำหรับ Popup
  const [stepDetails, setStepDetails] = useState({});

  const router = useRouter();

  const fetchParts = async () => {
    try {
      const response = await axios.get(
        "https://bodyworkandpaint.pantook.com/api/partsAdmin"
      );
      const filteredParts = response.data.data.filter((part) => {
        return (
          part.Brand === selectedVehicle.Brand &&
          part.Model === selectedVehicle.Model &&
          part.Year === selectedVehicle.Year
        );
      });
      setParts(filteredParts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    axios
      .get("https://bodyworkandpaint.pantook.com/api/quotations")
      .then((response) => {
        console.log("Vehicles data:", response.data.data); // ตรวจสอบข้อมูลยานพาหนะ
        setVehicles(response.data.data);
      })
      .catch((error) => console.error("Error fetching vehicles:", error));
  }, []);

  useEffect(() => {
    if (selectedVehicle) {
      axios
        .get("https://bodyworkandpaint.pantook.com/api/repair_steps")
        .then((response) => {
          console.log("Repair steps data:", response.data.data); // ตรวจสอบข้อมูลขั้นตอนการซ่อม
          setRepairSteps(response.data.data);
        })
        .catch((error) => console.error("Error fetching repair steps:", error));
    }
  }, [selectedVehicle]);

  const handleVehicleSelect = (vehicleId) => {
    console.log("Selected Vehicle ID:", vehicleId, typeof vehicleId); // ตรวจสอบ ID ของยานพาหนะที่เลือก
    const vehicle = vehicles.find((v) => v.Quotation_ID == vehicleId);
    console.log("Selected Vehicle Object:", vehicle); // ตรวจสอบวัตถุยานพาหนะที่พบ
    setSelectedVehicle(vehicle);
  };

  const handleStepSelect = (stepId) => {
    setSelectedSteps((prevSteps) => {
      if (prevSteps.includes(stepId)) {
        // ถ้า stepId มีอยู่ใน selectedSteps ให้เอาออก
        return prevSteps.filter((id) => id !== stepId);
      } else {
        // ถ้า stepId ยังไม่มีใน selectedSteps ให้เพิ่มเข้าไป
        return [...prevSteps, stepId];
      }
    });
  };

  // ในฟังก์ชัน RepairManagement
  const handleQuantityChange = (stepId, partId, quantity) => {
    setSelectedParts((prevParts) => {
      const updatedParts = prevParts[stepId].map((part) => {
        if (part.Part_ID === partId) {
          return { ...part, quantity: Number(quantity) };
        }
        return part;
      });
      return { ...prevParts, [stepId]: updatedParts };
    });
  };

  const handlePartSelect = (stepId, part) => {
    setSelectedParts((prevParts) => {
      if (!prevParts[stepId]) {
        return { ...prevParts, [stepId]: [part] };
      } else {
        const existingParts = prevParts[stepId];
        if (existingParts.some((p) => p.Part_ID === part.Part_ID)) {
          return prevParts;
        } else {
          return { ...prevParts, [stepId]: [...existingParts, part] };
        }
      }
    });
  };

  const handlePartDelete = (stepId, partId) => {
    setSelectedParts((prevParts) => {
      const existingParts = prevParts[stepId];
      return {
        ...prevParts,
        [stepId]: existingParts.filter((part) => part.Part_ID !== partId),
      };
    });
  };

  const handleShowPopup = (stepId) => {
    setPopupStepId(stepId);
    if (selectedVehicle) {
      fetchParts();
    }
    setShowPopup(true);
  };

  const handleDetailChange = (stepId, detail) => {
    setStepDetails((prevDetails) => ({
      ...prevDetails,
      [stepId]: detail,
    }));
  };

  const handleSave = async () => {
    try {
      // Step 1: ส่งข้อมูลไปที่ repair_processes เพื่อสร้าง Process_ID
      const processResponses = await Promise.all(
        selectedSteps.map((stepId) =>
          axios.post(
            "https://bodyworkandpaint.pantook.com/api/repair_processes",
            {
              Quotation_ID: selectedVehicle.Quotation_ID,
              licenseplate: selectedVehicle.licenseplate,
              Step_ID: stepId,
            }
          )
        )
      );

      const processIds = processResponses.map(
        (response) => response.data.Process_ID
      );

      // Step 2: อัปเดตสถานะของ Quotation
      const updateQuotationStatus = axios.put(
        "https://bodyworkandpaint.pantook.com/api/quotationsupdateStatus",
        { Quotation_ID: selectedVehicle.Quotation_ID }
      );

      // Step 3: อัปเดต repair-process ด้วย Description
      const updateProcesses = Promise.all(
        processIds.map((processId, index) =>
          axios.put(
            "https://bodyworkandpaint.pantook.com/api/repair-processUpdate",
            {
              Process_ID: processId,
              Description: stepDetails[selectedSteps[index]] || "",
            }
          )
        )
      );

      await Promise.all([updateQuotationStatus, updateProcesses]);

      // Step 4: บันทึกการใช้งานอะไหล่
      const partUsageRequests = [];
      selectedSteps.forEach((stepId, index) => {
        const partsForStep = selectedParts[stepId] || [];
        partsForStep.forEach((part) => {
          partUsageRequests.push(
            axios.post("https://bodyworkandpaint.pantook.com/api/part_usage", {
              Part_ID: part.Part_ID,
              Process_ID: processIds[index],
              Quantity: part.quantity || 1,
            })
          );
        });
      });

      await Promise.all(partUsageRequests);

      alert("บันทึกข้อมูลสำเร็จ!");
      // ล้างค่า state
      setSelectedVehicle(null);
      setSelectedSteps([]);
      setSelectedParts({});
      setStepDetails({});
      // เปลี่ยนเส้นทางไปยังหน้าอื่น
      router.push("/admin/process");
    } catch (error) {
      console.error("Error saving data:", error);
      console.log("log Error saving data:", error);
      alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
    }
  };

  return (
    <div className="flex h-screen">
      {showPopup && (
        <PartsPopup
          onClose={() => setShowPopup(false)}
          selectedParts={selectedParts}
          onSelect={handlePartSelect}
          parts={parts}
          stepId={popupStepId} // ส่งค่า stepId ให้ Popup
        />
      )}
      <Sidebar className="w-80 bg-gray-100 p-4 h-full" />
      <div className="flex-1 pt-10 md:px-20 lg:px-20 xl:px-20">
        <div className="p-2 pl-52">
          <h1 className="text-3xl font-bold mb-4">จัดการรถรอซ่อม</h1>

          <div className="mb-6">
            <label className="block text-gray-700"> เลือกรถที่รอเข้าซ่อม</label>
            <select
              className="mt-1 p-2 border rounded-lg w-full"
              value={selectedVehicle?.Quotation_ID || ""}
              onChange={(e) => {
                console.log("Dropdown selected value:", e.target.value); // ตรวจสอบค่าที่เลือกจาก dropdown
                handleVehicleSelect(e.target.value);
              }}
            >
              <option value="">เลือกรถที่รอเข้าซ่อม</option>
              {vehicles.map((vehicle) => (
                <option key={vehicle.Quotation_ID} value={vehicle.Quotation_ID}>
                  {vehicle.licenseplate}
                </option>
              ))}
            </select>
          </div>

          {selectedVehicle && (
            <div>
              <h2 className="text-lg font-bold mb-4">เลือกขั้นตอนซ่อม</h2>
              <div className="mb-6 grid grid-cols-2 gap-4">
                {repairSteps.map((step) => (
                  <div
                    key={step.Step_ID}
                    className="bg-white border p-4 rounded shadow hover:shadow-lg transition"
                  >
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="form-checkbox h-5 w-5 text-blue-600"
                        value={step.Step_ID}
                        checked={selectedSteps.includes(step.Step_ID)}
                        onChange={() => handleStepSelect(step.Step_ID)}
                      />
                      <span className="ml-2">{step.StepName}</span>
                    </label>
                  </div>
                ))}
              </div>

              {selectedSteps.length > 0 && (
                <div>
                  <h2 className="text-lg font-bold mb-4">
                    รายการขั้นตอนที่เลือก
                  </h2>
                  {selectedSteps
                    .slice() // สร้างสำเนาของ selectedSteps เพื่อไม่ให้เปลี่ยนแปลง array ต้นฉบับ
                    .sort((a, b) => a - b) // เรียงลำดับตาม Step_ID
                    .map((stepId) => (
                      <div key={stepId} className="mb-6 bg-white border p-4 rounded-2xl">
                        <div className="flex justify-between items-center mb-2 ">
                          <h3 className="pl-6 font-bold">
                            {
                              repairSteps.find(
                                (step) => step.Step_ID === stepId
                              )?.StepName
                            }
                          </h3>
                          {repairSteps.find((step) => step.Step_ID === stepId)
                            ?.StepName !== "ตรวจสอบคุณภาพ" && ( // ตรวจสอบชื่อขั้นตอน
                            <button
                              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
                              onClick={() => handleShowPopup(stepId)}
                            >
                              เลือกอะไหล่
                            </button>
                          )}
                        </div>
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700">
                            รายละเอียด
                          </label>
                          <input
                            type="text"
                            value={stepDetails[stepId] || ""}
                            onChange={(e) =>
                              handleDetailChange(stepId, e.target.value)
                            }
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                          />
                        </div>
                        <SelectedParts
                          selectedParts={selectedParts}
                          stepId={stepId}
                          onDelete={handlePartDelete}
                          onQuantityChange={handleQuantityChange}
                        />
                      </div>
                    ))}
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg mt-4"
                    onClick={handleSave}
                  >
                    บันทึก
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RepairManagement;
