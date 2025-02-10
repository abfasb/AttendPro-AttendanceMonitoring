import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/config";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, ResponsiveContainer } from "recharts";
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
interface qrCode{
  id: string;
  realname: string;
  sala: number
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

  const getQRCodeStatus = (expiresAt: string) => {
    const currentTime = new Date();
    const expirationTime = new Date(expiresAt);
    return currentTime <= expirationTime ? "active" : "expired";
  };

  const fetchQRCodes = async () => {
    const qrCollectionRef = collection(db, "qrCodes");
    const snapshot = await getDocs(qrCollectionRef);
    const qrData = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      status: getQRCodeStatus(doc.data().expiresAt), 
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
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Attendance Analytics Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-100 rounded-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Stat Cards */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiCode className="text-2xl text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total QR Codes</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalQRCodes()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <FiUsers className="text-2xl text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total Attendance</p>
                  <p className="text-2xl font-bold text-gray-900">{getTotalAttendanceRecords()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <FiTrendingUp className="text-2xl text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg/QR Code</p>
                  <p className="text-2xl font-bold text-gray-900">{getAverageAttendancePerQRCode()}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <FiCalendar className="text-2xl text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Active Student</p>
                  <p className="text-xl font-bold text-gray-900 truncate">{getMostActiveStudent()}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Attendance Trends */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Attendance Trends</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={getAttendanceTrends()}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fill: '#6b7280' }}
                      stroke="#d1d5db"
                    />
                    <YAxis 
                      tick={{ fill: '#6b7280' }}
                      stroke="#d1d5db"
                    />
                    <Tooltip 
                      contentStyle={{
                        background: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="attendance" 
                      stroke="#6366f1" 
                      strokeWidth={2}
                      dot={{ fill: '#6366f1', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* QR Code Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">QR Code Status Distribution</h2>
              <div className="h-80 flex flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getQRCodeStatusDistribution()}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {getQRCodeStatusDistribution().map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={COLORS[index % COLORS.length]}
                          stroke="#fff"
                          strokeWidth={2}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{
                        background: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend 
                      layout="vertical"
                      align="right"
                      verticalAlign="middle"
                      formatter={(value, entry) => (
                        <span className="text-gray-600">{value}</span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Most Used QR Code */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Most Used QR Code</h2>
              <div className="flex items-center justify-center p-4 bg-indigo-50 rounded-lg">
                <span className="text-2xl font-bold text-indigo-600">
                  {getMostUsedQRCode()}
                </span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4">
                {qrCodes.slice(0,4).map(qr => (
                  <div key={qr.id} className="p-3 bg-gray-50 rounded-lg">
                    <p className="font-medium text-gray-900 truncate">{qr.title}</p>
                    <p className={`text-sm ${qr.status === "active" ? "text-green-600" : "text-red-600"}`}>
                      {qr.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Attendance</h2>
              <div className="space-y-4">
                {attendanceRecords.slice(0,5).map(record => (
                  <div key={record.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{record.studentName}</p>
                      <p className="text-sm text-gray-500">{new Date(record.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                      Present
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;