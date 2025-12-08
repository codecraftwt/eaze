import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTachometerAlt, FaClipboardList, FaChalkboardTeacher, FaSignOutAlt } from 'react-icons/fa'; // Using React Icons for better design
import logo from '../assets/image.png';

const Sidebar = () => {
  const location = useLocation(); // Get the current route

  // Helper function to check if the link is active
  const isActive = (path) => location.pathname === path ? 'bg-blue-600 text-white' : 'text-blue-200';

  return (
    <div className="flex flex-col w-64 bg-[#222653] text-white h-screen p-6 space-y-8">
      {/* Logo Section */}
      <div className="flex justify-center items-center space-x-3 mb-12">
        {/* <div className="text-3xl font-semibold text-blue-400">EAZE Consulting</div> */}
        <img src={logo} alt="EAZE Consulting Logo" className="max-w-full h-auto" style={{ width: '200px' ,height:'80px'}} />
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col space-y-6">
        <Link
          to="/dashboard"
          className={`flex items-center space-x-4 text-xl px-4 py-3 rounded-lg ${isActive('/dashboard')} hover:bg-blue-700 hover:text-white transition duration-300`}
        >
          <FaTachometerAlt className="text-2xl" />
          <span>Dashboard</span>
        </Link>
        <Link
          to="/applications"
          className={`flex items-center space-x-4 text-xl px-4 py-3 rounded-lg ${isActive('/applications')} hover:bg-blue-700 hover:text-white transition duration-300`}
        >
          <FaClipboardList className="text-2xl" />
          <span>Applications</span>
        </Link>
        <Link
          to="/training"
          className={`flex items-center space-x-4 text-xl px-4 py-3 rounded-lg ${isActive('/training')} hover:bg-blue-700 hover:text-white transition duration-300`}
        >
          <FaChalkboardTeacher className="text-2xl" />
          <span>Training</span>
        </Link>
        <Link
          to="/login"
          className={`flex items-center space-x-4 text-xl px-4 py-3 rounded-lg ${isActive('/login')} hover:bg-blue-700 hover:text-white transition duration-300`}
        >
          <FaSignOutAlt className="text-2xl" />
          <span>Logout</span>
        </Link>
      </div>

      {/* Footer */}
      <div className="mt-auto text-sm text-center text-blue-300">
        <p>© 2025 EAZE Consulting. All rights reserved.</p>
      </div>
    </div>
  );
};

export default Sidebar;
