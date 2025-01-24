import React, { useState } from "react";

interface NavBarProps {
  onSelect: (section: string) => void;
  activeSection: string;
}

const NavBar: React.FC<NavBarProps> = ({ onSelect, activeSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    "Dashboard",
    "Attendance Overview",
    "Scan QR Code",
    "Student List",
    "Reports & Insights",
    "Settings",
  ];

  return (
    <div className="bg-gradient-to-b from-indigo-600 to-purple-700 text-white p-4 md:p-8 flex flex-col justify-between md:w-72">
      {/* Mobile Header */}
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
        className={`mt-6 space-y-4 transition-all duration-300 md:block ${
          isMenuOpen ? "block" : "hidden"
        }`}
      >
        <ul>
          {navItems.map((item) => (
            <li key={item}>
              <button
                onClick={() => {
                  onSelect(item);
                  setIsMenuOpen(false);
                }}
                className={`block w-full py-3 px-5 rounded-lg text-lg font-medium transition duration-300 text-left 
                  ${
                    activeSection === item
                      ? "bg-white text-indigo-700 shadow-md"
                      : "bg-indigo-600 hover:bg-indigo-500"
                  }`}
              >
                {item}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 md:mt-0">
        <button className="bg-red-600 text-white w-full py-3 rounded-lg hover:bg-red-500 transition duration-300">
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
