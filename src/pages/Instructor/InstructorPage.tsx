import React, { useState } from "react";
import NavBar from "../../components/ui/NavBar";
import Dashboard from "../../components/ui/Dashboard";
import Header from "../../components/ui/Header";
import Overview from "../../components/ui/Overview";
import StudentList from "../../components/ui/StudentList";
import Analytics from "../../components/ui/Analytics";
import Settings from "../../components/ui/Settings";
import ScanQR from "../../components/ui/ScanQR";

const InstructorPage = () => {
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedSection) {
      case "Dashboard":
        return <Dashboard />;
      case "Attendance Overview":
        return <Overview />;
      case "Scan QR Code":
        return <ScanQR />;
      case "Student List":
        return <StudentList />;
      case "Reports & Insights":
        return <Analytics />;
      case "Settings":
        return <Settings />;
      default:
        return <div>Select a section from the navigation menu.</div>;
    }
  };

  return (
    <div className="flex flex-col md:flex-row bg-gray-50 min-h-screen">
      <NavBar onSelect={setSelectedSection} activeSection={selectedSection} />

      <div className="flex-1 p-4 md:p-12 space-y-6 overflow-y-auto bg-white">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default InstructorPage;
