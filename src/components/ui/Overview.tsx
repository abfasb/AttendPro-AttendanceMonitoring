import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/config";
import { FiX, FiList, FiClock } from "react-icons/fi";

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
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-lg p-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-6">Attendance Overview</h1>
        {qrCodes.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {qrCodes.map((qrCode) => (
              <li key={qrCode.id} className="bg-blue-100 border border-blue-300 rounded-lg shadow-sm">
                <button
                  className="flex items-center justify-between w-full px-4 py-3 text-left text-blue-800 hover:bg-blue-200 rounded-lg transition duration-300"
                  onClick={() => handleQRCodeClick(qrCode)}
                >
                  <span className="font-medium">{qrCode.title}</span>
                  <FiList className="text-xl" />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">No QR codes found.</p>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && selectedQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <h2 className="text-2xl font-semibold text-gray-800">
                Attendance for: {selectedQRCode.title}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800"
                onClick={() => {
                  setIsModalOpen(false);
                  setAttendanceRecords([]);
                }}
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            {attendanceRecords.length > 0 ? (
              <ul className="space-y-3">
                {attendanceRecords.map((record) => (
                  <li
                    key={record.id}
                    className="bg-gray-100 border border-gray-300 rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        Student ID: {record.studentId}
                      </span>
                      <span className="text-gray-500 text-sm flex items-center gap-2">
                        <FiClock />
                        {new Date(record.timestamp).toLocaleString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">
                No attendance records found for this QR code.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;
