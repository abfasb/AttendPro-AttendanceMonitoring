import React, { useState } from "react";
import { FaTachometerAlt, FaChartBar, FaQrcode, FaUsers, FaFileAlt, FaCog } from "react-icons/fa"; // Importing icons from React Icons

interface NavBarProps {
  onSelect: (section: string) => void;
  activeSection: string;
}

const NavBar: React.FC<NavBarProps> = ({ onSelect, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: "Dashboard", icon: <FaTachometerAlt className="h-5 w-5" /> },
    { name: "Attendance Overview", icon: <FaChartBar className="h-5 w-5" /> },
    { name: "Student List", icon: <FaUsers className="h-5 w-5" /> },
    { name: "Reports & Insights", icon: <FaFileAlt className="h-5 w-5" /> },
     {/* ... { name: "Settings", icon: <FaCog className="h-5 w-5" /> }  this part is for the settings i will use it later*/}
  ];

  return (
    <div className="bg-gradient-to-b from-red-600 to-purple-700 text-white p-4 md:p-8 flex flex-col justify-between md:w-72">
      <div className="flex items-center justify-between md:hidden">
        <h2 className="text-xl font-bold">Instructor Panel</h2>
        <button
          className="text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          )}
        </button>
      </div>

      <div
        className={`mt-6 space-y-4 transition-all fixed left-4 duration-300 md:block ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <ul className="space-y-4">
          {navItems.map((item) => (
            <li key={item.name}>
              <button
                onClick={() => {
                  onSelect(item.name);
                  setIsMenuOpen(false);
                }}
                className={`flex items-center space-x-4 w-full py-3 px-5 rounded-lg text-lg font-medium transition duration-300 text-left 
                  ${
                    activeSection === item.name
                      ? "bg-white text-indigo-700 shadow-md"
                      : "hover:bg-indigo-500"
                  }`}
              >
                <span>{item.icon}</span>
                <span>{item.name}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>

    </div>
  );
};

export default NavBar;
