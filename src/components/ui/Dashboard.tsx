import React, { useState, useEffect } from "react";
import ReactQRCode from "react-qr-code";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../config/config";
import DataTable from "react-data-table-component"; // Install with npm install react-data-table-component
import html2canvas from "html2canvas";

// Dashboard Component
const Dashboard: React.FC = () => {
  const [qrTitle, setQrTitle] = useState("");
  const [expirationTime, setExpirationTime] = useState("");
  const [qrData, setQrData] = useState("");
  const [showQRCode, setShowQRCode] = useState(false);
  const [qrList, setQrList] = useState([]);
  const [loading, setLoading] = useState(false);

  // Firebase Firestore reference
  const qrCollectionRef = collection(db, "qrCodes");

  // Fetch QR codes from Firestore
  const fetchQRCodes = async () => {
    setLoading(true);
    const data = await getDocs(qrCollectionRef);
    const qrItems = data.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    setQrList(qrItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  // Generate QR Code and save to Firestore
  const generateQRCode = async () => {
    if (!qrTitle || !expirationTime) {
      alert("Please provide a title and expiration time.");
      return;
    }

    const currentTime = new Date().toISOString();
    const qrPayload = {
      title: qrTitle,
      createdAt: currentTime,
      expiresAt: expirationTime,
      status: "active",
    };
    setQrData(JSON.stringify(qrPayload));
    setShowQRCode(true);

    // Save to Firestore
    try {
      await addDoc(qrCollectionRef, qrPayload);
      alert("QR Code saved successfully!");
      setQrTitle("");
      setExpirationTime("");
      fetchQRCodes(); // Refresh table
    } catch (err) {
      console.error("Error saving QR Code:", err);
    }
  };

  // Download QR Code
  const downloadQRCode = async (data) => {
    const qrCodeElement = document.getElementById(`qr-code-${data.id}`);
    if (qrCodeElement) {
      const canvas = await html2canvas(qrCodeElement);
      const link = document.createElement("a");
      link.download = `${data.title}_qr_code.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    }
  };

  // Delete QR Code
  const deleteQRCode = async (id) => {
    try {
      await deleteDoc(doc(db, "qrCodes", id));
      alert("QR Code deleted successfully!");
      fetchQRCodes();
    } catch (err) {
      console.error("Error deleting QR Code:", err);
    }
  };

  // React Data Table Columns
  const columns = [
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Created At", selector: (row) => new Date(row.createdAt).toLocaleString() },
    { name: "Expires At", selector: (row) => new Date(row.expiresAt).toLocaleString() },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => downloadQRCode(row)}
            className="bg-green-600 text-white px-4 py-1 rounded-lg hover:bg-green-500"
          >
            Download
          </button>
          <button
            onClick={() => deleteQRCode(row.id)}
            className="bg-red-600 text-white px-4 py-1 rounded-lg hover:bg-red-500"
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code Generator</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium">QR Code Title</label>
            <input
              type="text"
              value={qrTitle}
              onChange={(e) => setQrTitle(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter a title for the QR code"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium">Expiration Time</label>
            <input
              type="datetime-local"
              value={expirationTime}
              onChange={(e) => setExpirationTime(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <button
            onClick={generateQRCode}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500 transition"
          >
            Generate QR Code
          </button>
        </div>
        {showQRCode && qrData && (
          <div className="mt-6 flex flex-col items-center">
            <div id={`qr-code`} className="bg-white p-4 rounded-lg shadow-lg">
              <ReactQRCode value={qrData} size={200} />
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code List</h2>
        <DataTable
          columns={columns}
          data={qrList}
          progressPending={loading}
          pagination
          highlightOnHover
          defaultSortField="createdAt"
          className="bg-white"
        />
      </div>
    </div>
  );
};

export default Dashboard;
