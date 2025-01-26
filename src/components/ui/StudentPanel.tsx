import React, { useState, useEffect, useRef } from "react";
import { db } from "../../config/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import { FiCamera, FiUpload, FiSave, FiXCircle, FiCheckCircle, FiInfo } from "react-icons/fi";

interface Attendance {
  studentName: string;
  qrData: string;
  createdAt: string;
}

const StudentPanel: React.FC = () => {
  const [attendance, setAttendance] = useState<Attendance>({
    studentName: "",
    qrData: "",
    createdAt: "",
  });

  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [isCameraVisible, setIsCameraVisible] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>("");
  const [filePreview, setFilePreview] = useState<string>("");

  const qrCollectionRef = collection(db, "attendances");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Auto-hide toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleScan = (data: string | null) => {
    if (data) {
      try {
        if (data.length > 0) {
          setAttendance({
            studentName: `${userData.displayName}`,
            qrData: data,
            createdAt: new Date().toISOString(),
          });
          setToastMessage("QR Code scanned successfully!");
          setError("");
        }
      } catch (err) {
        setError("Invalid QR Code format");
      }
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop: async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      reader.onloadend = async () => {
        setFilePreview(reader.result as string);
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
              handleScan(qrCode.data);
            } else {
              setError("No QR code detected in the image.");
            }
          }
        };
      };
      reader.readAsDataURL(file);
    },
  });

  const saveAttendance = async () => {
    if (!attendance.qrData) {
      setError("Please scan a valid QR code first");
      return;
    }

    try {
      // Check for existing attendance
      const attendanceQuery = query(
        qrCollectionRef,
        where("studentId", "==", userData.uid),
        where("qrData", "==", attendance.qrData)
      );
      
      const querySnapshot = await getDocs(attendanceQuery);
      if (!querySnapshot.empty) {
        setError("You've already submitted attendance for this session");
        return;
      }

      // Save new attendance
      await addDoc(qrCollectionRef, {
        ...attendance,
        studentId: userData.uid,
        createdAt: new Date().toISOString()
      });
      
      setSuccess("Attendance recorded successfully!");
      setToastMessage("Attendance saved to database!");
      setAttendance({ studentName: "", qrData: "", createdAt: "" });
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error("Error saving attendance:", err);
      setError("Failed to save attendance data.");
    }
  };


  useEffect(() => {
    if (isCameraVisible && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch((error) => {
          setError("Camera access denied. Please enable permissions.");
          console.error(error);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isCameraVisible]);

  useEffect(() => {
    const scanFrame = () => {
      if (videoRef.current && canvasRef.current) {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");
        if (context) {
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
          const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
          const qrCode = jsQR(imageData.data, canvas.width, canvas.height);
          if (qrCode) {
            handleScan(qrCode.data);
          }
        }
        requestAnimationFrame(scanFrame);
      }
    };

    if (isCameraVisible) {
      scanFrame();
    }
  }, [isCameraVisible]);


  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {toastMessage && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-indigo-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center">
              <FiInfo className="mr-2" />
              {toastMessage}
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6">
            Welcome, {userData.displayName || 'Student'}
          </h1>

          <div className="space-y-6">
            {/* QR Scanner Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <button
                onClick={() => setIsCameraVisible(!isCameraVisible)}
                className="w-full md:w-auto bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-500 transition-colors flex items-center justify-center"
              >
                {isCameraVisible ? (
                  <>
                    <FiXCircle className="mr-2" />
                    Stop Scanner
                  </>
                ) : (
                  <>
                    <FiCamera className="mr-2" />
                    Start QR Scanner
                  </>
                )}
              </button>

              {isCameraVisible && (
                <div className="mt-4 aspect-video bg-black rounded-lg overflow-hidden">
                  <video 
                    ref={videoRef} 
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                  />
                </div>
              )}
            </div>

            {/* QR Upload Section */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div {...getRootProps()} className="cursor-pointer">
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-indigo-400 transition-colors">
                  <FiUpload className="text-4xl text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center mb-2">
                    Scan or upload instructor's QR code
                  </p>
                </div>
              </div>
            </div>

            {/* Attendance Preview */}
            {attendance.qrData && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h3 className="text-lg font-semibold text-green-800 mb-2 flex items-center">
                  <FiCheckCircle className="mr-2" />
                  Attendance Ready to Submit
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-700">
                    <span className="font-medium">Student Name:</span> {userData.displayName}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Scan Time:</span>{" "}
                    {new Date(attendance.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Submission Section */}
            {attendance.qrData && (
              <div className="flex flex-col md:flex-row gap-4">
                <button
                  onClick={saveAttendance}
                  className="w-full bg-green-600 text-white px-8 py-3 rounded-lg hover:bg-green-500 transition-colors flex items-center justify-center"
                >
                  <FiSave className="mr-2" />
                  Submit Attendance
                </button>
              </div>
            )}


          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 flex items-center">
              <FiXCircle className="mr-2 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Success Messages */}
          {success && (
            <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 flex items-center">
              <FiCheckCircle className="mr-2 flex-shrink-0" />
              {success}
            </div>
          )}
        </div>
      </div>
    </div>
    </div>
  );
};

export default StudentPanel;