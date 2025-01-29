import React, { useState, useEffect } from "react";
import { db } from "../../config/config";
import { collection, getDocs } from "firebase/firestore";

interface Attendance {
  id: string;
  createdAt: string;
  qrCodeId: string;
  studentId: string;
  studentName: string;
}

interface QRCode {
  id: string;
  createdAt: string;
  expiresAt: string;
  imageUrl: string;
  status: string;
  title: string;
}

interface StudentAttendance {
  studentId: string;
  studentName: string;
  attendances: {
    qrCodeId: string;
    scannedAt: string;
    qrCodeTitle: string;
  }[];
}

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<StudentAttendance[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<StudentAttendance | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch attendances
      const attendancesSnapshot = await getDocs(collection(db, "attendances"));
      const attendances: Attendance[] = attendancesSnapshot.docs.map((doc) => ({
        id: doc.id,
        createdAt: doc.data().createdAt,
        qrCodeId: doc.data().qrCodeId,
        studentId: doc.data().studentId,
        studentName: doc.data().studentName,
      }));

      // Fetch QR codes
      const qrCodesSnapshot = await getDocs(collection(db, "qrCodes"));
      const qrCodes: QRCode[] = qrCodesSnapshot.docs.map((doc) => ({
        id: doc.id,
        createdAt: doc.data().createdAt,
        expiresAt: doc.data().expiresAt,
        imageUrl: doc.data().imageUrl,
        status: doc.data().status,
        title: doc.data().title,
      }));

      // Map attendances to students
      const studentMap: Record<string, StudentAttendance> = {};
      attendances.forEach((attendance) => {
        const qrCode = qrCodes.find((qr) => qr.id === attendance.qrCodeId);
        if (qrCode) {
          if (!studentMap[attendance.studentId]) {
            studentMap[attendance.studentId] = {
              studentId: attendance.studentId,
              studentName: attendance.studentName,
              attendances: [],
            };
          }
          studentMap[attendance.studentId].attendances.push({
            qrCodeId: attendance.qrCodeId,
            scannedAt: attendance.createdAt,
            qrCodeTitle: qrCode.title,
          });
        }
      });

      setStudents(Object.values(studentMap));
    };

    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Student Attendance List</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {students.map((student) => (
          <div
            key={student.studentId}
            className="p-4 border rounded-lg shadow-md cursor-pointer hover:bg-gray-50"
            onClick={() => setSelectedStudent(student)}
          >
            <h2 className="text-lg font-semibold">{student.studentName}</h2>
            <p className="text-sm text-gray-600">
              Total Attendances: {student.attendances.length}
            </p>
          </div>
        ))}
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">{selectedStudent.studentName}'s Attendance Details</h2>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left">QR Code Title</th>
                  <th className="text-left">Scanned At</th>
                </tr>
              </thead>
              <tbody>
                {selectedStudent.attendances.map((attendance) => (
                  <tr key={attendance.qrCodeId}>
                    <td className="py-2">{attendance.qrCodeTitle}</td>
                    <td className="py-2">{new Date(attendance.scannedAt).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              onClick={() => setSelectedStudent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentList;