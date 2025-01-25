import React, { useState, useEffect } from "react";
import { db } from "../../config/config";
import { collection, getDocs } from "firebase/firestore";
import DataTable from "react-data-table-component";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics: React.FC = () => {
  const [students, setStudents] = useState([]);
  const [qrCodes, setQrCodes] = useState([]);
  const [loading, setLoading] = useState<boolean>(false);
  
  // Fetch data
  const fetchStudents = async () => {
    setLoading(true);
    const studentSnapshot = await getDocs(collection(db, "students"));
    const studentData = studentSnapshot.docs.map((doc) => doc.data());
    setStudents(studentData);
    setLoading(false);
  };

  const fetchQrCodes = async () => {
    setLoading(true);
    const qrSnapshot = await getDocs(collection(db, "qrCodes"));
    const qrData = qrSnapshot.docs.map((doc) => doc.data());
    setQrCodes(qrData);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents();
    fetchQrCodes();
  }, []);

  // Chart data for attendance
  const attendanceData = {
    labels: students.map(student => student.name),
    datasets: [{
      label: 'Attendance Rate (%)',
      data: students.map(student => (student.attendance === "present" ? 100 : 0)),
      backgroundColor: 'rgba(75, 192, 192, 0.6)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
  };

  // QR Code Status Pie Chart Data
  const qrStatusData = {
    labels: ['Active', 'Expired'],
    datasets: [{
      data: [
        qrCodes.filter(qr => qr.status === 'active').length,
        qrCodes.filter(qr => qr.status === 'expired').length,
      ],
      backgroundColor: ['#36A2EB', '#FF6384'],
    }]
  };

  // Table columns for QR codes
  const qrColumns = [
    { name: 'Title', selector: row => row.title },
    { name: 'Created At', selector: row => new Date(row.createdAt).toLocaleString() },
    { name: 'Expires At', selector: row => new Date(row.expiresAt).toLocaleString() },
  ];

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-6 bg-gray-100">
        <h1 className="text-3xl font-semibold text-gray-800">Analytics Overview</h1>

        {/* Attendance Chart */}
        <div className="my-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Student Attendance Overview</h2>
          <Bar data={attendanceData} options={{ responsive: true }} />
        </div>

        {/* QR Code Status Pie Chart */}
        <div className="my-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">QR Code Status</h2>
          <Pie data={qrStatusData} options={{ responsive: true }} />
        </div>

        {/* QR Code List */}
        <div className="my-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-4">QR Code List</h2>
          <DataTable
            columns={qrColumns}
            data={qrCodes}
            progressPending={loading}
            pagination
            highlightOnHover
            className="bg-white"
          />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
