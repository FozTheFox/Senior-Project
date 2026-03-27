import { MdCarRepair,MdHome } from "react-icons/md";
import { FaPeopleGroup,FaPhoneFlip } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";


export default function Topbaremployee(){
    return (
        <div className="px-6 p-3 w-screen h-20 lg:w- bg-white flex flex-col shadow-lg">
            <div className="grid sm:grid-cols-6 gap-5">
                <div className="justify-start items-start gap-4 border-r border-gray-100">
                    <h1 className="text-2xl font-bold text-blue-900">SapPhun Thawi</h1>
                    <span className="text-xl px-14 text-blue-900">Service</span>
                </div>
                <div className="border-r border-gray-100 pb-4">
                    <a href="#">
                        <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                            <MdHome className="text-2xl text-gray-600 group-hover:text-white"/>  {/* npm install react-icons --save */}
                            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">หน้าแรก</h3>
                        </div>
                    </a>
                </div>
                <div className="border-r border-gray-100 pb-4">
                    <a href="#">
                        <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                            <FaPeopleGroup className="text-2xl text-gray-600 group-hover:text-white"/>  {/* npm install react-icons --save */}
                            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">เกี่ยวกับเรา</h3>
                        </div>
                    </a>
                </div>
                <div className="border-r border-gray-100 pb-4">
                    <a href="findcar">
                        <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                            <MdCarRepair className="text-2xl text-gray-600 group-hover:text-white"/>  
                            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">ตรวจสอบสถานะรถ</h3>
                        </div>
                    </a>
                </div>
                <div className="border-r border-gray-100 pb-4">
                    <a href="contact">
                        <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                            <FaPhoneFlip className="text-2xl text-gray-600 group-hover:text-white"/>  
                            <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">ติดต่อเรา</h3>
                        </div>
                    </a>
                </div>
                <div className="border-r border-gray-100 pb-4">
                    <a href="login">
                    <div className="flex my-2 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                        <CgProfile className="text-2xl text-gray-600 group-hover:text-white"/>
                        <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">Login</h3>
                    </div>
                    </a>
                </div>
            </div>
        </div>
    );

}