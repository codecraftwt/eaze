import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { FaBars, FaTimes } from 'react-icons/fa';

const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(true); // Desktop mini/expand
  const [mobileOpen, setMobileOpen] = useState(false); // Mobile open/close

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <div
        className={`
          fixed lg:relative h-full bg-gray-800 text-white
          transition-all duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
          ${isOpen ? 'lg:w-64' : 'lg:w-20'} w-64
        `}
      >
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

        {/* Mobile close button */}
        <button
          className="lg:hidden absolute top-4 right-4 text-black text-2xl"
          onClick={() => setMobileOpen(false)}
        >
          <FaTimes />
        </button>
      </div>

      {/* Main content */}
      <div
        className={`
          flex-1 overflow-y-auto
          transition-all duration-300 ease-in-out h-full
        `}
      >
        {/* Mobile hamburger */}
        <div className="lg:hidden p-4">
          <button onClick={() => setMobileOpen(true)} className="text-2xl">
            <FaBars />
          </button>
        </div>

        <Outlet />
      </div>
    </div>
  );
};

export default MainLayout;
