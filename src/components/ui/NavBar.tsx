import React from "react";

interface NavBarProps {
    onSelect: (selectedItem: string) => void;
}

const NavBar :React.FC<NavBarProps> = ({ onSelect}) => {
  return (
    <div className="w-72 bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-center mb-10">
          <img
            src="profile-pic.jpg"
            alt="Instructor"
            className="w-20 h-20 rounded-full border-4 border-white shadow-md"
          />
        </div>
        <h2 className="text-3xl font-bold text-center mb-4">Instructor Panel</h2>
        <nav>
          <ul className="space-y-6">
            {["Dashboard", "Attendance Overview", "Scan QR Code", "Student List", "Reports & Insights", "Settings"].map(
              (item) => (
                <li key={item}>
                  <button
                    onClick={() => onSelect(item)}
                    className="block w-full py-3 px-5 rounded-lg text-lg font-medium hover:bg-indigo-700 transition duration-300 text-left"
                  >
                    {item}
                  </button>
                </li>
              )
            )}
          </ul>
        </nav>
      </div>
      <div>
        <button className="bg-red-600 text-white w-full py-3 rounded-lg hover:bg-red-500 transition duration-300">
          Logout
        </button>
      </div>
    </div>
  );
};

export default NavBar;
