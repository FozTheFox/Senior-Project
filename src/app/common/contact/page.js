
import Topbar from "../../ui/Topbar";

export default function contact(){
    return (
        <div>
            <Topbar/>
            <img className="w-screen h-screen bg-cover fixed opacity-20" src="https://www.drivergocar.com/wp-content/uploads/2022/08/27-best-repair-garages-in-bangkok-cover.jpg"/>
                <div className="relative p-10 px-20">
                    <div className="bg-white dark:highlight-white/5 shadow-lg ring-1 ring-black/5 rounded-xl">
                        <h1 className="p-5 text-2xl text-black group-hover:text-white font-bold">ติดต่อเรา</h1>
                        <div className="gap-5 grid sm:grid-cols-3">
                            <div className="p-1 px-5">
                                <h1 className="">ชื่อ</h1>
                                <input type="password" className="block w-full p-2  text-sm border rounded-lg border-black"></input>
                            </div>
                            <div className="p-1">
                                <h1>นามสกุล</h1>
                                <input type="password" className="block w-full p-2  text-sm border rounded-lg border-black"></input>
                            </div>
                            <div className="p-1 px-5">
                                <h1>เบอร์โทร</h1>
                                <input type="password" className="block w-full p-2  text-sm border rounded-lg border-black"></input>
                            </div>
                            <div className="p-1 px-5">
                                <h1>อีเมล</h1>
                                <input type="password" className="block w-full p-2  text-sm border rounded-lg border-black"></input>
                            </div>
                            <form className="p-1">
                                <label className="block text-black dark:black">หัวข้อ</label>
                                    <select id="countries" className="bg-gray-50 border border-gray-300 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-white dark:border-gray-600 dark:placeholder-gray-600 dark:text-black dark:focus:ring-blue-500 dark:focus:border-blue-500">
                                        <option selected>โปรดเลือกหัวข้อ</option>
                                        <option value="ติดต่อสอบถาม">ติดต่อสอบถาม</option>
                                        <option value="ติดต่องานซ่อม">ติดต่องานซ่อม</option>
                                        <option value="ติดต่อ #####">ติดต่อ #####</option>
                                        <option value="ติดต่อ #####">ติดต่อ #####</option>
                                    </select>
                            </form>
                        </div>
                        <div className="p-1 px-5">
                            <h1>เนื้อหา</h1>
                            <textarea id="text" className="block min-w-[1335px] min-h-[200px] p-2  text-sm border rounded-lg border-black"></textarea>
                        </div>
                        <div className="gap-96 grid grid-cols-2">
                            <div className="p-1 px-5">
                                <h1>อัพโหลดไฟล์</h1>
                                <input className="w-96 mb-3 p-2 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-white dark:border-gray-600 dark:placeholder-gray-400" id="file_input" type="file"/>
                            </div>
                            <div className="p-7 items-end justify-end">
                                <button className="w-36 p-2 ms-72 text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-black focus:outline-none dark:bg-green-400 dark:border-gray-600 dark:placeholder-gray-400 hover:bg-green-700 group hover:shadow-lg m-auto">ส่งฟอร์ม</button>
                            </div>
                        </div>
                    </div>
                </div>
        </div>
    );
}