import React, { useState, useEffect } from "react";
import AuthHeader from "../components/AuthHeader";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getSalesforceToken } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo from '../assets/image.png';
import sample from '../assets/image (5).png';
import { FaInfoCircle } from "react-icons/fa";
const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error, salesforceToken } = useSelector((state) => state.auth);
const [showTooltip, setShowTooltip] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  /**
   * -------------------------------------------------------
   * 1. Get Salesforce Token on Load
   * -------------------------------------------------------
   */
  useEffect(() => {
    if (!salesforceToken) {
      dispatch(getSalesforceToken());
    }
  }, [dispatch, salesforceToken]);

  /**
   * -------------------------------------------------------
   * Handle Input Change
   * -------------------------------------------------------
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /**
   * -------------------------------------------------------
   * Handle Login Submit
   * -------------------------------------------------------
   */
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!salesforceToken) {
    toast.warning("Connecting to Salesforce… Please wait");
    return;
  }

  try {
    const result = await dispatch(loginUser(formData));
    console.log(result,'result----')
    if (result.meta.requestStatus === "fulfilled") {
      // toast.success("Login successful!");
      setTimeout(() => navigate("/dashboard"), 900);
    } else {
      console.log(result.payload)
      // 🔥 result.payload contains your API error (e.g., "Invalid email or password")
      toast.error(result.payload || "Login failed");
      if(result.payload=='Request failed with status code 401'){
        localStorage.clear()
        dispatch(getSalesforceToken());
      }
    }

  } catch (error) {
    // 🔥 Catch unexpected runtime errors
    toast.error("Something went wrong. Please try again.");
  }
};


  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Left Section */}
      {/* <div className="w-full md:w-1/2">
        <AuthHeader />
      </div> */}

      {/* Right Section */}
      <div className="w-full  flex justify-center items-center bg-[#e9f2f7]">
        <div className="w-full max-w-sm p-8 bg-white rounded-xl shadow-lg">
          <div className="flex justify-center mb-6">
            <img src={logo} alt="Logo" className="w-24 h-24 object-contain" />
          </div>

          <h2 className="text-3xl font-semibold text-blue-600">Welcome Back</h2>
          {/* --- ADDED NOTE SECTION --- */}
          <div className="mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded flex items-start space-x-2 relative">
            <p className="text-xs text-blue-800 leading-relaxed">
              <strong>Note:</strong> After creating an account or resetting your password, you will receive a <b>username</b> in your email. Please use that username to log in here.
            </p>
            
            {/* Info Icon with Hover Logic */}
            <div 
              className="cursor-pointer text-blue-600 mt-1"
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <FaInfoCircle size={16} />
              
              {/* Tooltip Image Preview */}
              {showTooltip && (
                <div className="absolute z-[100] top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-white border border-gray-200 shadow-2xl rounded-lg w-72">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-t border-l rotate-45"></div>
                  <p className="text-[10px] text-gray-500 mb-1 text-center">Example: Check your email inbox</p>
                  <img 
                    src={sample} 
                    alt="Email Preview" 
                    className="rounded border"
                  />
                  {/* <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-white border-b border-r rotate-45"></div> */}
                </div>
              )}
            </div>
          </div>
          {/* -------------------------- */}
          <p className="mt-2 text-gray-500">
            Sign in to access your applications and dashboard.
          </p>

          {/* ONLY Show Connecting Message, No Errors Here */}
          {!salesforceToken && (
            <p className="mt-4 text-sm text-blue-500 font-medium">
              Connecting to Salesforce…
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your username"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
              required
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-600"
              required
            />

            {/* Reset Password */}
            <div className="flex items-center justify-between">
              <Link to="/forgot-password" className="text-sm text-blue-600">
                Forget Password
              </Link>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={status === "loading" || !salesforceToken}
              className="w-full py-3 bg-blue-600 text-white rounded-md disabled:bg-blue-300"
            >
              {status === "loading"
                ? "Signing In..."
                : !salesforceToken
                ? "Connecting..."
                : "Sign In"}
            </button>

            {/* Register Link */}
            <div className="mt-4 text-center text-sm">
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/register" className="text-blue-600">
                Create one
              </Link>
            </div>

            {/* Switch Portal */}
            <p className="mt-4 text-center text-blue-600 text-sm cursor-pointer">
              Switch to Canada Portal
            </p>
          </form>

          <div className="mt-6 text-center text-xs text-gray-500">
            © 2025 EAZE Consulting. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
