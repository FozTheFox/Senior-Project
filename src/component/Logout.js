import { useRouter } from 'next/navigation';
import {MdLogout,} from "react-icons/md";

export default function Logout() {
  const router = useRouter();

  const handleLogout = async () => {
    // ทำการส่งคำขอออกจากระบบไปยัง Laravel API
    await fetch('https://bodyworkandpaint.pantook.com/api/weblogout', {
      method: 'POST',
    });

    // ลบข้อมูลจาก sessionStorage
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('role');

    // นำทางไปยังหน้า Login
    router.push('/Loginmain');
  };

  return (
    <div className="flex mb-4 justify-start items-center gap-4 px-5 border border-gray-200 hover:bg-red-500 p-2 rounded-md group cursor-pointer hover:shadow-lg m-auto" onClick={handleLogout}>
      <MdLogout className="text-2xl text-gray-600 group-hover:text-white" />
      <h3 className="text-base text-gray-800 group-hover:text-white font-semibold">
        Logout
      </h3>
    </div>
  );
}
