// middleware.js

import { NextResponse } from 'next/server';

export function middleware(req) {
  // ดึงค่า session cookie จาก request
  const sessionCookie = req.cookies.get('laravel_session')?.value;

  // ถ้าไม่มี session cookie ให้ redirect ไปยังหน้า login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL('/Loginmain', req.url));
  }

  // ถ้ามี session cookie ให้ไปยังหน้าถัดไป
  return NextResponse.next();
}

// ระบุเส้นทางที่ต้องการใช้ middleware
export const config = {
  matcher: ['/admin/:path*', '/employee/:path*'],
};
