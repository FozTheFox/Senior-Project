'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://bodyworkandpaint.pantook.com/api/weblogin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Important to include credentials (cookies)
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User status:", data);

        // เก็บข้อมูลใน sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        sessionStorage.setItem('role', data.role_name);

        // Redirect based on role
        if (data.role_name === 'Admin') {
          router.push('/admin/dashboard');
        } else if (data.role_name === 'รับรถ') {
          router.push('/employee/dashboard');
        }
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-3/12 rounded-lg p-10 bg-white shadow-md">
        <h2 className="text-3xl font-bold mb-4 text-center">Login</h2>
        <form className="flex flex-col gap-y-3" onSubmit={handleSubmit}>
          <label className="block mb-2">
            <span className="text-gray-700">ชื่อผู้ใช้ หรือ เบอร์โทร</span>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="block w-full p-2 text-sm border rounded-lg text-gray-700"
              placeholder="ชื่อผู้ใช้ หรือ เบอร์โทร"
            />
          </label>
          <label className="block mb-2">
            <span className="text-gray-700">รหัสผ่าน</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full p-2 text-sm border rounded-lg text-gray-700"
              placeholder="********"
            />
          </label>
          <div className="w-full flex justify-center">
            <button
              type="submit"
              className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 flex justify-center w-7/12 rounded-lg"
            >
              Login
            </button>
          </div>
        </form>
        
        
      </div>
    </div>
  );
}
