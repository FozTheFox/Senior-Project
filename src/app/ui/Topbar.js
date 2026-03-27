"use client";
import { MdCarRepair, MdHome } from "react-icons/md";
import { FaPeopleGroup, FaPhoneFlip } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";

export default function Topbar() {
  const { data: session, status } = useSession();
  const [user, setUser] = useState(null);
  const [isMenuOpen, setMenuOpen] = useState(false); // สำหรับควบคุมเมนู hamburger

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleSignOut = () => {
    sessionStorage.removeItem("user");
    setUser(null);
  };

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };

  return (
    <div className="px-6 p-3 w-screen h-20 bg-white flex flex-col shadow-lg">
      <div className="flex justify-between items-center">
        {/* ข้อความและไอคอนบนมือถือและ iPad */}
        <div
          className="justify-start items-start gap-4"
          style={{ marginRight: "60px" }}
        >
          <h1 className="text-2xl font-bold text-blue-900">SapPhun Thawi</h1>
          <span className="text-xl px-14 text-blue-900">Service</span>
          {/* <MdHome className="text-2xl text-gray-600  hidden lg:block" /> */}
        </div>

        {/* Hamburger menu สำหรับขนาดหน้าจอมือถือ */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-2xl">
            ☰
          </button>
        </div>

        {/* เมนูปกติสำหรับขนาดหน้าจอใหญ่ */}
        <div className="hidden md:flex lg:gap-3 justify-end w-full">
          {/* <a href="#">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <FaPeopleGroup className="text-2xl text-gray-600 hidden md:block" />
              <h3 className="text-base text-gray-800 font-semibold hidden xl:block">
                เกี่ยวกับเรา
              </h3>
            </div>
          </a> */}
          <a href="findcar">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <MdCarRepair className="text-2xl text-gray-600 hidden md:block" />
              <h3 className="text-base text-gray-800 font-semibold hidden xl:block">
                ตรวจสอบสถานะรถ
              </h3>
            </div>
          </a>
          {/* <a href="contact">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <FaPhoneFlip className="text-2xl text-gray-600 hidden md:block" />
              <h3 className="text-base text-gray-800 font-semibold hidden xl:block">
                ติดต่อเรา
              </h3>
            </div>
          </a> */}
          <a href="history">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <CgProfile className="text-2xl text-gray-600 hidden md:block" />
              <h3 className="text-base text-gray-800 font-semibold hidden xl:block">
                ประวัติ
              </h3>
            </div>
          </a>
          {session ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                signOut();
                sessionStorage.removeItem("user");
                setUser(null);
              }}
            >
              <div
                className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
                style={{ marginRight: "30px" }}
              >
                <CgProfile className="text-2xl text-gray-600" />
                <h3 className="text-base text-gray-800 font-semibold">
                  ออกจากระบบ
                </h3>
              </div>
            </a>
          ) : user ? (
            <a
              href="#"
              onClick={handleSignOut}
              className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
              style={{ marginRight: "30px" }}
            >
              <CgProfile className="text-2xl text-gray-600" />
              <h3 className="text-base text-gray-800 font-semibold">
                ออกจากระบบ
              </h3>
            </a>
          ) : (
            <a href="login">
              <div
                className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
                style={{ marginRight: "30px" }}
              >
                <CgProfile className="text-2xl text-gray-600" />
                <h3 className="text-base text-gray-800 font-semibold">
                  เข้าสู่ระบบ
                </h3>
              </div>
            </a>
          )}
        </div>
      </div>

      {/* Hamburger menu dropdown สำหรับขนาดหน้าจอมือถือ */}
      {isMenuOpen && (
        <div className="lg:hidden flex flex-col gap-4 mt-3 bg-white rounded-lg">
          <a href="#">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <FaPeopleGroup className="text-2xl text-gray-600" />
              <h3 className="text-base text-gray-800 font-semibold">
                เกี่ยวกับเรา
              </h3>
            </div>
          </a>
          <a href="findcar">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <MdCarRepair className="text-2xl text-gray-600" />
              <h3 className="text-base text-gray-800 font-semibold">
                ตรวจสอบสถานะรถ
              </h3>
            </div>
          </a>
          <a href="contact">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <FaPhoneFlip className="text-2xl text-gray-600" />
              <h3 className="text-base text-gray-800 font-semibold">
                ติดต่อเรา
              </h3>
            </div>
          </a>
          <a href="history">
            <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
              <CgProfile className="text-2xl text-gray-600" />
              <h3 className="text-base text-gray-800 font-semibold">ประวัติ</h3>
            </div>
          </a>
          {session ? (
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                signOut();
                sessionStorage.removeItem("user");
                setUser(null);
              }}
            >
              <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
                <CgProfile className="text-2xl text-gray-600" />
                <h3 className="text-base text-gray-800 font-semibold">
                  ออกจากระบบ
                </h3>
              </div>
            </a>
          ) : user ? (
            <a
              href="#"
              onClick={handleSignOut}
              className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg"
            >
              <CgProfile className="text-2xl text-gray-600" />
              <h3 className="text-base text-gray-800 font-semibold">
                ออกจากระบบ
              </h3>
            </a>
          ) : (
            <a href="login">
              <div className="flex items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg">
                <CgProfile className="text-2xl text-gray-600" />
                <h3 className="text-base text-gray-800 font-semibold">
                  เข้าสู่ระบบ
                </h3>
              </div>
            </a>
          )}
        </div>
      )}
    </div>
  );
}

//-----------------------อันแรก
// "use client";
// import { MdCarRepair, MdHome } from "react-icons/md";
// import { FaPeopleGroup, FaPhoneFlip } from "react-icons/fa6";
// import { CgProfile } from "react-icons/cg";
// import { useSession, signOut } from "next-auth/react";
// import { useState, useEffect } from "react";

// export default function Topbar() {
//   const { data: session, status } = useSession();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // ดึงข้อมูลผู้ใช้จาก sessionStorage
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   const handleSignOut = () => {
//     // ลบข้อมูลผู้ใช้จาก sessionStorage
//     sessionStorage.removeItem("user");
//     setUser(null);
//   };

//   return (
//     <div className="px-6 p-3 w-screen h-20 lg:w- bg-white flex flex-col shadow-lg">
//       <div className="grid sm:grid-cols-6 gap-5">
//         <div className="justify-start items-start gap-4 border-r border-gray-100">
//           <h1 className="text-2xl font-bold text-blue-900 hidden lg:block">SapPhun Thawi</h1>
//           <span className="text-xl px-14 text-blue-900 hidden lg:block">Service</span>
//           <MdHome className="text-2xl text-gray-600 block lg:hidden" />
//         </div>
//         <div className="border-r border-gray-100 pb-4">
//           <a href="#">
//             <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//               <FaPeopleGroup className="text-2xl text-gray-600 hidden lg:block" />
//               <h3 className="text-base text-gray-800 hidden lg:block font-semibold">เกี่ยวกับเรา</h3>
//               <FaPeopleGroup className="text-2xl text-gray-600 block lg:hidden" />
//             </div>
//           </a>
//         </div>
//         <div className="border-r border-gray-100 pb-4">
//           <a href="findcar">
//             <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//               <MdCarRepair className="text-2xl text-gray-600 hidden lg:block" />
//               <h3 className="text-base text-gray-800 hidden lg:block font-semibold">ตรวจสอบสถานะรถ</h3>
//               <MdCarRepair className="text-2xl text-gray-600 block lg:hidden" />
//             </div>
//           </a>
//         </div>
//         <div className="border-r border-gray-100 pb-4">
//           <a href="contact">
//             <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//               <FaPhoneFlip className="text-2xl text-gray-600 hidden lg:block" />
//               <h3 className="text-base text-gray-800 hidden lg:block font-semibold">ติดต่อเรา</h3>
//               <FaPhoneFlip className="text-2xl text-gray-600 block lg:hidden" />
//             </div>
//           </a>
//         </div>
//         <div className="border-r border-gray-100 pb-4">
//           {session ? (
//             <a
//               href="#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 signOut();
//               }}
//             >
//               <div className="flex my-2 justify-start items-center gap-4 px-5 bg-red-500 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//                 <CgProfile className="text-2xl text-gray-600 hidden lg:block" />
//                 <h3 className="text-base text-gray-800 hidden lg:block font-semibold">Sign Out</h3>
//                 <CgProfile className="text-2xl text-gray-600 block lg:hidden" />
//               </div>
//             </a>
//           ) : user ? (
//             <a
//               href="#"
//               onClick={handleSignOut}
//               className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
//             >
//               <CgProfile className="text-2xl text-gray-600 hidden lg:block" />
//               <h3 className="text-base text-gray-800 hidden lg:block font-semibold">ออกจากระบบ</h3>
//               <CgProfile className="text-2xl text-gray-600 block lg:hidden" />
//             </a>
//           ) : (
//             <a href="login">
//               <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//                 <CgProfile className="text-2xl text-gray-600 hidden lg:block" />
//                 <h3 className="text-base text-gray-800 hidden lg:block font-semibold">Login</h3>
//                 <CgProfile className="text-2xl text-gray-600 block lg:hidden" />
//               </div>
//             </a>
//    )}
//         </div>
//       </div>
//     </div>
//   );
// }
//-----------------------อันแรก
// return (
//   <div className="px-6 p-3 w-screen h-20 lg:w- bg-white flex flex-col shadow-lg">
//     <div className="grid sm:grid-cols-6 gap-5">
//       <div className="justify-start items-start gap-4 border-r border-gray-100">
//         <h1 className="text-2xl font-bold text-blue-900">SapPhun Thawi</h1>
//         <span className="text-xl px-14 text-blue-900">Service</span>
//       </div>
//       <div className="border-r border-gray-100 pb-4">
//         <a href="#">
//           <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//             <MdHome className="text-2xl text-gray-600 group-hover:text-white" />{" "}
//             {/* npm install react-icons --save */}
//             <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
//               หน้าแรก
//             </h3>
//           </div>
//         </a>
//       </div>
//       <div className="border-r border-gray-100 pb-4">
//         <a href="#">
//           <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//             <FaPeopleGroup className="text-2xl text-gray-600 group-hover:text-white" />{" "}
//             {/* npm install react-icons --save */}
//             <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
//               เกี่ยวกับเรา
//             </h3>
//           </div>
//         </a>
//       </div>
//       <div className="border-r border-gray-100 pb-4">
//         <a href="findcar">
//           <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//             <MdCarRepair className="text-2xl text-gray-600 group-hover:text-white" />
//             <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
//               ตรวจสอบสถานะรถ
//             </h3>
//           </div>
//         </a>
//       </div>
//       <div className="border-r border-gray-100 pb-4">
//         <a href="contact">
//           <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//             <FaPhoneFlip className="text-2xl text-gray-600 group-hover:text-white" />
//             <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
//               ติดต่อเรา
//             </h3>
//           </div>
//         </a>
//       </div>
//       <div className="border-r border-gray-100 pb-4">
//         {/* <a href="login">
//                   <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//                       <CgProfile className="text-2xl text-gray-600 group-hover:text-white"/>
//                       <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">Login</h3>
//                   </div>
//                   </a> */}
//         {session ? (
//           <a
//             href="#"
//             onClick={(e) => {
//               e.preventDefault();
//               signOut();
//             }}
//           >
//             <div className="flex my-2 justify-start items-center gap-4 px-5 bg-red-500 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//               <CgProfile className="text-2xl text-gray-600 group-hover:text-white" />
//               <h3 className="text-base text-gray-800 group-hover:text-white  font-semibold">
//                 Sign Out
//               </h3>
//             </div>
//           </a>
//         ) : user ? (
//           <a
//             href="#"
//             onClick={handleSignOut}
//             className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto"
//           >
//             <CgProfile className="text-2xl text-gray-600 group-hover:text-white" />
//             <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
//               ออกจากระบบ
//             </h3>
//           </a>
//         ) : (
//           <a href="login">
//             <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
//               <CgProfile className="text-2xl text-gray-600 group-hover:text-white" />
//               <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
//                 Login
//               </h3>
//             </div>
//           </a>
//         )}
//       </div>
//     </div>
//   </div>
// );
