import React, { useState } from "react";
import ReactQRCode from "react-qr-code";

const Overview : React.FC = () => {
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

  return (
    <div>
      <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Scan QR Code for Attendance</h3>
        <button
          onClick={generateQRCode}
          className="bg-indigo-600 text-white px-8 py-4 rounded-xl text-lg hover:bg-indigo-500 transition duration-300"
        >
          Generate QR Code
        </button>
        {showQRCode && qrData && (
          <div className="mt-8 flex justify-center">
            <ReactQRCode value={qrData} size={256} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
