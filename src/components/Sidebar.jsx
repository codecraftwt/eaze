import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutGrid,     // Dashboard
  FileText,       // My Report
  Users,          // Affiliate
  HandCoins,      // Loan
  CheckCircle2,   // Funded (or ShieldCheck)
  Layers,         // Applications
  LogOut,
  ClipboardList,
  Menu,
} from "lucide-react";
import logo from '../assets/image.png';
import eazeLogo from "../assets/eaze-logo.png";
import { logout } from '../store/slices/authSlice';
import { persistor } from '../store/store';
import { useDispatch } from 'react-redux';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const dispatch = useDispatch();
  const location = useLocation();
   const navigate = useNavigate();

  const isActive = (path) =>
    location.pathname === path
      ? "bg-blue-100 text-blue-600 font-semibold"
      : "text-gray-500 hover:text-blue-600";

   const handleLogout = () => {
        // 1. Clear persisted Redux data
    // localStorage.removeItem("persist:root");

    // 2. Clear Redux state
    dispatch(logout());
    localStorage.clear()

    // 3. Purge redux-persist cache
    persistor.purge();

    // 4. Redirect to login page
    navigate("/login"); 

  };

  return (
    <div
      className={`
        h-full bg-white shadow-md flex flex-col p-6
        transition-all duration-300 ease-in-out
        ${isOpen ? "w-64" : "w-22"}
      `}
    >
      {/* Logo + Toggle */}
      <div
        className={`
          flex items-center mb-12 transition-all duration-300 ease-in-out
          ${isOpen ? "justify-between" : "flex-col-reverse"}
        `}
      >
        <img src={eazeLogo} alt="Logo" className="w-12 transition-all duration-300 ease-in-out"  style={isOpen ? { width: '170px', height: '70px' } : {}}/>

        {/* Toggle Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-lg hover:bg-gray-100 hidden lg:block text-black transition-all duration-300 ease-in-out"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex flex-col space-y-3 transition-all duration-300 ease-in-out">

        <Link
          to="/dashboard"
          className={`flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive("/dashboard")}`}
        >
          <LayoutGrid size={20} className="transition-all duration-300 ease-in-out" />
          {isOpen && <span className="transition-opacity duration-300 ease-in-out">Dashboard</span>}
        </Link>
<Link
          to="/report"
          className={`flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive("/report")}`}
        >
          <FileText size={20} className="transition-all duration-300 ease-in-out" />
          {isOpen && <span className="transition-opacity duration-300 ease-in-out">My Report</span>}
        </Link>
        <Link
          to="/affiliate"
          className={`flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive("/affiliate")}`}
        >
          <Users size={20} className="transition-all duration-300 ease-in-out" />
          {isOpen && <span className="transition-opacity duration-300 ease-in-out">Become an Affiliate</span>}
        </Link>
        <Link
          to="/loan"
          className={`flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive("/loan")}`}
        >
          <HandCoins size={20} className="transition-all duration-300 ease-in-out" />
          {isOpen && <span className="transition-opacity duration-300 ease-in-out">loan</span>}
        </Link>
        <Link
          to="/funded"
          className={`flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive("/funded")}`}
        >
          <CheckCircle2 size={20} className="transition-all duration-300 ease-in-out" />
          {isOpen && <span className="transition-opacity duration-300 ease-in-out">Funded</span>}
        </Link>
        <Link
          to="/applications"
          className={`flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive("/applications")}`}
        >
          <Layers size={20} className="transition-all duration-300 ease-in-out" />
          {isOpen && <span className="transition-opacity duration-300 ease-in-out">Applications</span>}
        </Link>
        
        
        
        

        <Link
          to="/login"
          onClick={handleLogout}
          className={`flex items-center space-x-3 py-2 px-3 rounded-xl transition-all duration-300 ease-in-out ${isActive("/login")}`}
        >
          <LogOut size={20} className="transition-all duration-300 ease-in-out" />
          {isOpen && <span className="transition-opacity duration-300 ease-in-out">Logout</span>}
        </Link>

      </nav>

      {/* Footer Section */}
      {/* <div className="mt-auto pt-10 flex items-center space-x-2 transition-all duration-300 ease-in-out">
        <img src={logo} className="w-6 transition-all duration-300 ease-in-out" />

        {isOpen && (
          <div className="transition-opacity duration-300 ease-in-out">
            <p className="text-gray-700 text-sm font-semibold">Meta Platforms</p>
            <p className="text-gray-400 text-sm">Hiring Manager</p>
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Sidebar;
