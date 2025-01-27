import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where, doc, getDoc } from "firebase/firestore";
import { db } from "../../config/config";
import { FiX, FiList, FiClock, FiUser } from "react-icons/fi";

// Interface definitions
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
  firstName?: string;
  email?: string;
  photoURL?: string;
}

const Overview: React.FC = () => {
  const [qrCodes, setQRCodes] = useState<QRCode[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [selectedQRCode, setSelectedQRCode] = useState<QRCode | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchQRCodes = async () => {
    try {
      const qrCollectionRef = collection(db, "qrCodes");
      const snapshot = await getDocs(qrCollectionRef);
      const qrData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      })) as QRCode[];
      setQRCodes(qrData);
    } catch (err) {
      console.error("Error fetching QR codes:", err);
    }
  };

  const fetchAttendanceRecords = async (qrCodeId: string) => {
    try {
      setLoading(true);
      const attendanceCollectionRef = collection(db, "attendances");
      const q = query(
        attendanceCollectionRef,
        where("qrCodeId", "==", qrCodeId)
      );
      const snapshot = await getDocs(q);
  
      const recordsPromises = snapshot.docs.map(async (attendanceDoc) => {
        const data = attendanceDoc.data();
        console.log(data);
        
        let studentName = "Unknown Student";
        try {
          const userRef = doc(db, "users", data.studentId);
          const userDoc = await getDoc(userRef);
          const userData = userDoc.data() as UserData;
          studentName = data.studentName || studentName;
        } catch (error) {
          console.error("Error fetching user data:", error);
        }

        return {
          id: attendanceDoc.id,
          studentId: data.studentId,
          studentName,
          qrCodeId: data.qrCodeId,
          createdAt: data.createdAt
        } as AttendanceRecord;
      });

      const records = await Promise.all(recordsPromises);
      setAttendanceRecords(records);
    } catch (err) {
      console.error("Error fetching attendance records:", err);
    } finally {
      setLoading(false);
    }
  };
      
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
              <li 
                key={qrCode.id} 
                className="bg-blue-100 border border-blue-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <button
                  className="flex items-center justify-between w-full px-4 py-3 text-left text-blue-800 hover:bg-blue-200 rounded-lg transition-colors"
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

      {/* Attendance Details Modal */}
      {isModalOpen && selectedQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-6 sticky top-0 bg-white">
              <h2 className="text-2xl font-semibold text-gray-800">
                Attendance for: {selectedQRCode.title}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-800 transition-colors"
                onClick={() => {
                  setIsModalOpen(false);
                  setAttendanceRecords([]);
                }}
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            
            <div className="p-6">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading attendance records...</p>
                </div>
              ) : attendanceRecords.length > 0 ? (
                <ul className="space-y-3">
                  {attendanceRecords.map((record) => (
                    <li
                      key={record.id}
                      className="bg-gray-50 border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FiUser className="text-gray-600 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">
                              {record.studentName}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Student ID: {record.studentId}
                            </p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <FiClock className="flex-shrink-0" />
                          <span>
                            {new Date(record.createdAt).toLocaleDateString()}
                          </span>
                          <span>
                            {new Date(record.createdAt).toLocaleTimeString()}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No attendance records found for this QR code.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;