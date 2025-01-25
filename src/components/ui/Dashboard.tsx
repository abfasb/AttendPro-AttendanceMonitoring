import React, { useState } from "react";
import ReactQRCode from "react-qr-code";
import html2canvas from "html2canvas";

const Dashboard: React.FC = () => {
  const [qrData, setQrData] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);

  const generateQRCode = () => {
    const currentTime = new Date().toISOString();
    const attendanceData = {
      event: "class123",
      time: currentTime,
      status: "pending",
    };
    setQrData(JSON.stringify(attendanceData));
    setShowQRCode(true);
  };

  const downloadQRCode = async () => {
    if (!showQRCode) return;
    const qrCodeElement = document.getElementById("qr-code");
    if (qrCodeElement) {
      const canvas = await html2canvas(qrCodeElement);
      const link = document.createElement("a");
      link.download = "attendance_qr_code.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6">
      <div className="bg-white w-full max-w-3xl p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
        <h2 className="text-3xl font-extrabold text-indigo-600 text-center mb-8">
          Attendance Management
        </h2>
        <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
          Generate and Download QR Code for Attendance
        </h3>
        <div className="flex justify-center">
          <button
            onClick={generateQRCode}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-indigo-500 transition duration-300"
          >
            Generate QR Code
          </button>
        </div>
        {showQRCode && qrData && (
          <div className="mt-8 flex flex-col items-center">
            <div
              id="qr-code"
              className="bg-white p-4 rounded-md shadow-md"
            >
              <ReactQRCode value={qrData} size={200} />
            </div>
            <button
              onClick={downloadQRCode}
              className="mt-4 bg-green-600 text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-green-500 transition duration-300"
            >
              Download QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
