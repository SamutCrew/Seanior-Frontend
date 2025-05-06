'use client'; // ใช้ถ้าใช้ Next.js 13+ แบบ App Router

import React, { useEffect } from 'react';

const SuccessPage: React.FC = () => {
  useEffect(() => {
    // สามารถทำการเรียก API หรือฟังก์ชันอื่นๆ ได้ที่นี่
    console.log('ชำระเงินสำเร็จ!');
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-green-100">
      <div className="text-center p-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-semibold text-green-600">ชำระเงินสำเร็จ!</h1>
        <p className="mt-4 text-lg text-gray-700">
          ขอบคุณที่ทำการชำระเงิน การทำรายการเสร็จสมบูรณ์แล้ว
        </p>
        <div className="mt-6">
          <a
            href="/"
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            กลับสู่หน้าหลัก
          </a>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;
