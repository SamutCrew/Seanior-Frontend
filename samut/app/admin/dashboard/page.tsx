'use client';
import React, { useState, useEffect } from 'react';
import { getAllUsers, getAllResources, getAllCourses } from '@/api/';
import { getAllInstructorRequests } from '@/api/instructor_request_api';
import { useAuth } from '@/context/AuthContext';
import withLayout from '@/hocs/WithLayout';
import { LayoutType } from '@/types/layout';
import type { User, Resource } from '@/types';
import { UserType } from '@/types/model/user';
import { InstructorRequestData } from '@/types/model/instructor_request';
import { Course } from '@/types/course';
import Link from 'next/link';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import { FaCreditCard, FaClipboardList, FaUser, FaChalkboardTeacher, FaUserShield, FaBook, FaDatabase } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

interface InstructorRequest extends InstructorRequestData {
  request_id: string;
  user_id: string;
  status: string; // "pending", "approved", "rejected"
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;
  user?: User; 
}

// Define the API response type
interface InstructorRequestsResponse {
  requests: InstructorRequest[];
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [instructorRequests, setInstructorRequests] = useState<InstructorRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      window.location.href = '/auth/Login';
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);

        //users
        const userData = await getAllUsers();
        setUsers(userData);

        //resources
        const resourceData = await getAllResources();
        setResources(resourceData);

        //instructor requests
        const requestData = await getAllInstructorRequests() as InstructorRequestsResponse;
        if (requestData && Array.isArray(requestData.requests)) {
          setInstructorRequests(requestData.requests);
        } else {
          setInstructorRequests([]);
          console.warn('Unexpected instructor requests data, expected an object with a requests array:', requestData);
        }

        // Fetch courses
        const courseData = await getAllCourses();
        if (Array.isArray(courseData)) {
          setCourses(courseData);
        } else {
          setCourses([]);
          console.warn('Unexpected courses data, expected an array:', courseData);
        }

        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  //user counts by user_type
  const userCounts = {
    user: users.filter((u) => u.user_type === UserType.USER).length,
    instructor: users.filter((u) => u.user_type === UserType.INSTRUCTOR).length,
    admin: users.filter((u) => u.user_type === UserType.admin).length,
  };

  //instructor request stats
  const pendingRequests = Array.isArray(instructorRequests)
    ? instructorRequests.filter((req) => req.status === 'pending').length
    : 0;
  const approvedRequests = Array.isArray(instructorRequests)
    ? instructorRequests.filter((req) => req.status === 'approved').length
    : 0;

  //resource stats
  const resourceCount = resources.length;
  const totalResourceSize = resources.reduce((total, resource) => total + (resource.resource_size || 0), 0);
  const formatSize = (bytes: number): string => {
    const kb = bytes / 1024;
    return kb > 1024 ? `${(kb / 1024).toFixed(2)} MB` : `${kb.toFixed(2)} KB`;
  };
  const formattedTotalSize = formatSize(totalResourceSize);

  // User distribution pie chart data
  const userChartData = {
    labels: ['Users', 'Instructors', 'Admins'],
    datasets: [
      {
        data: [userCounts.user, userCounts.instructor, userCounts.admin],
        backgroundColor: ['#3b82f6', '#10b981', '#f97316'],
        hoverBackgroundColor: ['#2563eb', '#059669', '#ea580c'],
      },
    ],
  };

  // Instructor requests bar chart data
  const requestChartData = {
    labels: ['Pending', 'Approved'],
    datasets: [
      {
        label: 'Requests',
        data: [pendingRequests, approvedRequests],
        backgroundColor: ['#ef4444', '#22c55e'],
        borderColor: ['#dc2626', '#16a34a'],
        borderWidth: 1,
      },
    ],
  };

  // Resource stats bar chart data
  const resourceChartData = {
    labels: ['Total Files', 'Total Size (MB)'],
    datasets: [
      {
        label: 'Resources',
        data: [resourceCount, totalResourceSize / (1024 * 1024)], // Convert bytes to MB
        backgroundColor: ['#8b5cf6', '#d946ef'],
        borderColor: ['#7c3aed', '#c026d3'],
        borderWidth: 1,
      },
    ],
  };

  if (loading) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="mb-4 text-gray-600 dark:text-gray-300">Welcome, {user?.user_name || 'Admin'}</p>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Stripe Dashboard */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <FaCreditCard className="text-blue-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Stripe Dashboard</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Manage payments and transactions.
          </p>
          <a
            href="https://dashboard.stripe.com/test/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline font-medium"
          >
            Go to Stripe Dashboard
          </a>
        </div>

        {/* Instructor Requests */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <FaClipboardList className="text-red-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Instructor Requests</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Pending Requests: <span className="text-red-500 font-semibold">{pendingRequests}</span>
          </p>
          <div className="h-40 mb-4">
            <Bar
              data={requestChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: 'Count' } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <Link href="/admin/instructor-request" className="text-blue-500 hover:underline font-medium">
            See Details
          </Link>
        </div>

        {/* Users */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <FaUser className="text-blue-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Users</h2>
          </div>
          <div className="flex items-center mb-1">
            <FaUser className="text-blue-500 mr-2" size={16} />
            <p className="text-gray-600 dark:text-gray-300">
              Users: <span className="text-blue-500 font-semibold">{userCounts.user}</span>
            </p>
          </div>
          <div className="flex items-center mb-1">
            <FaChalkboardTeacher className="text-emerald-500 mr-2" size={16} />
            <p className="text-gray-600 dark:text-gray-300">
              Instructors: <span className="text-emerald-500 font-semibold">{userCounts.instructor}</span>
            </p>
          </div>
          <div className="flex items-center mb-2">
            <FaUserShield className="text-orange-500 mr-2" size={16} />
            <p className="text-gray-600 dark:text-gray-300">
              Admins: <span className="text-orange-500 font-semibold">{userCounts.admin}</span>
            </p>
          </div>
          <div className="h-40 mb-4">
            <Pie
              data={userChartData}
              options={{
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } },
              }}
            />
          </div>
          <div className="space-y-1">
            <div>
              <Link href="/admin/user" className="text-blue-500 hover:underline font-medium">
                View Users
              </Link>
            </div>
            <div>
              <Link href="/admin/instructor" className="text-blue-500 hover:underline font-medium">
                View Instructors
              </Link>
            </div>
          </div>
        </div>

          {/* Courses */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <FaBook className="text-indigo-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Courses</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Total Courses: <span className="text-indigo-500 font-semibold">{courses.length}</span>
          </p>
          <Link href="/admin/course" className="text-blue-500 hover:underline font-medium">
            See Details
          </Link>
        </div>

        {/* Resources */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-2">
            <FaDatabase className="text-purple-500 mr-2" size={24} />
            <h2 className="text-xl font-semibold">Resources</h2>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-1">
            Total Files: <span className="text-purple-500 font-semibold">{resourceCount}</span>
          </p>
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            Total Size: <span className="text-purple-500 font-semibold">{formattedTotalSize}</span>
          </p>
          <div className="h-40 mb-4">
            <Bar
              data={resourceChartData}
              options={{
                maintainAspectRatio: false,
                scales: {
                  y: { beginAtZero: true, title: { display: true, text: 'Value' } },
                },
                plugins: { legend: { display: false } },
              }}
            />
          </div>
          <Link href="/admin/resource" className="text-blue-500 hover:underline font-medium">
            See Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default withLayout(AdminDashboard, LayoutType.Admin);