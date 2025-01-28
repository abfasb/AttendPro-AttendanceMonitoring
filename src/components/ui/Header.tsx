import React from "react";

const handleLogout = () => {
  localStorage.removeItem('user');
  window.location.href = '/login';
};

const Header : React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-10">
      <h1 className="text-3xl font-bold text-gray-800">Welcome, Instructor</h1>
      <button onClick={handleLogout} className="bg-gray-800 text-white px-6 py-3 rounded-full hover:bg-gray-700 transition duration-300">
        Logout
      </button>
    </div>
  );
};

export default Header;
