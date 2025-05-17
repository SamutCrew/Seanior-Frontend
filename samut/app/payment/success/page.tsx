// app/payment/success/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Home, BookOpen } from 'lucide-react';
import { Button } from '@/components/Common/Button'; // สมมติว่าคุณมี Button component
import LoadingPage from '@/components/Common/LoadingPage'; // สมมติว่าคุณมี Loading component

// (Optional) ถ้าคุณต้องการดึงข้อมูล Enrollment/Booking/Request มาแสดง
// import { getEnrollmentById } from '@/api/enrollment_api'; // สร้าง API function นี้
// import { getRequestById } from '@/api/course_request_api'; // สร้าง API function นี้
// import type { EnrollmentWithDetails } from '@/types/enrollment';
// import type { CourseRequestWithDetails } from '@/types/request'; // สมมตินิยาม Type นี้

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const bookingId = searchParams.get('booking_id');
  const requestId = searchParams.get('request_id');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // (Optional) State สำหรับเก็บข้อมูลที่ดึงมาแสดง
  // const [enrollmentDetails, setEnrollmentDetails] = useState<EnrollmentWithDetails | null>(null);
  // const [requestDetails, setRequestDetails] = useState<CourseRequestWithDetails | null>(null);

  useEffect(() => {
    if (!bookingId || !requestId) {
      setError("Missing booking or request information in URL.");
      setIsLoading(false);
      // อาจจะ Redirect ไปหน้า Error หรือหน้าหลัก
      // router.push('/error-page');
      return;
    }

    // (Optional) Fetch additional details if needed
    const fetchData = async () => {
      try {
        // --- ตัวอย่างการดึงข้อมูลเพิ่มเติม (คุณต้องสร้าง API function เหล่านี้ใน Backend และ Frontend) ---
        // สมมติว่าคุณต้องการดึงข้อมูล Request เพื่อแสดงชื่อคอร์ส
        // const requestData = await getRequestById(requestId); // สร้าง API function นี้
        // setRequestDetails(requestData);

        // หรือถ้าคุณต้องการดึงข้อมูล Enrollment โดยตรง (ถ้า Webhook ทำงานสมบูรณ์แล้ว Enrollment ควรจะถูกสร้างแล้ว)
        // และสมมติว่า Booking ID สามารถใช้หา Enrollment ได้ หรือ Request ID ใช้หา Enrollment ได้
        // const enrollmentData = await getEnrollmentByRequestId(requestId); // คุณอาจจะต้องสร้าง API นี้
        // setEnrollmentDetails(enrollmentData);

        // สำหรับตอนนี้ เราจะแสดงแค่ข้อความยืนยันง่ายๆ ก่อน
        setIsLoading(false);
      } catch (err: any) {
        console.error("Failed to fetch details for success page:", err);
        setError(err.message || "Failed to load confirmation details.");
        setIsLoading(false);
      }
    };

    fetchData();

  }, [bookingId, requestId, router]);

  if (isLoading) {
    return <LoadingPage/>;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl text-center max-w-md">
          <CheckCircle className="text-red-500 w-16 h-16 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Error Confirming Payment</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
          <Link href="/" passHref>
            <Button variant="primary" className="w-full">
              <Home className="mr-2 h-5 w-5" /> Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 p-4">
      <div className="bg-white dark:bg-slate-800 p-8 md:p-12 rounded-lg shadow-xl text-center max-w-lg">
        <CheckCircle className="text-green-500 w-20 h-20 mx-auto mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
          Thank you for your payment. Your enrollment is confirmed.
        </p>

        {/* (Optional) แสดงรายละเอียดเพิ่มเติม */}
        {/* {requestDetails && requestDetails.Course && (
          <div className="text-left bg-gray-50 dark:bg-slate-700 p-4 rounded-md mb-6">
            <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-2">Course Details:</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Course:</strong> {requestDetails.Course.course_name}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Request ID:</strong> {requestId}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              <strong>Booking ID:</strong> {bookingId}
            </p>
          </div>
        )} */}

        <div className="space-y-4 md:space-y-0 md:flex justify-center md:space-x-4"> {/* <<<--- เพิ่ม md:justify-center */}
              <Link href="/my-courses" passHref>
                <Button variant="primary" className="w-full md:w-auto"> {/* ถ้าต้องการให้ปุ่มไม่ยืดเต็มความกว้างบนจอเล็ก อาจจะเอา w-full ออก หรือปรับปรุง */}
                  <BookOpen className="mr-2 h-5 w-5" /> View My Courses
                </Button>
              </Link>
        </div>
      </div>
    </div>
  );
}