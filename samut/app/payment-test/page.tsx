'use client'; // ถ้าใช้ Next.js 13+ แบบ App Router

import React from 'react';
import { APIEndpoints } from '@/constants/apiEndpoints';

export default function PaymentTestPage() {
  const redirectToPromptPay = async () => {
    try {
        console.log('เรียกไปที่:', APIEndpoints.PAYMENT.CREATE_PROMPTPAY_SESSION);
      const res = await fetch(APIEndpoints.PAYMENT.CREATE_PROMPTPAY_SESSION);
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('ไม่สามารถเริ่มการชำระเงินได้');
        console.error('Invalid session response:', data);
      }
    } catch (err) {
      console.error('Error creating session:', err);
      alert('เกิดข้อผิดพลาด');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">ทดสอบระบบชำระเงิน</h1>
      <p className="mb-6 text-gray-600">กดปุ่มด้านล่างเพื่อไปยังหน้าชำระเงินด้วย PromptPay (Stripe)</p>
      <button
        onClick={redirectToPromptPay}
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
      >
        ชำระเงินด้วย PromptPay
      </button>
    </div>
  );
}
