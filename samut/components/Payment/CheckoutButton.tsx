import React from 'react';
import { APIEndpoints } from '@/constants/apiEndpoints';
const CheckoutButton: React.FC = () => {
  const redirectToPromptPay = async () => {
    try {
        const res = await fetch(APIEndpoints.PAYMENT.CREATE_PROMPTPAY_SESSION);
        const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error('URL ไม่ถูกต้องจาก backend:', data);
        alert('เกิดข้อผิดพลาดในการสร้าง checkout session');
      }
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการเรียก backend:', error);
      alert('เชื่อมต่อ backend ไม่สำเร็จ');
    }
  };

  return (
    <button
      onClick={redirectToPromptPay}
      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      ชำระเงินด้วย PromptPay
    </button>
  );
};

export default CheckoutButton;
