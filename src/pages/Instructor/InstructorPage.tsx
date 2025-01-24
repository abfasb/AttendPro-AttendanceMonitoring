import React, { useState } from "react";
import NavBar from "../../components/ui/NavBar";
import Dashboard from "../../components/ui/Dashboard";
import Header from "../../components/ui/Header";

const InstructorPage = () => {
  const [selectedSection, setSelectedSection] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedSection) {
      case "Dashboard":
        return <Dashboard />;
      // Add additional cases for other sections (e.g., Attendance Overview, Reports).
      default:
        return <div>Select a section from the navigation menu.</div>;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex">
      <NavBar onSelect={setSelectedSection} />
      <div className="flex-1 p-12 space-y-10 overflow-y-auto">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
};

export default InstructorPage;
