import React, { useState } from 'react';
import { Outlet } from 'react-router-dom'; // Import Outlet
import Sidebar from './Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa'; // Importing hamburger and close icons

const MainLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // For toggling the sidebar

  // Function to toggle the sidebar on small screens
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar: Fixed on large screens and overlaid on small screens */}
      <div
        className={`fixed lg:relative lg:w-64 w-64 bg-gray-800 text-white h-full transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'transform translate-x-0' : 'transform -translate-x-full'
        } lg:translate-x-0`} // On mobile, it's hidden by default and toggled with transform
      >
        <Sidebar />
        {/* Close Button on Mobile */}
        <div className="lg:hidden absolute top-4 right-4">
          <button onClick={toggleSidebar} className="text-2xl text-white">
            <FaTimes />
          </button>
        </div>
      </div>

      {/* Main Content: Scrollable */}
      <div
        className={`flex-1 p-0 overflow-y-auto h-full transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-64' : 'ml-0' // Adjust layout based on sidebar visibility
        }`}
      >
        {/* Hamburger Icon for small screens */}
        <div className="lg:hidden p-4">
          <button onClick={toggleSidebar} className="text-2xl text-gray-800">
            <FaBars />
          </button>
        </div>

        <Outlet /> {/* This will render the selected page (e.g., Dashboard) */}
      </div>
    </div>
  );
};

export default MainLayout;
