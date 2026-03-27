import Sidebar from "../../../ui/Sidebar";
import { CgProfile } from "react-icons/cg";
import { FaHouseUser } from "react-icons/fa";
import { 
    FaCar,
    FaShieldAlt
} from "react-icons/fa";
import { FaScrewdriverWrench } from "react-icons/fa6";



export default function set_car(){
    return (
        <div>
            <Sidebar/>
            <div className="p-10 px-72 bg-gray-100">
                <div className="mb-6 gap-5 grid sm:grid-cols-5">
                    <a href="set_emp">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                       <CgProfile className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าพนักงาน</strong>
                    </div>
                    </a>
                    <a href="set_cus">
                    <div className="max-h-[150px] max-w-[350px] bg-gray-600 dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaHouseUser className="my-1 text-9xl text-white group-hover:text-white"/>
                        <strong className="my-1 text-base text-white group-hover:text-white font-semibold">ตั้งค่าลูกค้า</strong>
                        
                    </div>
                    </a>
                    <a href="set_car">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaCar className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่ารถ</strong>
                        
                    </div>
                    </a>
                    <a href="set_insu">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaShieldAlt className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าบริษัทประกัน</strong>
                        
                    </div>
                    </a>
                    <a href="set_part">
                    <div className="max-h-[150px] max-w-[350px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl justify-center items-center flex flex-col px-5 p-2 hover:bg-gray-900 group cursor-pointer hover:shadow-lg m-auto">
                        <FaScrewdriverWrench className="my-1 text-9xl text-gray-600 group-hover:text-white"/>
                        <strong className="my-1 text-base text-black group-hover:text-white font-semibold">ตั้งค่าอะไหล่</strong>
                        
                    </div>
                    </a>
                </div>
                <div className="mb-6 gap-80 grid sm:grid-cols-12">
                    <div className="w-72 h-96 overflow-y-auto bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
                        <div className="my-4 border-b border-gray-100 pb-4 items-center justify-center">
                        <div className="grid sm:grid-cols-2 mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                <strong className="text-base text-gray-800 group-hover:text-white font-semibold">ประวิติ</strong>
                                <span className="text-base text-gray-800 group-hover:text-white font-semibold">กท 1030</span>
                            </div>
                            <div className="grid sm:grid-cols-2 mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                <strong className="text-base text-gray-800 group-hover:text-white font-semibold">พัดทะรพล</strong>
                                <span className="text-base text-gray-800 group-hover:text-white font-semibold">ษศ 9869</span>
                            </div>
                            <div className="grid sm:grid-cols-2 mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                <strong className="text-base text-gray-800 group-hover:text-white font-semibold">มณีสว่าน</strong>
                                <span className="text-base text-gray-800 group-hover:text-white font-semibold">ธณ 6910</span>
                            </div>
                            <div className="grid sm:grid-cols-2 mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                <strong className="text-base text-gray-800 group-hover:text-white font-semibold">จักรกิต</strong>
                                <span className="text-base text-gray-800 group-hover:text-white font-semibold">ผญ 2583</span>
                            </div>
                            <div className="grid sm:grid-cols-2 mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                <strong className="text-base text-gray-800 group-hover:text-white font-semibold">พร้อมพงษ์</strong>
                                <span className="text-base text-gray-800 group-hover:text-white font-semibold">2กย 5555</span>
                            </div>
                            <div className="grid sm:grid-cols-2 mb-4 justify-start items-center gap-4 px-5 hover:bg-gray-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                <strong className="text-base text-gray-800 group-hover:text-white font-semibold">สวัสดี</strong>
                                <span className="text-base text-gray-800 group-hover:text-white font-semibold">ธร 1928</span>
                            </div>
                        </div>
                    </div>
                    <div className="min-h-[550px] min-w-[620px] bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl flex flex-col">
                        <div className="m-4 gap-32 grid sm:grid-cols-3">
                            <div className="flex flex-col my-2 min-h-[500px] min-w-[300px]">
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">รหัสลูกค้า</span>
                                    <input type="text" className="block w-[580px] p-2  text-sm border border-gray-800 rounded-xl   text-gray-700" placeholder=""/>
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">ชื่อ-นามสกุลลูกค้า</span>
                                    <input type="text" className="block w-[580px] p-2  text-sm border border-gray-800 rounded-xl   text-gray-700" placeholder=""/>
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">เบอร์โทรลูกค้า</span>
                                    <input type="text" className="block w-[580px] p-2  text-sm border border-gray-800 rounded-xl   text-gray-700" placeholder=""/>
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">เลขทะเบียนผู้เสียภาษี</span>
                                    <input type="text" className="block w-[580px] p-2  text-sm border border-gray-800 rounded-xl   text-gray-700" placeholder=""/>
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">บัญชีธนาคาร</span>
                                    <input type="text" className="block w-[580px] p-2  text-sm border border-gray-800 rounded-xl   text-gray-700" placeholder=""/>
                                </label>
                                <label className="max-h-10 w-72 mb-8 justify-center">
                                    <span className="text-base font-semibold">อีเมล</span>
                                    <input type="text" className="block w-[580px] p-2  text-sm border border-gray-800 rounded-xl   text-gray-700" placeholder=""/>
                                </label>
                                <div className="gap-24 grid sm:grid-cols-6">
                                    <label className="max-h-10 w-72 mb-8 justify-center">
                                        <span className="text-base font-semibold"></span>
                                        <input className=" p-2" placeholder=""/>
                                    </label>
                                    <div></div>
                                    <div></div>
                                    <div></div> 
                                    <div className="flex justify-end items-end gap-4 px-5 bg-red-500 hover:bg-red-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                    <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                                        ยกเลิก
                                    </h3>
                                    </div>
                                    <div className="flex justify-end items-end gap-4 px-5 bg-green-500 hover:bg-green-900 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto">
                                    <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
                                        ยืนยัน
                                    </h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}