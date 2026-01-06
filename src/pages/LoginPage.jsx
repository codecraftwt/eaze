import React, { useState, useEffect } from "react";
import AuthHeader from "../components/AuthHeader";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, getSalesforceToken } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import logo from '../assets/image.png';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, error, salesforceToken } = useSelector((state) => state.auth);

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
              placeholder="Enter your email"
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
