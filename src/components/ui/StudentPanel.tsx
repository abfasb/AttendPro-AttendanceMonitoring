import React, { useState, useEffect, useRef } from "react";
import { db } from "../../config/config";
import { collection, addDoc } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import html2canvas from "html2canvas";
import jsQR from "jsqr";

interface Student {
  email: string;
  qrData: string;
  createdAt: string;
}

const StudentPanel: React.FC = () => {
  const [student, setStudent] = useState<Student>({
    email: "",
    qrData: "",
    createdAt: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");

  const qrCollectionRef = collection(db, "students");
  const videoRef = useRef<HTMLVideoElement | null>(null); // Video element reference
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Canvas element reference

  const handleScan = (data: string | null) => {
    if (data) {
      const qrPayload = JSON.parse(data);
      if (qrPayload?.email) {
        setStudent({
          email: qrPayload.email,
          qrData: data,
          createdAt: new Date().toISOString(),
        });
        setToastMessage("QR Code scanned successfully!");
      }
    }
  };

  const handleError = (error: any) => {
    setError("Error scanning QR Code.");
    console.error(error);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        const imgElement = new Image();
        imgElement.src = reader.result as string;
        imgElement.onload = async () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          canvas.width = imgElement.width;
          canvas.height = imgElement.height;
          context?.drawImage(imgElement, 0, 0);
          const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
          if (imageData) {
            const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
            if (qrCode) {
              const qrPayload = JSON.parse(qrCode.data);
              setStudent({
                email: qrPayload.email,
                qrData: qrCode.data,
                createdAt: new Date().toISOString(),
              });
              setToastMessage("QR Code detected from image!");
            } else {
              setError("No QR code detected in the image.");
              setToastMessage("");
            }
          }
        };
      };
      reader.readAsDataURL(file);
    },
  });

  const saveStudentData = async () => {
    if (!student.qrData) {
      setError("Please complete all fields.");
      return;
    }

    try {
      await addDoc(qrCollectionRef, student);
      setSuccess("Student added successfully!");
      setToastMessage("Student added to the database!");
      setStudent({  email: "", qrData: "", createdAt: "" });
    } catch (err) {
      console.error("Error saving student data:", err);
      setError("Failed to save student data.");
      setToastMessage("");
    }
  };

  useEffect(() => {
    if (isCameraVisible && videoRef.current && canvasRef.current) {
      const videoElement = videoRef.current;
      const canvasElement = canvasRef.current;
      const context = canvasElement.getContext("2d");

      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch((error) => {
          setError("Error accessing webcam.");
          console.error(error);
        });

      const scanFrame = () => {
        if (videoRef.current && canvasRef.current && context) {
          context.drawImage(videoRef.current, 0, 0, canvasElement.width, canvasElement.height);
          const imageData = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
          const qrCode = jsQR(imageData.data, canvasElement.width, canvasElement.height);

          if (qrCode) {
            handleScan(qrCode.data);
          }

          requestAnimationFrame(scanFrame);
        }
      };

      scanFrame();
    }
  }, [isCameraVisible]);

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Student via QR Code</h2>

        {error && <div className="text-red-500 mb-4">{error}</div>}
        {success && <div className="text-green-500 mb-4">{success}</div>}
        {toastMessage && <div className="bg-indigo-500 text-white px-4 py-2 rounded-md">{toastMessage}</div>}

        <div className="space-y-4">
          <button
            onClick={() => setIsCameraVisible(!isCameraVisible)}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500"
          >
            {isCameraVisible ? "Hide Camera" : "Show Camera"}
          </button>

          {isCameraVisible && (
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm mt-4">
              <h3 className="font-semibold text-lg mb-2">Scan QR Code</h3>
              <video ref={videoRef} style={{ width: "100%" }} />
              <canvas ref={canvasRef} style={{ display: "none" }} />
            </div>
          )}

          <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-lg mb-2">Or Upload QR Code Image</h3>
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500">
                Upload QR Code Image
              </button>
            </div>
          </div>

          <button
            onClick={saveStudentData}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-500"
          >
            Save Student Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentPanel;
