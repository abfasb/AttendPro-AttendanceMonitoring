import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/config";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";
import { FiTrendingUp, FiUsers, FiCalendar, FiCode } from "react-icons/fi";

interface QRCode {
  id: string;
  title: string;
  createdAt: string;
  expiresAt: string;
  status: string;
}

interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  qrCodeId: string;
  createdAt: string;
}

interface UserData {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
}

const Analytics: React.FC = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQRCodes = async () => {
    const qrCollectionRef = collection(db, "qrCodes");
    const snapshot = await getDocs(qrCollectionRef);
    const qrData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QRCode[];
    setQRCodes(qrData);
  };

  const fetchAttendanceRecords = async () => {
    const attendanceCollectionRef = collection(db, "attendances");
    const snapshot = await getDocs(attendanceCollectionRef);
    const records = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as AttendanceRecord[];
    setAttendanceRecords(records);
  };

  const fetchUsers = async () => {
    const usersCollectionRef = collection(db, "users");
    const snapshot = await getDocs(usersCollectionRef);
    const usersData = snapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
    })) as UserData[];
    setUsers(usersData);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await fetchQRCodes();
      await fetchAttendanceRecords();
      await fetchUsers();
      setLoading(false);
    };
    fetchData();
  }, []);

  const getTotalQRCodes = () => qrCodes.length;
  const getTotalAttendanceRecords = () => attendanceRecords.length;
  const getAverageAttendancePerQRCode = () => (attendanceRecords.length / qrCodes.length).toFixed(2);

  const getMostUsedQRCode = () => {
    const qrCodeUsage = attendanceRecords.reduce((acc, record) => {
      acc[record.qrCodeId] = (acc[record.qrCodeId] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const mostUsedQRCodeId = Object.keys(qrCodeUsage).reduce((a, b) =>
      qrCodeUsage[a] > qrCodeUsage[b] ? a : b
    );
    return qrCodes.find((qr) => qr.id === mostUsedQRCodeId)?.title || "N/A";
  };

  const getMostActiveStudent = () => {
    const studentAttendance = attendanceRecords.reduce((acc, record) => {
      acc[record.studentId] = (acc[record.studentId] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    const mostActiveStudentId = Object.keys(studentAttendance).reduce((a, b) =>
      studentAttendance[a] > studentAttendance[b] ? a : b
    );
    const student = users.find((user) => user.uid === mostActiveStudentId);
    return student ? `${student.firstName} ${student.lastName}` : "N/A";
  };

  const getAttendanceTrends = () => {
    const trends = attendanceRecords.reduce((acc, record) => {
      const date = new Date(record.createdAt).toLocaleDateString();
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(trends).map((date) => ({
      date,
      attendance: trends[date],
    }));
  };

  const getQRCodeStatusDistribution = () => {
    const statusCounts = qrCodes.reduce((acc, qr) => {
      acc[qr.status] = (acc[qr.status] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });

    return Object.keys(statusCounts).map((status) => ({
      name: status,
      value: statusCounts[status],
    }));
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <h1 className="text-3xl font-semibold text-gray-800 mb-6">Attendance Analytics</h1>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading analytics...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <FiCode className="text-2xl text-blue-500" />
                <div>
                  <p className="text-gray-600">Total QR Codes</p>
                  <p className="text-2xl font-bold">{getTotalQRCodes()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiUsers className="text-2xl text-green-500" />
                <div>
                  <p className="text-gray-600">Total Attendance Records</p>
                  <p className="text-2xl font-bold">{getTotalAttendanceRecords()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <FiTrendingUp className="text-2xl text-purple-500" />
                <div>
                  <p className="text-gray-600">Average Attendance per QR Code</p>
                  <p className="text-2xl font-bold">{getAverageAttendancePerQRCode()}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">QR Code Insights</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Most Used QR Code</p>
                <p className="text-xl font-bold">{getMostUsedQRCode()}</p>
              </div>
              <div>
                <p className="text-gray-600">QR Code Status Distribution</p>
                <PieChart width={300} height={200}>
                  <Pie
                    data={getQRCodeStatusDistribution()}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label
                  >
                    {getQRCodeStatusDistribution().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Student Insights</h2>
            <div className="space-y-4">
              <div>
                <p className="text-gray-600">Most Active Student</p>
                <p className="text-xl font-bold">{getMostActiveStudent()}</p>
              </div>
            </div>
          </div>

          {/* Attendance Trends */}
          <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Attendance Trends</h2>
            <LineChart width={800} height={300} data={getAttendanceTrends()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;