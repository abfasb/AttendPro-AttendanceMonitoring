import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/config";

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
  qrCodeId: string;
  timestamp: string;
}

const Overview: React.FC = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch QR codes from Firestore
  const fetchQRCodes = async () => {
    try {
      const qrCollectionRef = collection(db, "qrCodes");
      const snapshot = await getDocs(qrCollectionRef);
      const qrData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as QRCode[];
      setQRCodes(qrData);
    } catch (err) {
      console.error("Error fetching QR codes:", err);
    }
  };

  // Fetch attendance records for the selected QR code
  const fetchAttendanceRecords = async (qrCodeId: string) => {
    try {
      const attendanceCollectionRef = collection(db, "attendance");
      const q = query(attendanceCollectionRef, where("qrCodeId", "==", qrCodeId));
      const snapshot = await getDocs(q);
      const attendanceData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as AttendanceRecord[];
      setAttendanceRecords(attendanceData);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    }
  };

  // Open modal and fetch attendance records
  const handleQRCodeClick = async (qrCode: QRCode) => {
    setSelectedQRCode(qrCode);
    await fetchAttendanceRecords(qrCode.id);
    setIsModalOpen(true);
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Attendance Overview</h1>
        {qrCodes.length > 0 ? (
          <ul className="space-y-4">
            {qrCodes.map((qrCode) => (
              <li key={qrCode.id}>
                <button
                  className="w-full text-left bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                  onClick={() => handleQRCodeClick(qrCode)}
                >
                  {qrCode.title}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No QR codes found.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedQRCode && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
              onClick={() => {
                setIsModalOpen(false);
                setAttendanceRecords([]);
              }}
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Attendance for: {selectedQRCode.title}
            </h2>
            {attendanceRecords.length > 0 ? (
              <ul className="space-y-2">
                {attendanceRecords.map((record) => (
                  <li
                    key={record.id}
                    className="bg-gray-100 rounded-lg px-4 py-2 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-gray-800 font-medium">
                        Student ID: {record.studentId}
                      </span>
                      <span className="text-gray-500 text-sm">
                        {new Date(record.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No attendance records found for this QR code.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
