import React, { useState, useEffect, useRef } from "react";
import { db } from "../../config/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import { 
  FiCamera, FiUpload, FiSave, FiXCircle, 
  FiCheckCircle, FiInfo, FiLogOut , FiMail, FiUser, FiDribbble
} from "react-icons/fi";
import { motion, AnimatePresence} from "framer-motion";

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
  const [isCameraLoading, setIsCameraLoading] = useState<boolean>(false);

  const qrCollectionRef = collection(db, "attendances");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  console.log(userData);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);
    return () => clearTimeout(timer);
  }, [toastMessage]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleScan = (data: string | null) => {
    if (data) {
      try {
        const qrData = JSON.parse(data);
        if (!qrData.id) throw new Error("Invalid QR code format");

        setAttendance({
          studentName: `${userData.FirstName} ${userData.LastName}`,
          qrData: data,
          createdAt: new Date().toISOString(),
        });
        setToastMessage("QR Code scanned successfully!");
        setError("");
      } catch (err) {
        setError("Invalid QR Code format - please scan a valid attendance code");
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
      let qrCodeData;
      try {
        qrCodeData = JSON.parse(attendance.qrData);
      } catch (error) {
        throw new Error("Invalid QR code format");
      }

      const attendanceQuery = query(
        qrCollectionRef,
        where("studentId", "==", userData.uid),
        where("qrCodeId", "==", qrCodeData.id)
      );

      const querySnapshot = await getDocs(attendanceQuery);
      if (!querySnapshot.empty) {
        setError("You've already submitted attendance for this session");
        return;
      }

      await addDoc(qrCollectionRef, {
        studentName: `${userData.displayName}`,
        studentId: userData.uid,
        qrCodeId: qrCodeData.id,
        createdAt: new Date().toISOString(),
      });

      setSuccess("Attendance recorded successfully!");
      setToastMessage("Attendance saved to database!");
      setAttendance({ studentName: "", qrData: "", createdAt: "" });
    } catch (err) {
      console.error("Error saving attendance:", err);
      setError(err instanceof Error ? err.message : "Failed to save attendance data.");
    }
  };

  useEffect(() => {
    if (isCameraVisible && videoRef.current) {
      setIsCameraLoading(true);
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "environment" } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
          setIsCameraLoading(false);
        })
        .catch((error) => {
          setError("Camera access denied. Please enable permissions.");
          console.error(error);
          setIsCameraLoading(false);
        });
    }

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <AnimatePresence>
          {toastMessage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 right-4 z-50"
            >
              <div className="bg-indigo-600 text-white px-6 py-3 rounded-lg shadow-xl flex items-center space-x-2">
                <FiInfo className="flex-shrink-0" />
                <span>{toastMessage}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-blue-500 p-6 md:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Welcome, {userData.displayName || "Student"}
                </h1>
                <p className="text-indigo-100 mt-1 flex items-center">
                  <FiMail className="mr-2" />
                  {userData.email}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all"
              >
                <FiLogOut className="flex-shrink-0" />
                <span className="hidden md:inline">Logout</span>
              </button>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-8">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FiUser className="mr-2 text-indigo-600" />
                Student Profile
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-24">First Name:</span>
                    <span>{userData.firstName}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="font-medium w-24">Last Name:</span>
                    <span>{userData.lastName}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center text-gray-600">
                    <FiDribbble className="mr-2 text-indigo-600" />
                    <span className="font-medium">ID:</span>
                    <span className="ml-2 font-mono">{userData.uid}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200">
                <div className="flex flex-col md:flex-row gap-4 items-start">
                  <button
                    onClick={() => setIsCameraVisible(!isCameraVisible)}
                    className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl transition-all flex items-center justify-center space-x-2"
                  >
                    {isCameraVisible ? (
                      <>
                        <FiXCircle className="flex-shrink-0" />
                        <span>Stop Scanner</span>
                      </>
                    ) : (
                      <>
                        <FiCamera className="flex-shrink-0" />
                        <span>Start QR Scanner</span>
                      </>
                    )}
                  </button>

                  <div className="w-full md:flex-1">
                    <div {...getRootProps()} className="cursor-pointer">
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-400 bg-white transition-all">
                        <FiUpload className="text-3xl text-gray-400 mb-3" />
                        <p className="text-gray-600 text-center text-sm">
                          Drag & drop QR image here<br />
                          or click to upload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {isCameraVisible && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg"
                  >
                    {isCameraLoading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent"></div>
                      </div>
                    )}
                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                    <div className="absolute inset-0 border-4 border-indigo-400/30 rounded-xl pointer-events-none" />
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {attendance.qrData && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 rounded-xl p-6 border border-green-200"
                  >
                    <div className="flex items-center mb-3 space-x-2">
                      <FiCheckCircle className="text-green-600 flex-shrink-0" />
                      <h3 className="text-lg font-semibold text-green-800">
                        Attendance Ready to Submit
                      </h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="text-gray-700">
                        <span className="font-medium">Scanned at:</span>{' '}
                        {new Date(attendance.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={saveAttendance}
                      className="mt-4 w-full py-3 bg-green-600 hover:bg-green-500 text-white px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                    >
                      <FiSave className="flex-shrink-0" />
                      <span>Confirm Submission</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-200 flex items-start space-x-2"
                  >
                    <FiXCircle className="flex-shrink-0 mt-1" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentPanel;