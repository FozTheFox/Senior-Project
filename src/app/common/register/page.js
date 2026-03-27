"use client";
import Head from "next/head";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Register() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone_number: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบว่ารหัสผ่านและการยืนยันรหัสผ่านตรงกันหรือไม่
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }

    // ส่งข้อมูลไปยัง API
    const response = await fetch('https://bodyworkandpaint.pantook.com/api/sign-Up', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      // การส่งข้อมูลสำเร็จ
      console.log("Registration successful");
      router.push("/common/login");
    } else {
      // การส่งข้อมูลล้มเหลว
      console.log("Registration failed");
    }
  };
  return (
    <div className="w-full h-screen flex justify-center items-center ">
      <div className="w-3/12 rounded-lg p-10 bg-white shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Sign Up</h2>
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
          <div className="flex gap-3">
            <label className="block mb-2">
              <span className="text-gray-700">ชื่อ</span>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="block w-full p-2 text-sm border rounded-lg text-gray-700"
                placeholder="ชื่อ"
              />
            </label>
            <label className="block mb-2">
              <span className="text-gray-700">นามสกุล</span>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="block w-full p-2 text-sm border rounded-lg text-gray-700"
                placeholder="นามสกุล"
              />
            </label>
          </div>
          <label className="block mb-2">
            <span className="text-gray-700">เบอร์โทร</span>
            <input
              type="text"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              className="block w-full p-2 text-sm border rounded-lg text-gray-700"
              placeholder="09********"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">ชื่อผู้ใช้งาน</span>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="block w-full p-2 text-sm border rounded-lg text-gray-700"
              placeholder="ชื่อผู้ใช้งาน"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">อีเมล</span>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="block w-full p-2 text-sm border rounded-lg text-gray-700"
              placeholder="example@example.com"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">รหัสผ่าน</span>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="block w-full p-2 text-sm border rounded-lg text-gray-700"
              placeholder="********"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">ยืนยันรหัสผ่าน</span>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="block w-full p-2 text-sm border rounded-lg text-gray-700"
              placeholder="********"
            />
          </label>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 flex justify-center w-7/12 rounded-lg"
            >
              สมัครสมาชิก
            </button>
          </div>
        </form>
        <p className="text-sm text-gray-600 my-4 text-center">
          Already have an account?{" "}
          <a
            href="/common/login"
            className="text-orange-500 hover:text-orange-700"
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
