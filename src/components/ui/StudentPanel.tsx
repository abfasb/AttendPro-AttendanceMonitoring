import React, { useState, useEffect, useRef, useCallback } from "react";
import { db } from "../../config/config";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import { 
  FiCamera, FiUpload, FiSave, FiXCircle, FiRotateCw,
  FiCheckCircle, FiInfo, FiLogOut, FiMail, FiUser, FiDribbble
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";

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
  const [isProcessingScan, setIsProcessingScan] = useState<boolean>(false);
  const [cameraFacingMode, setCameraFacingMode] = useState<"user" | "environment">("environment");
  const [hasMultipleCameras, setHasMultipleCameras] = useState<boolean>(false);

  const qrCollectionRef = collection(db, "attendances");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const userData = JSON.parse(localStorage.getItem('user') || '{}');

  // Dropzone configuration
  const { getRootProps, getInputProps } = useDropzone({
    accept: { 'image/*': ['.png', '.jpg', '.jpeg'] },
    onDrop: async (acceptedFiles) => {
      try {
        const file = acceptedFiles[0];
        const image = await readFile(file);
        const qrData = await scanImageForQR(image);
        
        if (qrData) {
          handleScan(qrData);
          setFilePreview(URL.createObjectURL(file));
        } else {
          setError("No QR code found in the image");
        }
      } catch (error) {
        setError(error instanceof Error ? error.message : "Failed to process image");
      }
    },
  });

  const readFile = (file: File): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  };

  const scanImageForQR = (img: HTMLImageElement): string | null => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
  
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const qrCode = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    
    return qrCode?.data || null;
  };

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

  const handleScan = async (data: string | null) => {
    if (!data || isProcessingScan) return;
    setIsProcessingScan(true);

    try {
      const qrData = JSON.parse(data);
      if (!qrData.id) throw new Error("Invalid QR code format");

      const qrCodeQuery = query(collection(db, "qrCodes"), where("__name__", "==", qrData.id));
      const qrCodeSnapshot = await getDocs(qrCodeQuery);
      
      if (qrCodeSnapshot.empty) throw new Error("QR code not found");
      
      const qrCodeDoc = qrCodeSnapshot.docs[0].data();
      const expiresAt = new Date(qrCodeDoc.expiresAt);
      const currentTime = new Date();

      if (qrCodeDoc.status !== "active") throw new Error("This QR code is deactivated");
      if (currentTime > expiresAt) throw new Error("This QR code has expired");

      setAttendance({
        studentName: `${userData.FirstName} ${userData.LastName}`,
        qrData: data,
        createdAt: new Date().toISOString(),
      });
      setIsCameraVisible(false);
      setToastMessage("QR Code scanned successfully!");
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid QR code");
    } finally {
      setIsProcessingScan(false);
    }
  };

  const saveAttendance = async () => {
    if (!attendance.qrData) {
      setError("Please scan a valid QR code first");
      return;
    }

    try {
      const qrCodeData = JSON.parse(attendance.qrData);
      const qrCodeQuery = query(collection(db, "qrCodes"), where("__name__", "==", qrCodeData.id));
      const qrCodeSnapshot = await getDocs(qrCodeQuery);

      if (qrCodeSnapshot.empty) throw new Error("QR code not found");
      
      const qrCodeDoc = qrCodeSnapshot.docs[0].data();
      const expiresAt = new Date(qrCodeDoc.expiresAt);
      const currentTime = new Date();

      if (qrCodeDoc.status !== "active" || currentTime > expiresAt) {
        throw new Error("This QR code is no longer valid");
      }

      const attendanceQuery = query(
        qrCollectionRef,
        where("studentId", "==", userData.uid),
        where("qrCodeId", "==", qrCodeData.id)
      );

      const querySnapshot = await getDocs(attendanceQuery);
      if (!querySnapshot.empty) {
        setError("Attendance already submitted for this session");
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
      setError(err instanceof Error ? err.message : "Failed to save attendance");
    }
  };


  const startCamera = async (facingMode: "user" | "environment") => {
    if (!videoRef.current) return;

    try {
      setIsCameraLoading(true);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }
      });

      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(device => device.kind === 'videoinput');
      setHasMultipleCameras(videoDevices.length > 1);

      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      setIsCameraLoading(false);
    } catch (error) {
      setError("Camera access denied. Please enable permissions.");
      setIsCameraLoading(false);
    }
  };

  const toggleCameraFacing = () => {
    const newMode = cameraFacingMode === "environment" ? "user" : "environment";
    setCameraFacingMode(newMode);
    startCamera(newMode);
  };

  const SCAN_BOX_SIZE = 250; 
  const SCAN_BOX_OFFSET = 50; 
  const SCAN_BOX_RELATIVE_SIZE = 0.6; 
  const SCAN_INTERVAL = 300; 
  const MIN_QR_SIZE = 150; 
  const REQUIRED_CONFIDENCE = 0.7;

  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || isProcessingScan) return;
  
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context || !videoRef.current.videoWidth) return;
  
    const video = videoRef.current;
    const { videoWidth, videoHeight } = video;
    
    canvas.width = videoWidth;
    canvas.height = videoHeight;
    context.drawImage(video, 0, 0, videoWidth, videoHeight);
  
    const minDimension = Math.min(videoWidth, videoHeight);
    const scanSize = Math.max(MIN_QR_SIZE, minDimension * SCAN_BOX_RELATIVE_SIZE);
    const centerX = videoWidth / 2;
    const centerY = videoHeight / 2;
  
    const imageData = context.getImageData(
      centerX - scanSize / 2,
      centerY - scanSize / 2,
      scanSize,
      scanSize
    );
  
    try {
      const qrCode = jsQR(
        imageData.data,
        scanSize,
        scanSize,
        {
          inversionAttempts: 'attemptBoth',
        }
      );
  
      if (qrCode) {
        handleScan(qrCode.data);
      }
    } catch (error) {
      console.error('QR scanning error:', error);
    }
  
    setTimeout(() => {
      requestAnimationFrame(scanFrame);
    }, SCAN_INTERVAL);
  }, [handleScan, isProcessingScan]);

  useEffect(() => {
    if (isCameraVisible) {
      const scanInterval = requestAnimationFrame(scanFrame);
      return () => cancelAnimationFrame(scanInterval);
    }
  }, [isCameraVisible, scanFrame]);


  useEffect(() => {
    if (isCameraVisible) {
      startCamera(cameraFacingMode);
    } else {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    }
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
                        {filePreview ? (
                          <img 
                            src={filePreview} 
                            alt="QR Preview" 
                            className="mb-3 max-h-32 object-contain"
                          />
                        ) : (
                          <FiUpload className="text-3xl text-gray-400 mb-3" />
                        )}
                        <p className="text-gray-600 text-center text-sm">
                          Drag & drop QR image here<br />
                          or click to upload
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                  {attendance.qrData && !success && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-indigo-50 rounded-xl p-6 border border-indigo-200"
                    >
                      <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="mb-4 md:mb-0">
                          <h3 className="text-lg font-semibold text-indigo-800 flex items-center">
                            <FiDribbble className="mr-2" />
                            Valid QR Code Detected!
                          </h3>
                          <p className="text-gray-600 mt-1">
                            Click below to save your attendance
                          </p>
                        </div>
                        <button
                          onClick={saveAttendance}
                          disabled={isProcessingScan}
                          className="w-full md:w-auto bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
                        >
                          <FiSave className="flex-shrink-0" />
                          <span>Save Attendance</span>
                        </button>
                      </div>
                    </motion.div>
                  )}


                {isCameraVisible && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 aspect-video bg-black rounded-xl overflow-hidden relative shadow-lg"
                  >
                     <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <div className="relative">
                              <div className="absolute top-0 left-0 w-full h-1 bg-green-400 animate-scan-beam rounded-full" />
                              
                              <div 
                                className="border-2 border-green-400 rounded-lg"
                                style={{
                                  width: `${SCAN_BOX_SIZE}px`,
                                  height: `${SCAN_BOX_SIZE}px`,
                                  boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)'
                                }}
                              >
                                <div className="absolute -left-1 -top-1 w-6 h-6 border-l-2 border-t-2 border-green-400" />
                                <div className="absolute -right-1 -top-1 w-6 h-6 border-r-2 border-t-2 border-green-400" />
                                <div className="absolute -left-1 -bottom-1 w-6 h-6 border-l-2 border-b-2 border-green-400" />
                                <div className="absolute -right-1 -bottom-1 w-6 h-6 border-r-2 border-b-2 border-green-400" />
                              </div>

                              {/* Help text */}
                              <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 text-center">
                                <p className="text-white text-sm mb-2">
                                  Align QR code within the frame
                                </p>
                                <div className="flex items-center justify-center space-x-2 text-green-400">
                                  <FiInfo className="flex-shrink-0" />
                                  <span className="text-xs">Ensure good lighting and focus</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      

                    {hasMultipleCameras && (
                      <button
                        onClick={toggleCameraFacing}
                        className="absolute bottom-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-all"
                      >
                        <FiRotateCw className="text-white text-xl" />
                      </button>
                    )}

                    <video
                      ref={videoRef}
                      className="w-full h-full object-cover"
                      autoPlay
                      playsInline
                    />
                  </motion.div>
                )}
              </div>

              <AnimatePresence>
                {isProcessingScan && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="bg-blue-50 p-4 rounded-xl border border-blue-200 flex items-center justify-center space-x-2"
                  >
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-blue-600">Scanning QR Code...</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence>
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="bg-green-50 rounded-xl p-6 border border-green-200"
                  >
                    <div className="flex flex-col items-center text-center">
                      <FiCheckCircle className="text-green-600 text-4xl mb-3" />
                      <h3 className="text-xl font-semibold text-green-800 mb-2">
                        Attendance Recorded Successfully!
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Your attendance has been saved to the database.
                      </p>
                      <button
                        onClick={() => {
                          setSuccess("");
                          setAttendance({ studentName: "", qrData: "", createdAt: "" });
                        }}
                        className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white rounded-lg transition-colors"
                      >
                        Scan Again
                      </button>
                    </div>
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