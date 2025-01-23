import React from "react";

const InstructorPage : React.FC = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex">
      <div className="w-72 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center mb-10">
            <img
              src="profile-pic.jpg"
              alt="Instructor"
              className="w-20 h-20 rounded-full border-4 border-white shadow-md"
            />
          </div>
          <h2 className="text-3xl font-bold text-center mb-4">Instructor Panel</h2>
          <nav>
            <ul className="space-y-6">
              <li>
                <a
                  href="#"
                  className="block py-3 px-5 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Dashboard
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-3 px-5 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Attendance Overview
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-3 px-5 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Scan QR Code
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-3 px-5 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Student List
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-3 px-5 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Reports & Insights
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block py-3 px-5 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300"
                >
                  Settings
                </a>
              </li>
            </ul>
          </nav>
        </div>
        <div>
          <button className="bg-red-600 text-white w-full py-3 rounded-lg hover:bg-red-500 transition duration-300">
            Logout
          </button>
        </div>
      </div>

      <div className="flex-1 p-12 space-y-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Welcome, Instructor</h1>
          <button className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition duration-300">
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Today's Attendance</h3>
            <p className="text-3xl font-bold text-indigo-600">22/30 Students Present</p>
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">Last Updated: 10 mins ago</div>
              <div className="bg-indigo-100 p-4 rounded-full text-indigo-500 shadow-md">
                <span className="text-3xl">📊</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Upcoming Classes</h3>
            <p className="text-2xl font-medium text-gray-700">Math 101, 2:00 PM</p>
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">Next Class: 30 mins</div>
              <div className="bg-green-100 p-4 rounded-full text-green-500 shadow-md">
                <span className="text-3xl">📅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
            <h3 className="text-xl font-semibold text-gray-700 mb-3">Attendance Insights</h3>
            <p className="text-2xl font-medium text-gray-700">View Trends & Reports</p>
            <div className="mt-6 flex justify-between items-center">
              <div className="text-sm text-gray-500">Weekly Insights</div>
              <div className="bg-yellow-100 p-4 rounded-full text-yellow-500 shadow-md">
                <span className="text-3xl">📈</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Scan QR Code for Attendance</h3>
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-indigo-500 transition duration-300">
            Generate QR Code
          </button>

          <div className="mt-8">
            <h4 className="text-lg font-semibold text-gray-700">Real-Time Attendance Logs</h4>
            <ul className="space-y-3 mt-4">
              <li className="flex justify-between items-center text-gray-600">
                <span>John Doe</span>
                <span className="bg-green-200 text-green-700 py-1 px-3 rounded-full">Present</span>
              </li>
              <li className="flex justify-between items-center text-gray-600">
                <span>Jane Smith</span>
                <span className="bg-red-200 text-red-700 py-1 px-3 rounded-full">Absent</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Class Attendance Overview</h3>
          <table className="min-w-full table-auto">
            <thead>
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Student Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Attendance Status</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700">John Doe</td>
                <td className="px-6 py-4 text-sm text-green-600">Present</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-indigo-600 hover:text-indigo-500">View Details</button>
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 text-sm text-gray-700">Jane Smith</td>
                <td className="px-6 py-4 text-sm text-red-600">Absent</td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-indigo-600 hover:text-indigo-500">View Details</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InstructorPage;
