"use client"; // ทำให้คอมโพเนนต์นี้เป็น Client Component

import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaGoogle } from "react-icons/fa"; // นำเข้าไอคอน Google

function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [userStatus, setUserStatus] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("https://bodyworkandpaint.pantook.com/api/logincustomer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    console.log("User status:", data);
    if (data.status === "success") {
      sessionStorage.setItem("user", JSON.stringify(data.user));
      router.push("/common/findcar");
    } else {
      setError(data.message);
    }
  };

  useEffect(() => {
    const checkUserStatus = async () => {
      if (session) {
        try {
          console.log("Session:", session);
          const response = await fetch(
            "https://bodyworkandpaint.pantook.com/api/check-google-user",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${session.accessToken}`,
              },
              body: JSON.stringify({
                google_id: session.accessToken,
                email: session.user.email,
                profile_image: session.user.image,
                username: session.user.name,
              }),
            }
          );

          const data = await response.json();
          sessionStorage.setItem("user", JSON.stringify(data.user));
          console.log("User status data:", data); 
          setUserStatus(data.status);
        } catch (error) {
          console.error("Error fetching user status:", error);
        }
      }
    };

    checkUserStatus();
  }, [session]);

  useEffect(() => {
    console.log("User status:", userStatus); 
    if (userStatus === "new_user") {
      router.push("/common/fill-information");
    } else if (userStatus === "existing_user") {
      router.push("/common/findcar");
    }
  }, [userStatus, router]);

  return (
    <div className="w-full h-screen flex justify-center items-center bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">เข้าสู่ระบบ</h2>
        <form className="flex flex-col gap-y-4" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700">อีเมล</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full p-2 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="example@example.com"
            />
          </label>
          <label className="block">
            <span className="text-gray-700">รหัสผ่าน</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-2 text-sm border border-gray-300 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="********"
            />
          </label>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-lg w-full md:w-8/12"
            >
              Login
            </button>
          </div>
        </form>
        <div className="flex justify-center mt-6">
          <button
            onClick={() => signIn("google")}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded-lg w-full flex items-center justify-center gap-2"
          >
            <FaGoogle className="w-5 h-5" /> {/* ใช้ไอคอน Google */}
            Login with Google
          </button>
        </div>
        <p className="text-sm text-gray-600 my-4 text-center">
          Don't have an account?{" "}
          <a href="register" className="text-orange-500 hover:text-orange-700">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
