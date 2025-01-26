import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DataTable, { TableColumn } from "react-data-table-component";
import QRCode from "qrcode";
import { db, storage } from "../../config/config";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface QRCodeItem {
  id?: string;
  title: string;
  createdAt: string;
  expiresAt: string;
  status: string;
  imageUrl?: string;
}

const Dashboard: React.FC = () => {
  const [qrTitle, setQrTitle] = useState<string>("");
  const [expirationTime, setExpirationTime] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [showQRCode, setShowQRCode] = useState<boolean>(false);
  const [qrList, setQrList] = useState<QRCodeItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const qrCollectionRef = collection(db, "qrCodes");

  const fetchQRCodes = async () => {
    setLoading(true);
    const data = await getDocs(qrCollectionRef);
    const qrItems = data.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as QRCodeItem[];
    setQrList(qrItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchQRCodes();
  }, []);

  const generateQRCode = async () => {
    if (!qrTitle || !expirationTime) {
      toast.error("Please provide a title and expiration time.");
      return;
    }
  
    const currentTime = new Date().toISOString();
  
    try {
      // 1. First create the Firestore document to get the ID
      const qrDocRef = await addDoc(qrCollectionRef, {
        title: qrTitle,
        createdAt: currentTime,
        expiresAt: expirationTime,
        status: "active",
        imageUrl: "" // Temporary empty value
      });
  
      // 2. Create QR payload WITH THE DOCUMENT ID
      const qrPayload = {
        id: qrDocRef.id, // This is the critical missing piece
        title: qrTitle,
        createdAt: currentTime,
        expiresAt: expirationTime
      };
  
      // 3. Generate QR code with the complete payload
      const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrPayload), {
        width: 300,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
  
      // 4. Upload image to storage
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      const storageRef = ref(storage, `qrCodes/${qrDocRef.id}.png`); // Use document ID as filename
      const uploadTask = await uploadBytes(storageRef, blob);
      const downloadUrl = await getDownloadURL(uploadTask.ref);
  
      // 5. Update the document with image URL
      await updateDoc(qrDocRef, {
        imageUrl: downloadUrl
      });
  
      setQrCodeUrl(qrDataUrl);
      setShowQRCode(true);
      toast.success("QR Code saved successfully!");
      setQrTitle("");
      setExpirationTime("");
      fetchQRCodes();
    } catch (err) {
      toast.error("Error generating QR Code.");
      console.error("Error generating QR Code:", err);
    }
  };

  const deleteQRCode = async (id: string | undefined) => {
    if (!id) return;
    try {
      await deleteDoc(doc(db, "qrCodes", id));
      toast.success("QR Code deleted successfully!");
      fetchQRCodes();
    } catch (err) {
      toast.error("Error deleting QR Code.");
      console.error("Error deleting QR Code:", err);
    }
  };

  const downloadQRCode = async (url: string) => {
    try {
      const link = document.createElement("a");
      link.href = url; 
      link.target = "_blank"; 
      link.download = "qr_code.png";
      link.click();
    } catch (err) {
      toast.error("Error downloading QR Code.");
      console.error("Error downloading QR Code:", err);
    }
  };

  const columns: TableColumn<QRCodeItem>[] = [
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Created At", selector: (row) => new Date(row.createdAt).toLocaleString() },
    { name: "Expires At", selector: (row) => new Date(row.expiresAt).toLocaleString() },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => downloadQRCode(row.imageUrl!)}
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
      <ToastContainer />
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
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">QR Code List</h2>
        <DataTable
          columns={columns}
          data={qrList}
          progressPending={loading}
          pagination
          highlightOnHover
          className="bg-white"
        />
      </div>

      {showQRCode && qrCodeUrl && (
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h3 className="text-xl font-semibold text-gray-700">Generated QR Code</h3>
          <div id="qr-code-preview" className="w-48 h-48 bg-gray-200 mt-4 flex justify-center items-center">
            <img src={qrCodeUrl} alt="QR Code" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
